import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET /api/notifications - Вземи известия за потребител
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const notifications = await db.getNotifications(userId)
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Създай известие
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, type, title, message, data } = body

    // Validation
    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification = await db.createNotification({
      user_id,
      type,
      title,
      message,
      data: data || null,
      read: false
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
