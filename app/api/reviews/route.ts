import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { handleApiError, ValidationError, ErrorMessages } from '@/lib/errors'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

// GET /api/reviews - Вземи отзиви за потребител или задача
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, rateLimitConfigs.api)
    if (rateLimitResult.limited) {
      return rateLimitResult.response!
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const taskId = searchParams.get('taskId')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const limit = searchParams.get('limit')

    if (userId) {
      const reviews = await db.getReviews(userId, { verifiedOnly, limit: limit ? parseInt(limit) : undefined })
      logger.info('Reviews fetched successfully', { userId, count: reviews?.length || 0, verifiedOnly })
      return NextResponse.json(reviews)
    }

    if (taskId) {
      const reviews = await db.getTaskRatings(taskId)
      logger.info('Task reviews fetched successfully', { taskId, count: reviews?.length || 0 })
      return NextResponse.json(reviews)
    }

    throw new ValidationError('Either userId or taskId is required', ErrorMessages.MISSING_FIELDS)
  } catch (error) {
    return handleApiError(error, { endpoint: 'GET /api/reviews' })
  }
}

// POST /api/reviews - Добави отзив
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
      title,
      comment,
      pros,
      cons,
      tags
    } = body

    // Validation
    if (!task_id || !reviewer_id || !reviewed_user_id || !rating || !title || !comment) {
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
  } catch (error) {
    return handleApiError(error, { endpoint: 'POST /api/reviews' })
  }
}
