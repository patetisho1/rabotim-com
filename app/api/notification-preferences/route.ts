import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// GET /api/notification-preferences - Вземи настройки на известия за потребител
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const serviceClient = getServiceRoleClient()

    const { data: preferences, error } = await serviceClient
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences found, create default ones
        const { data: newPreferences, error: insertError } = await serviceClient
          .from('notification_preferences')
          .insert({
            user_id: user.id,
            email: true,
            push: false,
            in_app: true,
            sound_enabled: true,
            quiet_hours_enabled: false,
            quiet_hours_start: '22:00:00',
            quiet_hours_end: '08:00:00',
            quiet_hours_timezone: 'Europe/Sofia',
            frequency: 'immediate',
            category_settings: {
              communication: { email: true, push: false, inApp: true },
              tasks: { email: true, push: false, inApp: true },
              payments: { email: true, push: false, inApp: true },
              system: { email: false, push: false, inApp: true },
              security: { email: true, push: true, inApp: true },
              achievements: { email: false, push: false, inApp: true }
            }
          })
          .select()
          .single()

        if (insertError) {
          logger.error('Error creating notification preferences', insertError instanceof Error ? insertError : new Error(String(insertError)), { userId: user.id })
          throw insertError
        }

        return NextResponse.json(transformPreferences(newPreferences))
      }
      
      logger.error('Error fetching notification preferences', error instanceof Error ? error : new Error(String(error)), { userId: user.id })
      throw error
    }

    return NextResponse.json(transformPreferences(preferences))
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/notification-preferences' })
  }
}

// PUT /api/notification-preferences - Обнови настройки на известия
export async function PUT(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      email,
      push,
      inApp,
      soundEnabled,
      categories,
      quietHours,
      frequency
    } = body

    const serviceClient = getServiceRoleClient()

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (typeof email === 'boolean') updateData.email = email
    if (typeof push === 'boolean') updateData.push = push
    if (typeof inApp === 'boolean') updateData.in_app = inApp
    if (typeof soundEnabled === 'boolean') updateData.sound_enabled = soundEnabled
    if (categories) updateData.category_settings = categories
    if (quietHours) {
      updateData.quiet_hours_enabled = quietHours.enabled
      if (quietHours.start) updateData.quiet_hours_start = quietHours.start
      if (quietHours.end) updateData.quiet_hours_end = quietHours.end
      if (quietHours.timezone) updateData.quiet_hours_timezone = quietHours.timezone
    }
    if (frequency) updateData.frequency = frequency

    const { data: preferences, error } = await serviceClient
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...updateData
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      logger.error('Error updating notification preferences', error instanceof Error ? error : new Error(String(error)), { userId: user.id })
      throw error
    }

    logger.info('Notification preferences updated', { userId: user.id })
    return NextResponse.json(transformPreferences(preferences))
  } catch (error) {
    return handleApiError(error, { endpoint: 'PUT /api/notification-preferences' })
  }
}

// Transform database preferences to API format
function transformPreferences(dbPreferences: any) {
  return {
    userId: dbPreferences.user_id,
    email: dbPreferences.email,
    push: dbPreferences.push,
    inApp: dbPreferences.in_app,
    soundEnabled: dbPreferences.sound_enabled,
    categories: dbPreferences.category_settings,
    quietHours: {
      enabled: dbPreferences.quiet_hours_enabled,
      start: dbPreferences.quiet_hours_start?.substring(0, 5) || '22:00', // Convert time to HH:mm
      end: dbPreferences.quiet_hours_end?.substring(0, 5) || '08:00',
      timezone: dbPreferences.quiet_hours_timezone || 'Europe/Sofia'
    },
    frequency: dbPreferences.frequency || 'immediate'
  }
}

