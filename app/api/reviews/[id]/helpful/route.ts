import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// POST /api/reviews/[id]/helpful - Маркирай отзив като полезен
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { increment = true } = body

    const updatedReview = await db.updateReviewHelpful(id, increment)
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review helpful count:', error)
    return NextResponse.json(
      { error: 'Failed to update review helpful count' },
      { status: 500 }
    )
  }
}
