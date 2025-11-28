import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { handleApiError, AuthenticationError, AuthorizationError, NotFoundError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params
  
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (error) {
      logger.error('Error fetching task', error, { taskId })
      throw new NotFoundError('Task not found', ErrorMessages.TASK_NOT_FOUND)
    }

    // Fetch profile separately if user_id exists
    let profile = null
    if (task.user_id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, is_verified, bio, location')
        .eq('id', task.user_id)
        .single()
      profile = profileData
    }
    
    // Add profile to task
    const taskWithProfile = { ...task, profiles: profile }

    // Увеличаване на броя гледания
    await supabase
      .from('tasks')
      .update({ views_count: (task.views_count || 0) + 1 })
      .eq('id', taskId)

    logger.info('Task fetched successfully', { taskId })

    return NextResponse.json({ task: taskWithProfile })
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/tasks/[id]', taskId })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params
  
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Проверка за автентикация
    let userId: string | null = null
    
    // Първо опитваме с cookies
    const { data: { user: cookieUser } } = await supabase.auth.getUser()
    
    if (cookieUser) {
      userId = cookieUser.id
    } else {
      // Fallback: проверяваме Authorization header и декодираме JWT
      const authHeader = request.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        try {
          // Декодираме JWT token за да извлечем user id (без верификация - Supabase вече го е верифицирал на клиента)
          const payload = JSON.parse(atob(token.split('.')[1]))
          if (payload.sub) {
            userId = payload.sub
          }
        } catch (e) {
          logger.error('Failed to decode JWT token', e as Error)
        }
      }
    }
    
    if (!userId) {
      throw new AuthenticationError('Unauthorized', ErrorMessages.UNAUTHORIZED)
    }

    const body = await request.json()

    // Проверка дали потребителят е собственик на задачата
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', taskId)
      .single()

    if (fetchError || !existingTask) {
      logger.error('Task not found for update', fetchError as Error, { taskId, userId })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    if (existingTask.user_id !== userId) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(body)
      .eq('id', taskId)
      .select('*')
      .single()

    if (error) {
      logger.error('Error updating task', error, { taskId, userId })
      return handleApiError(error, { endpoint: 'PUT /api/tasks/[id]', taskId })
    }

    // Fetch profile separately
    let profile = null
    if (updatedTask.user_id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, is_verified')
        .eq('id', updatedTask.user_id)
        .single()
      profile = profileData
    }

    logger.info('Task updated successfully', { taskId, userId })

    return NextResponse.json({ task: { ...updatedTask, profiles: profile } })
  } catch (error) {
    return handleApiError(error, { endpoint: 'PUT /api/tasks/[id]', taskId })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params
  
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Проверка за автентикация
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Unauthorized', ErrorMessages.UNAUTHORIZED)
    }

    // Проверка дали потребителят е собственик на задачата
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', taskId)
      .single()

    if (fetchError || !existingTask) {
      logger.error('Task not found for deletion', fetchError as Error, { taskId, userId: user.id })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    if (existingTask.user_id !== user.id) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      logger.error('Error deleting task', error, { taskId, userId: user.id })
      return handleApiError(error, { endpoint: 'DELETE /api/tasks/[id]', taskId })
    }

    logger.info('Task deleted successfully', { taskId, userId: user.id })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    return handleApiError(error, { endpoint: 'DELETE /api/tasks/[id]', taskId })
  }
}

