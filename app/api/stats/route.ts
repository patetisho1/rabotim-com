import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { getEnv } from '@/lib/env-validation'

/**
 * GET /api/stats
 * Returns platform statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://wwbxzkbilklullziiogr.supabase.co'),
      getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0'),
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Get total tasks count
    const { count: tasksCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'in_progress', 'completed'])

    if (tasksError) {
      logger.error('Error fetching tasks count', tasksError)
    }

    // Get completed tasks count
    const { count: completedCount, error: completedError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    if (completedError) {
      logger.error('Error fetching completed tasks count', completedError)
    }

    // Get total users count
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      logger.error('Error fetching users count', usersError)
    }

    // Get unique cities count
    const { data: tasksData, error: citiesError } = await supabase
      .from('tasks')
      .select('location')
      .in('status', ['active', 'in_progress', 'completed'])

    if (citiesError) {
      logger.error('Error fetching cities', citiesError)
    }

    const uniqueCities = new Set(
      (tasksData || [])
        .map(task => task.location)
        .filter(Boolean)
    ).size

    // Fallback values if errors occur
    const stats = {
      tasks: tasksCount || 0,
      users: usersCount || 0,
      cities: uniqueCities || 0,
      completed: completedCount || 0
    }

    logger.info('Platform statistics fetched', { stats })

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    logger.error('Error in GET /api/stats', error as Error)
    return handleApiError(error, { endpoint: 'GET /api/stats' })
  }
}

