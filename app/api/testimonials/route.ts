import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { getEnv } from '@/lib/env-validation'

/**
 * GET /api/testimonials
 * Returns verified testimonials (reviews) for homepage display
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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    const minRating = parseInt(searchParams.get('minRating') || '4')

    // Get verified reviews with high ratings
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        id,
        title,
        comment,
        rating,
        pros,
        tags,
        created_at,
        reviewer:profiles!reviewer_id(
          id,
          full_name,
          avatar_url
        ),
        reviewed_user:profiles!reviewed_user_id(
          id,
          full_name,
          avatar_url
        ),
        task:tasks(
          id,
          title,
          category,
          location
        )
      `)
      .eq('is_verified', true)
      .gte('rating', minRating)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (reviewsError) {
      logger.error('Error fetching testimonials', reviewsError)
      // Return empty array on error, not an error response
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Transform reviews to testimonials format
    const testimonials = (reviews || []).map((review: any) => ({
      id: review.id,
      name: review.reviewer?.full_name || 'Анонимен потребител',
      avatar: review.reviewer?.avatar_url || null,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      pros: review.pros || [],
      tags: review.tags || [],
      taskCategory: review.task?.category || null,
      taskLocation: review.task?.location || null,
      createdAt: review.created_at,
      // Generate testimonial text based on comment and pros
      testimonialText: review.comment || review.title
    }))

    logger.info('Testimonials fetched successfully', { count: testimonials.length, minRating })

    return NextResponse.json({
      success: true,
      data: testimonials
    })
  } catch (error) {
    logger.error('Error in GET /api/testimonials', error as Error)
    // Return empty array on error, not an error response (for graceful degradation)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

