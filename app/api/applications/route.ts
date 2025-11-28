import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceRoleClient } from '@/lib/supabase'
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

    // Използваме service role client за да bypass-нем RLS
    const supabaseAdmin = getServiceRoleClient()

    // Проверка дали потребителят вече е кандидатствал
    const { data: existing, error: checkError } = await supabaseAdmin
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
    const { data, error } = await supabaseAdmin
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
    const { data: task, error: taskError } = await supabaseAdmin
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
        const { data: applicant } = await supabaseAdmin
          .from('users')
          .select('full_name')
          .eq('id', user_id)
          .maybeSingle()

        const { error: notificationError } = await supabaseAdmin
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

        // Изпращане на email нотификация към собственика на задачата
        try {
          const { data: taskOwner } = await supabaseAdmin
            .from('users')
            .select('email, full_name')
            .eq('id', task.user_id)
            .maybeSingle()

          if (taskOwner?.email) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'task_application',
                to: taskOwner.email,
                taskOwner: taskOwner.full_name || 'Потребител',
                applicantName: applicant?.full_name || 'Потребител',
                taskTitle: task.title
              })
            })
            logger.info('New application email sent', { task_id, application_id: data.id, email: taskOwner.email })
          }
        } catch (emailErr) {
          logger.warn('Error sending new application email', emailErr as Error, { task_id, application_id: data.id })
        }

        // Създаване на conversation и начално съобщение между собственика на задачата и кандидата
        try {
          // Генериране на conversation_id като сортирани user IDs разделени с долна черта
          const conversationId = [task.user_id, user_id].sort().join('_')
          
          // Начално съобщение от кандидата към собственика на задачата
          const initialMessageContent = message 
            ? `Кандидатствам за задачата "${task.title}".\n\n${message}`
            : `Кандидатствам за задачата "${task.title}".`

          const { error: messageError } = await supabaseAdmin
            .from('messages')
            .insert([{
              conversation_id: conversationId,
              sender_id: user_id, // Кандидатът изпраща първото съобщение
              receiver_id: task.user_id, // Собственикът на задачата го получава
              content: initialMessageContent,
              read_at: null
            }])

          if (messageError) {
            logger.warn('Error creating initial message for application', messageError, { 
              task_id, 
              user_id, 
              application_id: data.id,
              conversation_id: conversationId
            })
          } else {
            logger.info('Initial conversation message created for application', { 
              conversation_id: conversationId,
              task_id, 
              user_id, 
              application_id: data.id 
            })
          }
        } catch (messageErr) {
          logger.warn('Exception creating initial message for application', messageErr as Error, { 
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
    console.error('Exception in POST /api/applications:', error)
    logger.error('Exception in POST /api/applications', error as Error, { 
      endpoint: 'POST /api/applications' 
    })
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

    // Използваме service role client за да bypass-нем RLS
    const supabaseAdmin = getServiceRoleClient()

    let query = supabaseAdmin
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

    // Използваме service role client за да bypass-нем RLS
    const supabaseAdmin = getServiceRoleClient()

    // Проверка дали заявителя е собственик на задачата
    const { data: task, error: taskError } = await supabaseAdmin
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
    const { data: application, error: applicationError } = await supabaseAdmin
      .from('task_applications')
      .select('id, task_id, user_id, status')
      .eq('id', application_id)
      .single()

    if (applicationError || !application) {
      logger.error('Application not found', applicationError as Error, { application_id, task_id })
      throw new NotFoundError('Кандидатурата не е намерена', ErrorMessages.APPLICATION_NOT_FOUND)
    }

    // Обновяваме статуса
    const { data: updatedApplication, error: updateError } = await supabaseAdmin
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
      // Отхвърляне на останалите кандидатури
      const { error: rejectOthersError } = await supabaseAdmin
        .from('task_applications')
        .update({ status: 'rejected' })
        .eq('task_id', task_id)
        .neq('id', application_id)
        .neq('status', 'rejected') // Само тези които все още не са отхвърлени

      if (rejectOthersError) {
        const error = rejectOthersError instanceof Error ? rejectOthersError : new Error(String(rejectOthersError))
        logger.warn('Error rejecting other applications', error, { task_id, application_id })
      } else {
        logger.info('Rejected other applications', { task_id, application_id, accepted_user_id: application.user_id })
      }

      // Обновяване на статуса на задачата на 'in_progress'
      const { error: updateTaskStatusError } = await supabaseAdmin
        .from('tasks')
        .update({ status: 'in_progress' })
        .eq('id', task_id)

      if (updateTaskStatusError) {
        const error = updateTaskStatusError instanceof Error ? updateTaskStatusError : new Error(String(updateTaskStatusError))
        logger.warn('Error updating task status to in_progress', error, { task_id })
      } else {
        logger.info('Task status updated to in_progress', { task_id, accepted_user_id: application.user_id })
      }

      // Създаване на нотификация за приетия кандидат
      try {
        const { data: taskOwner } = await supabaseAdmin
          .from('users')
          .select('full_name')
          .eq('id', task.user_id)
          .maybeSingle()

        const { error: notificationError } = await supabaseAdmin
          .from('notifications')
          .insert([{
            user_id: application.user_id,
            type: 'application_accepted',
            title: 'Кандидатурата ви е приета',
            message: `${taskOwner?.full_name || 'Работодател'} прие кандидатурата ви за "${task.title}"`,
            data: {
              task_id,
              application_id: application.id
            },
            read: false
          }])

        if (notificationError) {
          logger.warn('Error creating acceptance notification', notificationError, { 
            task_id, 
            application_id, 
            user_id: application.user_id 
          })
        }

        // Изпращане на email нотификация
        if (updatedApplication?.user?.email) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'application_accepted',
                to: updatedApplication.user.email,
                applicantName: updatedApplication.user.full_name || 'Потребител',
                taskTitle: task.title,
                taskOwnerName: taskOwner?.full_name || 'Работодател',
                taskId: task_id
              })
            })
            logger.info('Acceptance email sent', { task_id, application_id, email: updatedApplication.user.email })
          } catch (emailErr) {
            logger.warn('Error sending acceptance email', emailErr as Error, { task_id, application_id })
          }
        }
      } catch (notificationErr) {
        logger.warn('Exception creating acceptance notification', notificationErr as Error, { 
          task_id, 
          application_id 
        })
      }
    } else if (status === 'rejected') {
      // Ако отказваме кандидатура и няма други приети → връщаме задачата в active (само ако вече е била in_progress)
      if (task.status === 'in_progress') {
        const { data: acceptedApplications } = await supabaseAdmin
          .from('task_applications')
          .select('id')
          .eq('task_id', task_id)
          .eq('status', 'accepted')

        if (!acceptedApplications || acceptedApplications.length === 0) {
          const { error: revertTaskStatusError } = await supabaseAdmin
            .from('tasks')
            .update({ status: 'active' })
            .eq('id', task_id)

          if (revertTaskStatusError) {
            const error = revertTaskStatusError instanceof Error ? revertTaskStatusError : new Error(String(revertTaskStatusError))
            logger.warn('Error reverting task status to active', error, { task_id })
          } else {
            logger.info('Task status reverted to active', { task_id, rejected_application_id: application_id })
          }
        }
      }

      // Създаване на нотификация за отхвърления кандидат
      try {
        const { data: taskOwner } = await supabaseAdmin
          .from('users')
          .select('full_name')
          .eq('id', task.user_id)
          .maybeSingle()

        const { error: notificationError } = await supabaseAdmin
          .from('notifications')
          .insert([{
            user_id: application.user_id,
            type: 'application_rejected',
            title: 'Кандидатурата ви е отхвърлена',
            message: reason 
              ? `${taskOwner?.full_name || 'Работодател'} отхвърли кандидатурата ви за "${task.title}". Причина: ${reason}`
              : `${taskOwner?.full_name || 'Работодател'} отхвърли кандидатурата ви за "${task.title}"`,
            data: {
              task_id,
              application_id: application.id,
              reason: reason || null
            },
            read: false
          }])

        if (notificationError) {
          logger.warn('Error creating rejection notification', notificationError, { 
            task_id, 
            application_id, 
            user_id: application.user_id 
          })
        }

        // Изпращане на email нотификация
        if (updatedApplication?.user?.email) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'application_rejected',
                to: updatedApplication.user.email,
                applicantName: updatedApplication.user.full_name || 'Потребител',
                taskTitle: task.title,
                reason: reason || undefined
              })
            })
            logger.info('Rejection email sent', { task_id, application_id, email: updatedApplication.user.email })
          } catch (emailErr) {
            logger.warn('Error sending rejection email', emailErr as Error, { task_id, application_id })
          }
        }
      } catch (notificationErr) {
        logger.warn('Exception creating rejection notification', notificationErr as Error, { 
          task_id, 
          application_id 
        })
      }
    }

    logger.info('Application status updated', { application_id, status, task_id, requester_id })

    return NextResponse.json(updatedApplication, { status: 200 })
  } catch (error) {
    return handleApiError(error, { endpoint: 'PATCH /api/applications' })
  }
}
