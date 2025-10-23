import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET /api/ratings - Вземи рейтинги за потребител
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const limit = searchParams.get('limit')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get both ratings and reviews
    const [ratings, reviews, summary] = await Promise.all([
      db.getUserRatings(userId),
      db.getReviews(userId, { verifiedOnly, limit: limit ? parseInt(limit) : undefined }),
      db.getUserRatingSummary(userId)
    ])

    return NextResponse.json({
      ratings,
      reviews,
      summary
    })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}

// POST /api/ratings - Добави рейтинг
export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user can rate this task
    const canRate = await db.canUserRate(reviewer_id, task_id)
    if (!canRate) {
      return NextResponse.json(
        { error: 'User has already rated this task' },
        { status: 400 }
      )
    }

    if (is_review) {
      // Add as review
      if (!title || !comment) {
        return NextResponse.json(
          { error: 'Title and comment are required for reviews' },
          { status: 400 }
        )
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
        isVerified: false
      })

      return NextResponse.json(newReview, { status: 201 })
    } else {
      // Add as simple rating
      if (!comment || !category) {
        return NextResponse.json(
          { error: 'Comment and category are required for ratings' },
          { status: 400 }
        )
      }

      const newRating = await db.addRating({
        taskId: task_id,
        reviewerId: reviewer_id,
        reviewedUserId: reviewed_user_id,
        rating,
        comment,
        category,
        isVerified: false
      })

      return NextResponse.json(newRating, { status: 201 })
    }
  } catch (error) {
    console.error('Error adding rating:', error)
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    )
  }
}
