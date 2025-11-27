import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface SendNotificationPayload {
  userId?: string
  userIds?: string[]
  title: string
  body: string
  url?: string
  data?: Record<string, string>
}

// POST - Send push notification
export async function POST(request: NextRequest) {
  try {
    const payload: SendNotificationPayload = await request.json()
    const { userId, userIds, title, body, url, data } = payload

    if (!title || !body) {
      return NextResponse.json(
        { error: 'title и body са задължителни' },
        { status: 400 }
      )
    }

    if (!userId && (!userIds || userIds.length === 0)) {
      return NextResponse.json(
        { error: 'userId или userIds е задължително' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Get FCM tokens for the user(s)
    const targetUserIds = userId ? [userId] : userIds!
    
    const { data: tokens, error } = await supabase
      .from('fcm_tokens')
      .select('token, user_id')
      .in('user_id', targetUserIds)

    if (error) {
      console.error('Error fetching FCM tokens:', error)
      
      // If table doesn't exist
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          sent: 0,
          message: 'No tokens found (table not created)'
        })
      }
    }

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No registered devices found'
      })
    }

    // Send notifications via Firebase Cloud Messaging
    const serverKey = process.env.FIREBASE_SERVER_KEY
    
    if (!serverKey) {
      console.log('FIREBASE_SERVER_KEY not configured')
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'Push notifications not configured (missing server key)'
      })
    }

    const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send'
    
    const results = await Promise.all(
      tokens.map(async ({ token }) => {
        try {
          const response = await fetch(fcmEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': `key=${serverKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: token,
              notification: {
                title,
                body,
                icon: '/icons/icon-192x192.png',
                click_action: url || '/'
              },
              data: {
                ...data,
                url: url || '/'
              }
            })
          })

          return response.ok
        } catch (err) {
          console.error('Error sending to token:', err)
          return false
        }
      })
    )

    const sentCount = results.filter(Boolean).length

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: tokens.length,
      message: `Sent ${sentCount} of ${tokens.length} notifications`
    })

  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

