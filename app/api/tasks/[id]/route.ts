import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { handleApiError, AuthenticationError, AuthorizationError, NotFoundError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .select(`
        *,
        profiles!tasks_user_id_fkey (
          id,
          full_name,
          avatar_url,
          is_verified,
          bio,
          location
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      logger.error('Error fetching task', error, { taskId: params.id })
      throw new NotFoundError('Task not found', ErrorMessages.TASK_NOT_FOUND)
    }

    // Увеличаване на броя гледания
    await supabase
      .from('tasks')
      .update({ views_count: (task.views_count || 0) + 1 })
      .eq('id', params.id)

    logger.info('Task fetched successfully', { taskId: params.id })

    return NextResponse.json({ task })
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/tasks/[id]', taskId: params.id })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()

    // Проверка дали потребителят е собственик на задачата
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingTask) {
      logger.error('Task not found for update', fetchError as Error, { taskId: params.id, userId: user.id })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    if (existingTask.user_id !== user.id) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(body)
      .eq('id', params.id)
      .select(`
        *,
        profiles!tasks_user_id_fkey (
          id,
          full_name,
          avatar_url,
          is_verified
        )
      `)
      .single()

    if (error) {
      logger.error('Error updating task', error, { taskId: params.id, userId: user.id })
      return handleApiError(error, { endpoint: 'PUT /api/tasks/[id]', taskId: params.id })
    }

    logger.info('Task updated successfully', { taskId: params.id, userId: user.id })

    return NextResponse.json({ task })
  } catch (error) {
    return handleApiError(error, { endpoint: 'PUT /api/tasks/[id]', taskId: params.id })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .eq('id', params.id)
      .single()

    if (fetchError || !existingTask) {
      logger.error('Task not found for deletion', fetchError as Error, { taskId: params.id, userId: user.id })
      throw new NotFoundError('Задачата не е намерена', ErrorMessages.TASK_NOT_FOUND)
    }

    if (existingTask.user_id !== user.id) {
      throw new AuthorizationError('Forbidden', ErrorMessages.FORBIDDEN)
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) {
      logger.error('Error deleting task', error, { taskId: params.id, userId: user.id })
      return handleApiError(error, { endpoint: 'DELETE /api/tasks/[id]', taskId: params.id })
    }

    logger.info('Task deleted successfully', { taskId: params.id, userId: user.id })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    return handleApiError(error, { endpoint: 'DELETE /api/tasks/[id]', taskId: params.id })
  }
}

