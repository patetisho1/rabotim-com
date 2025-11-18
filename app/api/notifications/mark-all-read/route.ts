import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/errors'

// POST /api/notifications/mark-all-read - Маркирай всички известия като прочетени
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      logger.error('Error marking all notifications as read', { userId, error })
      throw error
    }

    logger.info('All notifications marked as read', { userId })
    return NextResponse.json({ message: 'All notifications marked as read' })
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/notifications/mark-all-read' })
  }
}

