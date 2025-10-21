import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET /api/messages - Вземи разговори за потребител
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

    const conversations = await db.getConversations(userId)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Изпрати съобщение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversation_id, sender_id, receiver_id, content, attachments } = body

    // Validation
    if (!conversation_id || !sender_id || !receiver_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const message = await db.sendMessage({
      conversation_id,
      sender_id,
      receiver_id,
      content,
      attachments: attachments || []
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
