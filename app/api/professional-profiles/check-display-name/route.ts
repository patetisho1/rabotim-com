import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

/**
 * GET ?displayName=xxx&userId=yyy
 * Returns whether the display name is available (same reservation logic as username).
 * - If no profile has it: available
 * - If current user's profile has it: available (own profile)
 * - If another user's profile has it and is_premium: not available
 * - If another user's profile has it and not premium: available (can take it)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const displayName = searchParams.get('displayName')?.trim()
    const userId = searchParams.get('userId')

    if (!displayName) {
      return NextResponse.json(
        { available: false, error: 'Липсва име за показване' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceRoleClient()
    const { data: rows } = await serviceClient
      .from('professional_profiles')
      .select('user_id, is_premium, display_name')
      .not('display_name', 'is', null)

    const existing = (rows || []).find(
      (p) => p.display_name && String(p.display_name).toLowerCase() === displayName.toLowerCase()
    )

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
        error: 'Това име за показване е заето от премиум акаунт'
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
