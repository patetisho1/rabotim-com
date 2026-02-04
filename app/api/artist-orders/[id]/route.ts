import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import type { ArtistOrderStatus } from '@/types/artist'

const ALLOWED_STATUSES: ArtistOrderStatus[] = ['confirmed', 'in_progress', 'completed', 'cancelled']

// PATCH - Update order status (artist only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { status } = body
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Невалиден статус' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceRoleClient()
    const { data: order } = await serviceClient
      .from('artist_orders')
      .select('id, professional_profile_id')
      .eq('id', params.id)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Поръчката не е намерена' }, { status: 404 })
    }

    const { data: profile } = await serviceClient
      .from('professional_profiles')
      .select('user_id')
      .eq('id', order.professional_profile_id)
      .single()

    if (!profile || profile.user_id !== user.id) {
      return NextResponse.json({ error: 'Нямате право да променяте тази поръчка' }, { status: 403 })
    }

    const { data: updated, error } = await serviceClient
      .from('artist_orders')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      logger.error('Artist order update failed', error)
      return NextResponse.json(
        { error: 'Неуспешна промяна на статус' },
        { status: 500 }
      )
    }

    return NextResponse.json({ order: updated, success: true })
  } catch (error) {
    logger.error('Artist order PATCH', error as Error)
    return NextResponse.json(
      { error: 'Възникна грешка' },
      { status: 500 }
    )
  }
}
