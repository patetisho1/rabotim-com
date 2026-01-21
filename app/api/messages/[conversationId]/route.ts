import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// GET /api/messages/[conversationId] - Вземи съобщения от разговор
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const messages = await db.getMessages(params.conversationId)
    return NextResponse.json(messages)
  } catch (error) {
    logger.error('Error fetching messages', error as Error, { conversationId: params.conversationId })
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
