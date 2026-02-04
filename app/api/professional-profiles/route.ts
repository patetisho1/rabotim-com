import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { validateUsername, createEmptyProfessionalProfile } from '@/types/professional-profile'

// GET - List all published professional profiles or get current user's profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const profession = searchParams.get('profession')
    const city = searchParams.get('city')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const serviceClient = getServiceRoleClient()

    // If userId is provided, get that user's profile
    if (userId) {
      const { data, error } = await serviceClient
        .from('professional_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return NextResponse.json({ profile: data || null })
    }

    // Otherwise, list all published profiles from PAID premium users only
    // Profiles are only shown if is_premium is true (set when user pays)
    let query = serviceClient
      .from('professional_profiles')
      .select(`
        *,
        user:users(full_name, avatar_url, rating, verified)
      `)
      .eq('is_published', true)
      .eq('is_premium', true) // Only show paid/premium profiles
      .order('view_count', { ascending: false })
      .range(offset, offset + limit - 1)

    if (profession) {
      query = query.eq('profession', profession)
    }

    if (city) {
      query = query.eq('city', city)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ profiles: data || [] })
  } catch (error) {
    logger.error('Failed to fetch professional profiles', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

// POST - Create or update professional profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, profile } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate username if provided
    if (profile.username) {
      const validation = validateUsername(profile.username)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        )
      }
    }

    const serviceClient = getServiceRoleClient()
    const usernameLower = profile.username?.toLowerCase()

    // Username: reserved only for premium. Non-premium profiles can be "taken over".
    if (usernameLower) {
      const { data: existingProfile } = await serviceClient
        .from('professional_profiles')
        .select('id, user_id, is_premium')
        .eq('username', usernameLower)
        .single()

      if (existingProfile && existingProfile.user_id !== userId) {
        const ownerIsPremium = existingProfile.is_premium === true
        if (ownerIsPremium) {
          return NextResponse.json(
            { error: 'Това потребителско име е заето от премиум акаунт' },
            { status: 409 }
          )
        }
        // Free the username: clear it from the non-premium profile so current user can take it
        await serviceClient
          .from('professional_profiles')
          .update({ username: null, updated_at: new Date().toISOString() })
          .eq('id', existingProfile.id)
      }
    }

    // Display name: reserved only for premium (same logic as username). Case-insensitive match.
    const displayNameTrimmed = typeof profile.displayName === 'string' ? profile.displayName.trim() : ''
    if (displayNameTrimmed) {
      const { data: rows } = await serviceClient
        .from('professional_profiles')
        .select('id, user_id, is_premium, display_name')
        .not('display_name', 'is', null)
      const existingDisplay = (rows || []).find(
        (p) => p.display_name && String(p.display_name).toLowerCase() === displayNameTrimmed.toLowerCase()
      )
      if (existingDisplay && existingDisplay.user_id !== userId) {
        const ownerIsPremium = existingDisplay.is_premium === true
        if (ownerIsPremium) {
          return NextResponse.json(
            { error: 'Това име за показване е заето от премиум акаунт' },
            { status: 409 }
          )
        }
        await serviceClient
          .from('professional_profiles')
          .update({ display_name: null, updated_at: new Date().toISOString() })
          .eq('id', existingDisplay.id)
      }
    }

    // Check if user already has a profile
    const { data: existingUserProfile } = await serviceClient
      .from('professional_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    const profileData = {
      user_id: userId,
      username: profile.username?.toLowerCase(),
      display_name: profile.displayName,
      tagline: profile.tagline,
      profession: profile.profession,
      profession_title: profile.professionTitle,
      template: profile.template ?? 'modern',
      primary_color: profile.primaryColor,
      cover_image: profile.coverImage,
      about_me: profile.aboutMe,
      services: profile.services,
      gallery: profile.gallery,
      certifications: profile.certifications,
      contact_email: profile.contactEmail,
      contact_phone: profile.contactPhone,
      whatsapp: profile.whatsapp,
      address: profile.address,
      city: profile.city,
      neighborhood: profile.neighborhood,
      service_area: profile.serviceArea,
      working_hours: profile.workingHours,
      social_links: profile.socialLinks,
      meta_title: profile.metaTitle,
      meta_description: profile.metaDescription,
      is_published: profile.isPublished,
      show_prices: profile.showPrices,
      show_phone: profile.showPhone,
      show_email: profile.showEmail,
      accept_online_booking: profile.acceptOnlineBooking,
      is_artist: profile.isArtist ?? false,
      revolut_enabled: profile.revolutEnabled ?? false,
      revolut_barcode_url: profile.revolutBarcodeUrl ?? null,
      updated_at: new Date().toISOString()
    }

    let result
    if (existingUserProfile) {
      // Update existing profile
      const { data, error } = await serviceClient
        .from('professional_profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new profile
      const { data, error } = await serviceClient
        .from('professional_profiles')
        .insert({
          ...profileData,
          view_count: 0,
          contact_requests: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ profile: result, success: true })
  } catch (error) {
    logger.error('Failed to save professional profile', error as Error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}

