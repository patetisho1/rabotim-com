import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { handleApiError, AuthenticationError, AuthorizationError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const taskId = url.searchParams.get('taskId')

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

    // Rate limiting
    const rateLimitResult = await rateLimit(request as any, {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 30, // 30 requests per minute for admin
      message: 'Твърде много заявки. Моля опитайте след 1 минута.'
    })
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
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

    if (!taskId) {
      throw new ValidationError('taskId е задължителен', ErrorMessages.MISSING_FIELDS)
    }

    const { data: logs, error } = await supabase
      .from('task_moderation_logs')
      .select(`
        id,
        task_id,
        action,
        status_after,
        issues,
        notes,
        created_at,
        moderator:users!task_moderation_logs_moderated_by_fkey (
          id,
          full_name,
          email
        )
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching moderation logs', error, { taskId, userId: user.id })
      return handleApiError(error, { endpoint: 'GET /api/admin/tasks/logs', taskId })
    }

    logger.info('Moderation logs fetched successfully', { taskId, count: logs?.length || 0, userId: user.id })

    return NextResponse.json({ logs: logs || [] })
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/admin/tasks/logs' })
  }
}

