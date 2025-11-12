import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// GET /api/ratings - Вземи рейтинги за потребител
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const limit = searchParams.get('limit')

    if (!userId) {
      throw new ValidationError('User ID is required', ErrorMessages.MISSING_FIELDS)
    }

    // Get both ratings and reviews
    const [ratings, reviews, summary] = await Promise.all([
      db.getUserRatings(userId),
      db.getReviews(userId, { verifiedOnly, limit: limit ? parseInt(limit) : undefined }),
      db.getUserRatingSummary(userId)
    ])

    logger.info('Ratings fetched successfully', { userId, ratingsCount: ratings?.length || 0, reviewsCount: reviews?.length || 0 })

    return NextResponse.json({
      ratings,
      reviews,
      summary
    })
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/ratings' })
  }
}

// POST /api/ratings - Добави рейтинг
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    const { 
      task_id, 
      reviewer_id, 
      reviewed_user_id, 
      rating, 
      comment, 
      category,
      title,
      pros,
      cons,
      tags,
      is_review = false
    } = body

    // Validation
    if (!task_id || !reviewer_id || !reviewed_user_id || !rating) {
      throw new ValidationError('Missing required fields', ErrorMessages.MISSING_FIELDS, { body })
    }

    if (rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5', ErrorMessages.INVALID_DATA, { rating })
    }

    // Check if user can rate this task
    const { canRate, reason } = await db.canUserRate(reviewer_id, task_id)
    if (!canRate) {
      const message = reason === 'not_completed'
        ? ErrorMessages.TASK_NOT_COMPLETED
        : ErrorMessages.ALREADY_RATED
      throw new ValidationError(message, message, { task_id, reviewer_id, reason })
    }

    if (is_review) {
      // Add as review
      if (!title || !comment) {
        throw new ValidationError('Title and comment are required for reviews', ErrorMessages.MISSING_FIELDS, { body })
      }

      const newReview = await db.addReview({
        taskId: task_id,
        reviewerId: reviewer_id,
        reviewedUserId: reviewed_user_id,
        rating,
        title,
        comment,
        pros: pros || [],
        cons: cons || [],
        tags: tags || [],
        isVerified: true
      })

      logger.info('Review added successfully', { reviewId: newReview.id, task_id, reviewer_id, reviewed_user_id })

      return NextResponse.json(newReview, { status: 201 })
    } else {
      // Add as simple rating
      if (!comment || !category) {
        throw new ValidationError('Comment and category are required for ratings', ErrorMessages.MISSING_FIELDS, { body })
      }

      const newRating = await db.addRating({
        taskId: task_id,
        reviewerId: reviewer_id,
        reviewedUserId: reviewed_user_id,
        rating,
        comment,
        category,
        isVerified: true
      })

      logger.info('Rating added successfully', { ratingId: newRating.id, task_id, reviewer_id, reviewed_user_id })

      return NextResponse.json(newRating, { status: 201 })
    }
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/ratings' })
  }
}
