import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// POST /api/reviews/[id]/report - Докладвай отзив
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const updatedReview = await db.reportReview(id)
    return NextResponse.json(updatedReview)
  } catch (error) {
    logger.error('Error reporting review', error as Error, { reviewId: params.id })
    return NextResponse.json(
      { error: 'Failed to report review' },
      { status: 500 }
    )
  }
}


