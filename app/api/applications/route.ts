import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError, ValidationError, NotFoundError, ConflictError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// POST - Кандидатстване за задача
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (stricter for applications)
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.applications)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    const { task_id, user_id, message, proposed_price } = body

    if (!task_id || !user_id) {
      throw new ValidationError('task_id и user_id са задължителни', ErrorMessages.MISSING_FIELDS, { body })
    }

    // Проверка дали потребителят вече е кандидатствал
    const { data: existing, error: checkError } = await supabase
      .from('task_applications')
      .select('id')
      .eq('task_id', task_id)
      .eq('user_id', user_id)
      .maybeSingle()

    // Ако има грешка, която не е "не намерен запис", хвърляме грешка
    if (checkError && (checkError as any).code !== 'PGRST116') {
      logger.error('Error checking existing application', checkError, { task_id, user_id })
      return handleApiError(checkError, { endpoint: 'POST /api/applications', task_id, user_id })
    }

    if (existing) {
      throw new ConflictError('Вече сте кандидатствали за тази задача', ErrorMessages.ALREADY_APPLIED)
    }

    // Създаване на кандидатура
    const { data, error } = await supabase
      .from('task_applications')
      .insert([{
        task_id,
        user_id,
        message: message || '',
        proposed_price: proposed_price || null,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      logger.error('Error creating application', error, { task_id, user_id })
      return handleApiError(error, { endpoint: 'POST /api/applications', task_id, user_id })
    }

    // Създаване на нотификация за собственика на задачата
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('user_id, title')
      .eq('id', task_id)
      .single()

    // Ако задачата не съществува, това е сериозна грешка
    if (taskError || !task) {
      logger.error('Task not found when creating application', taskError, { task_id, user_id })
      // Не хвърляме грешка тук, защото кандидатурата вече е създадена
      // Но логваме за диагностика
    } else if (task && task.user_id) {
      // Опитваме се да създадем нотификация, но не блокираме ако не успее
      try {
        const { data: applicant } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user_id)
          .maybeSingle()

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert([{
            user_id: task.user_id,
            type: 'new_application',
            title: 'Нова кандидатура',
            message: `${applicant?.full_name || 'Потребител'} кандидатства за "${task.title}"`,
            data: {
              task_id,
              application_id: data.id,
              applicant_id: user_id
            },
            read: false
          }])

        if (notificationError) {
          logger.warn('Error creating notification for application', notificationError, { 
            task_id, 
            user_id, 
            application_id: data.id 
          })
        }
      } catch (notificationErr) {
        logger.warn('Exception creating notification for application', notificationErr as Error, { 
          task_id, 
          user_id, 
          application_id: data.id 
        })
      }
    }

    logger.info('Application created successfully', { application_id: data.id, task_id, user_id })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/applications' })
  }
}

// GET - Получаване на кандидатури (за потребител или за задача)
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const { searchParams } = new URL(request.url)
    const task_id = searchParams.get('task_id')
    const user_id = searchParams.get('user_id')

    let query = supabase
      .from('task_applications')
      .select(`
        *,
        task:tasks(id, title, price, price_type),
        user:users(id, full_name, avatar_url, rating)
      `)

    if (task_id) {
      query = query.eq('task_id', task_id)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching applications', error, { task_id, user_id })
      return handleApiError(error, { endpoint: 'GET /api/applications', task_id, user_id })
    }

    logger.info('Applications fetched successfully', { count: data?.length || 0, task_id, user_id })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/applications' })
  }
}

// PATCH - Обновяване на статус на кандидатура (приемане/отхвърляне)
export async function PATCH(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    const { application_id, status, task_id, requester_id, reason } = body

    if (!application_id || !status || !task_id || !requester_id) {
      throw new ValidationError(
        'application_id, status, task_id и requester_id са задължителни',
        ErrorMessages.MISSING_FIELDS,
        { body }
      )
    }

    if (!['accepted', 'rejected'].includes(status)) {
      throw new ValidationError(
        'Невалиден статус. Разрешени са accepted или rejected.',
        ErrorMessages.INVALID_DATA,
        { status }
      )
    }

    // Проверка дали заявителя е собственик на задачата
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('user_id, title, status')
      .eq('id', task_id)
      .single()

    if (taskError || !task) {
      logger.error('Task not found', taskError as Error, { task_id, requester_id })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    if (task.user_id !== requester_id) {
      throw new ValidationError(
        'Нямате права да управлявате кандидатурите за тази задача',
        ErrorMessages.FORBIDDEN,
        { task_id, requester_id, task_owner: task.user_id }
      )
    }

    // Зареждаме кандидатурата и кандидата
    const { data: application, error: applicationError } = await supabase
      .from('task_applications')
      .select('id, task_id, user_id, status')
      .eq('id', application_id)
      .single()

    if (applicationError || !application) {
      logger.error('Application not found', applicationError as Error, { application_id, task_id })
      throw new NotFoundError('Кандидатурата не е намерена', ErrorMessages.APPLICATION_NOT_FOUND)
    }

    // Обновяваме статуса
    const { data: updatedApplication, error: updateError } = await supabase
      .from('task_applications')
      .update({ status })
      .eq('id', application_id)
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .single()

    if (updateError) {
      logger.error('Error updating application', updateError, { application_id, status })
      return handleApiError(updateError, { endpoint: 'PATCH /api/applications', application_id })
    }

    // Ако статусът е accepted → отхвърляме всички останали кандидатури и обновяваме задачата
    if (status === 'accepted') {
      const { error: rejectOthersError } = await supabase
        .from('task_applications')
        .update({ status: 'rejected' })
        .eq('task_id', task_id)
        .neq('id', application_id)

      if (rejectOthersError) {
        const error = rejectOthersError instanceof Error ? rejectOthersError : new Error(String(rejectOthersError))
        logger.warn('Error rejecting other applications', error, { task_id, application_id })
      }

      const { error: updateTaskStatusError } = await supabase
        .from('tasks')
        .update({ status: 'assigned' })
        .eq('id', task_id)

      if (updateTaskStatusError) {
        const error = updateTaskStatusError instanceof Error ? updateTaskStatusError : new Error(String(updateTaskStatusError))
        logger.warn('Error updating task status', error, { task_id, status: 'assigned' })
      }
    } else if (status === 'rejected') {
      // Ако отказваме кандидатура и няма други приети → връщаме задачата в активна
      const { data: acceptedApplications } = await supabase
        .from('task_applications')
        .select('id')
        .eq('task_id', task_id)
        .eq('status', 'accepted')

      if (!acceptedApplications || acceptedApplications.length === 0) {
        const { error: revertTaskStatusError } = await supabase
          .from('tasks')
          .update({ status: 'active' })
          .eq('id', task_id)

        if (revertTaskStatusError) {
          const error = revertTaskStatusError instanceof Error ? revertTaskStatusError : new Error(String(revertTaskStatusError))
          logger.warn('Error reverting task status', error, { task_id, status: 'active' })
        }
      }
    }

    // Нотификация към кандидата
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        user_id: application.user_id,
        type: status === 'accepted' ? 'application_accepted' : 'application_rejected',
        title: status === 'accepted' ? 'Кандидатурата е одобрена' : 'Кандидатурата е отхвърлена',
        message: status === 'accepted'
          ? `Вашата кандидатура за "${task.title}" беше одобрена.`
          : `Вашата кандидатура за "${task.title}" беше отхвърлена.${reason ? ` Причина: ${reason}` : ''}`,
        data: {
          task_id,
          application_id,
          status,
        },
        read: false
      }])

    if (notificationError) {
      const error = notificationError instanceof Error ? notificationError : new Error(String(notificationError))
      logger.warn('Error creating notification', error, { application_id, status })
    }

    logger.info('Application status updated', { application_id, status, task_id, requester_id })

    return NextResponse.json(updatedApplication, { status: 200 })
  } catch (error) {
    return handleApiError(error, { endpoint: 'PATCH /api/applications' })
  }
}
