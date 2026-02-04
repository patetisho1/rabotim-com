import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import { ProfessionalProfile } from '@/types/professional-profile'

// GET - Fetch a professional profile by username (public or preview for owner)
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username.toLowerCase()
    const serviceClient = getServiceRoleClient()

    // Fetch profile by username (do not filter by is_published yet – owner can preview)
    const { data: profileData, error } = await serviceClient
      .from('professional_profiles')
      .select(`
        *,
        user:users(id, full_name, avatar_url, rating, total_reviews, verified)
      `)
      .eq('username', username)
      .single()

    if (error || !profileData) {
      if (error?.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Allow owner to preview even when not published
    let isOwnerPreview = false
    try {
      const cookieStore = cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value },
            set() {},
            remove() {},
          },
        }
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user && profileData.user_id === user.id) {
        isOwnerPreview = true
      }
    } catch {
      // ignore auth errors
    }

    const isPublic = profileData.is_published === true
    if (!isPublic && !isOwnerPreview) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Increment view count only for public views (not owner preview)
    if (isPublic && !isOwnerPreview) {
      await serviceClient
        .from('professional_profiles')
        .update({ view_count: (profileData.view_count || 0) + 1 })
        .eq('username', username)
    }

    // Transform database format to frontend format
    const profile: ProfessionalProfile = {
      id: profileData.id,
      username: profileData.username,
      displayName: profileData.display_name || profileData.user?.full_name || username,
      tagline: profileData.tagline || '',
      profession: profileData.profession || 'other',
      professionTitle: profileData.profession_title || '',
      template: profileData.template || 'modern',
      primaryColor: profileData.primary_color,
      coverImage: profileData.cover_image,
      aboutMe: profileData.about_me || '',
      services: profileData.services || [],
      gallery: profileData.gallery || [],
      certifications: profileData.certifications || [],
      contactEmail: profileData.contact_email,
      contactPhone: profileData.contact_phone,
      whatsapp: profileData.whatsapp,
      address: profileData.address,
      city: profileData.city || '',
      neighborhood: profileData.neighborhood,
      serviceArea: profileData.service_area || [],
      workingHours: profileData.working_hours || [],
      socialLinks: profileData.social_links || [],
      metaTitle: profileData.meta_title,
      metaDescription: profileData.meta_description,
      viewCount: profileData.view_count || 0,
      contactRequests: profileData.contact_requests || 0,
      isPublished: profileData.is_published,
      showPrices: profileData.show_prices ?? true,
      showPhone: profileData.show_phone ?? true,
      showEmail: profileData.show_email ?? true,
      acceptOnlineBooking: profileData.accept_online_booking ?? false,
      isArtist: profileData.is_artist ?? false,
      revolutEnabled: profileData.revolut_enabled ?? false,
      revolutBarcodeUrl: profileData.revolut_barcode_url ?? null,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at
    }

    return NextResponse.json({ 
      profile,
      user: profileData.user,
      isPreview: isOwnerPreview && !isPublic
    })
  } catch (error) {
    logger.error('Failed to fetch professional profile', error as Error, { username: params.username })
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST - Track contact request
export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username.toLowerCase()
    const body = await request.json()
    const { action } = body

    const serviceClient = getServiceRoleClient()

    if (action === 'contact') {
      // Increment contact requests
      const { data: profile, error: fetchError } = await serviceClient
        .from('professional_profiles')
        .select('contact_requests')
        .eq('username', username)
        .single()

      if (fetchError) throw fetchError

      await serviceClient
        .from('professional_profiles')
        .update({ contact_requests: (profile.contact_requests || 0) + 1 })
        .eq('username', username)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to track profile action', error as Error, { username: params.username })
    return NextResponse.json(
      { error: 'Failed to track action' },
      { status: 500 }
    )
  }
}

