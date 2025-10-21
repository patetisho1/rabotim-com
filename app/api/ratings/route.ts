import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET /api/ratings - Вземи рейтинги за потребител
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const ratings = await db.getUserRatings(userId)
    return NextResponse.json(ratings)
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
    const { task_id, reviewer_id, reviewed_user_id, rating, comment, category } = body

    // Validation
    if (!task_id || !reviewer_id || !reviewed_user_id || !rating || !comment || !category) {
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

    const newRating = await db.addRating({
      task_id,
      reviewer_id,
      reviewed_user_id,
      rating,
      comment,
      category,
      is_verified: false
    })

    return NextResponse.json(newRating, { status: 201 })
  } catch (error) {
    console.error('Error adding rating:', error)
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    )
  }
}
