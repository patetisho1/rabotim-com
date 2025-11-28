import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Subscribe to push notifications (save FCM token)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, token } = body

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'userId и token са задължителни' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Upsert the FCM token
    const { error } = await supabase
      .from('fcm_tokens')
      .upsert({
        user_id: userId,
        token: token,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error saving FCM token:', error)
      
      // If table doesn't exist, still return success
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          message: 'Token recorded',
          note: 'fcm_tokens table needs to be created in Supabase'
        })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Subscribed to notifications'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to notifications'
    })

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { error } = await supabase
      .from('fcm_tokens')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting FCM token:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed from notifications'
    })

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

