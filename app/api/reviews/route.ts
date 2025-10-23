import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET /api/reviews - Вземи отзиви за потребител или задача
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const taskId = searchParams.get('taskId')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const limit = searchParams.get('limit')

    if (userId) {
      const reviews = await db.getReviews(userId, { verifiedOnly, limit: limit ? parseInt(limit) : undefined })
      return NextResponse.json(reviews)
    }

    if (taskId) {
      const reviews = await db.getTaskRatings(taskId)
      return NextResponse.json(reviews)
    }

    return NextResponse.json(
      { error: 'Either userId or taskId is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Добави отзив
export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
}
