import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// GET /api/messages - Вземи разговори за потребител
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

    const conversations = await db.getConversations(userId)
    logger.info('Conversations fetched successfully', { userId, count: conversations?.length || 0 })
    return NextResponse.json(conversations)
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/messages' })
  }
}

// POST /api/messages - Изпрати съобщение
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (stricter for messaging)
    const rateLimitResult = await rateLimit(request, {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 30, // 30 messages per minute
      message: 'Твърде много съобщения. Моля опитайте след 1 минута.'
    })
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    const { conversation_id, sender_id, receiver_id, content, attachments } = body

    // Validation
    if (!conversation_id || !sender_id || !receiver_id || !content) {
      throw new ValidationError('Missing required fields', ErrorMessages.MISSING_FIELDS, { body })
    }

    const message = await db.sendMessage({
      conversation_id,
      sender_id,
      receiver_id,
      content,
      attachments: attachments || []
    })

    logger.info('Message sent successfully', { messageId: message.id, conversation_id, sender_id, receiver_id })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/messages' })
  }
}
