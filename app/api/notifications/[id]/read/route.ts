import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// PUT /api/notifications/[id]/read - Маркирай известие като прочетено
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.markNotificationRead(params.id)
    return NextResponse.json({ message: 'Notification marked as read' })
  } catch (error) {
    logger.error('Error marking notification as read', error as Error, { notificationId: params.id })
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
