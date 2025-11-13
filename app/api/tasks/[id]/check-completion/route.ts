import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import { handleApiError, AuthenticationError } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// POST /api/tasks/[id]/check-completion - Check and auto-complete task if 7 days passed
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new AuthenticationError('Unauthorized', 'Необходима е автентикация')
    }

    const taskId = params.id

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Check if task should be auto-completed
    const { data: wasCompleted, error: checkError } = await supabase.rpc(
      'check_and_auto_complete_task',
      { task_id_param: taskId }
    )

    if (checkError) {
      logger.error('Error checking auto-completion', checkError, { taskId })
      return handleApiError(checkError, { endpoint: 'POST /api/tasks/[id]/check-completion' })
    }

    logger.info('Task auto-completion check completed', { 
      taskId, 
      wasCompleted: wasCompleted || false 
    })

    return NextResponse.json({
      success: true,
      autoCompleted: wasCompleted || false
    })
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/tasks/[id]/check-completion' })
  }
}

