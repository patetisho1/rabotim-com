import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import type { ArtistOrderType } from '@/types/artist'

// POST - Create order (public: anyone can order from a published artist profile)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      professional_profile_id,
      customer_name,
      customer_email,
      customer_phone,
      order_type,
      size,
      reference_photo_url,
      notes
    } = body

    if (!professional_profile_id || !order_type || !size || !reference_photo_url) {
      return NextResponse.json(
        { error: 'Липсват задължителни полета: тип, размер, снимка за референция' },
        { status: 400 }
      )
    }

    if (!['portrait', 'painting'].includes(order_type)) {
      return NextResponse.json(
        { error: 'Невалиден тип поръчка' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceRoleClient()

    const { data: profile } = await serviceClient
      .from('professional_profiles')
      .select('id')
      .eq('id', professional_profile_id)
      .eq('is_published', true)
      .eq('is_artist', true)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Профилът не е наличен за поръчки' },
        { status: 404 }
      )
    }

    const { data: order, error } = await serviceClient
      .from('artist_orders')
      .insert({
        professional_profile_id,
        customer_name: customer_name || null,
        customer_email: customer_email || null,
        customer_phone: customer_phone || null,
        order_type: order_type as ArtistOrderType,
        size: String(size),
        reference_photo_url,
        notes: notes || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      logger.error('Artist order create failed', error, { professional_profile_id })
      return NextResponse.json(
        { error: 'Неуспешно създаване на поръчка' },
        { status: 500 }
      )
    }

    return NextResponse.json({ order, success: true })
  } catch (error) {
    logger.error('Artist orders POST', error as Error)
    return NextResponse.json(
      { error: 'Възникна грешка' },
      { status: 500 }
    )
  }
}

// GET - List orders for the current user's artist profile (authenticated)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Не сте влезли в акаунта си' }, { status: 401 })
    }

    const serviceClient = getServiceRoleClient()
    const { data: profile } = await serviceClient
      .from('professional_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ orders: [] })
    }

    const { data: orders, error } = await serviceClient
      .from('artist_orders')
      .select('*')
      .eq('professional_profile_id', profile.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Artist orders list failed', error)
      return NextResponse.json(
        { error: 'Неуспешно зареждане на поръчки' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    logger.error('Artist orders GET', error as Error)
    return NextResponse.json(
      { error: 'Възникна грешка' },
      { status: 500 }
    )
  }
}
