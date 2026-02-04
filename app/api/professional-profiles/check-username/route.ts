import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { validateUsername } from '@/types/professional-profile'

/**
 * GET ?username=xxx&userId=yyy
 * Returns whether the username is available for use.
 * - If no profile has it: available
 * - If current user's profile has it: available (own profile)
 * - If another user's profile has it and is_premium: not available
 * - If another user's profile has it and not premium: available (can take it)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')?.toLowerCase()
    const userId = searchParams.get('userId')

    if (!username) {
      return NextResponse.json(
        { available: false, error: 'Липсва потребителско име' },
        { status: 400 }
      )
    }

    const validation = validateUsername(username)
    if (!validation.valid) {
      return NextResponse.json(
        { available: false, error: validation.error },
        { status: 200 }
      )
    }

    const serviceClient = getServiceRoleClient()
    const { data: existing } = await serviceClient
      .from('professional_profiles')
      .select('user_id, is_premium')
      .eq('username', username)
      .single()

    if (!existing) {
      return NextResponse.json({ available: true })
    }

    if (userId && existing.user_id === userId) {
      return NextResponse.json({ available: true, ownProfile: true })
    }

    if (existing.is_premium === true) {
      return NextResponse.json({
        available: false,
        byPremium: true,
        error: 'Това потребителско име е заето от премиум акаунт'
      })
    }

    return NextResponse.json({
      available: true,
      canTakeFromNonPremium: true
    })
  } catch (error) {
    return NextResponse.json(
      { available: false, error: 'Грешка при проверка' },
      { status: 500 }
    )
  }
}
