import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// GET /api/notifications - Вземи известия за потребител
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      throw new ValidationError('User ID is required', ErrorMessages.MISSING_FIELDS)
    }

    const notifications = await db.getNotifications(userId)
    logger.info('Notifications fetched successfully', { userId, count: notifications?.length || 0 })
    return NextResponse.json(notifications)
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/notifications' })
  }
}

// POST /api/notifications - Създай известие
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    const { user_id, type, title, message, data } = body

    // Validation
    if (!user_id || !type || !title || !message) {
      throw new ValidationError('Missing required fields', ErrorMessages.MISSING_FIELDS, { body })
    }

    const notification = await db.createNotification({
      user_id,
      type,
      title,
      message,
      data: data || null,
      read: false
    })

    logger.info('Notification created successfully', { notificationId: notification.id, user_id, type })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/notifications' })
  }
}
