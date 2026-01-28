import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Use service role client for server-side queries (bypasses RLS)
    const serviceClient = getServiceRoleClient()

    // Check if user has a professional profile (draft or active)
    const { data: profile, error: profileError } = await serviceClient
      .from('professional_profiles')
      .select('id, is_published, is_premium')
      .eq('user_id', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (user doesn't have a profile yet)
      console.error('Error fetching professional profile:', profileError)
    }

    // Check user's premium status
    const { data: userData, error: userError } = await serviceClient
      .from('users')
      .select('is_premium, premium_until, premium_type')
      .eq('id', userId)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user data:', userError)
    }

    const hasDraft = !!profile
    const isPremiumActive = userData?.is_premium && 
      (!userData.premium_until || new Date(userData.premium_until) > new Date())
    
    return NextResponse.json({
      hasDraft,
      isActive: hasDraft && isPremiumActive,
      planType: userData?.premium_type || null,
      planExpiresAt: userData?.premium_until || null
    })

  } catch (error) {
    console.error('Error in professional-profiles/status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


