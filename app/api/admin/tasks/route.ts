import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { handleApiError, AuthenticationError, AuthorizationError, NotFoundError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    // Rate limiting (stricter for admin endpoints)
    const rateLimitResult = await rateLimit(request as any, {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 30, // 30 requests per minute for admin
      message: 'Твърде много заявки. Моля опитайте след 1 минута.'
    })
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Unauthorized', ErrorMessages.UNAUTHORIZED)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    // Построяване на заявката
    let query = supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        category,
        location,
        price,
        price_type,
        urgent,
        status,
        applications_count,
        views_count,
        created_at,
        updated_at,
        deadline,
        profiles!tasks_user_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `, { count: 'exact' })

    // Филтри
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    // Пагинация
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: tasks, error, count } = await query

    if (error) {
      logger.error('Error fetching admin tasks', error, { page, limit, search, status, category, userId: user.id })
      throw error
    }

    logger.info('Admin tasks fetched successfully', { 
      userId: user.id, 
      count: tasks?.length || 0, 
      total: count || 0, 
      page, 
      status, 
      category 
    })

    return NextResponse.json({
      tasks: tasks || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/admin/tasks' })
  }
}

export async function PATCH(request: Request) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request as any, {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 30, // 30 requests per minute for admin
      message: 'Твърде много заявки. Моля опитайте след 1 минута.'
    })
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    const { taskId, updates, notes } = await request.json()

    if (!taskId) {
      throw new ValidationError('Task ID is required', ErrorMessages.MISSING_FIELDS)
    }

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Unauthorized', ErrorMessages.UNAUTHORIZED)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('status')
      .eq('id', taskId)
      .single()

    if (fetchError) {
      logger.error('Error loading task before update', fetchError, { taskId, userId: user.id })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    // Обновяване на задачата
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating task', error, { taskId, userId: user.id, updates })
      throw error
    }

    // Определяне на финалния статус
    const statusAfter = updates.status || data.status
    const shouldLogStatusChange = updates.status && existingTask?.status !== updates.status

    // Запис на модерационен лог
    try {
      await supabase.from('task_moderation_logs').insert({
        task_id: taskId,
        moderated_by: user.id,
        action: shouldLogStatusChange ? 'manual_status_update' : 'manual_update',
        status_after: statusAfter,
        notes: notes || (shouldLogStatusChange
          ? `Статус променен от ${existingTask?.status || 'неизвестен'} на ${updates.status}`
          : 'Администратор актуализира задачата')
      })
    } catch (logError) {
      logger.error('Error writing moderation log', logError as Error, { taskId, userId: user.id })
    }

    logger.info('Task updated by admin', { taskId, userId: user.id, updates, statusAfter })

    return NextResponse.json({ task: data })

  } catch (error) {
    return handleApiError(error, { endpoint: 'PATCH /api/admin/tasks' })
  }
}

export async function DELETE(request: Request) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request as any, {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 10, // 10 delete requests per minute (stricter)
      message: 'Твърде много заявки за изтриване. Моля опитайте след 1 минута.'
    })
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      throw new ValidationError('ID на задача е задължително', ErrorMessages.MISSING_FIELDS)
    }

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Unauthorized', ErrorMessages.UNAUTHORIZED)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    // Проверка дали задачата съществува
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .single()

    if (fetchError || !existingTask) {
      logger.error('Task not found for deletion', fetchError as Error, { taskId, userId: user.id })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    // Изтриване на задачата (ще изтрие и свързаните данни заради CASCADE)
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      logger.error('Error deleting task', error, { taskId, userId: user.id })
      throw error
    }

    logger.info('Task deleted by admin', { taskId, userId: user.id })

    return NextResponse.json({ success: true })

  } catch (error) {
    return handleApiError(error, { endpoint: 'DELETE /api/admin/tasks' })
  }
}
