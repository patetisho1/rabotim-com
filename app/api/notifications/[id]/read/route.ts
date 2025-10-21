import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// PUT /api/notifications/[id]/read - Маркирай известие като прочетено
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.markNotificationRead(params.id)
    return NextResponse.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
