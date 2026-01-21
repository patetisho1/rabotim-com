import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// GET /api/users/[id] - Вземи конкретен потребител
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.getUser(params.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    logger.error('Error fetching user', error as Error, { userId: params.id })
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Обнови потребител
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { full_name, avatar_url, phone, location, bio, city, neighborhood } = body

    const updates: any = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (phone !== undefined) updates.phone = phone
    if (location !== undefined) updates.location = location
    if (bio !== undefined) updates.bio = bio
    if (city !== undefined) updates.city = city
    if (neighborhood !== undefined) updates.neighborhood = neighborhood

    const user = await db.updateUser(params.id, updates)
    return NextResponse.json(user)
  } catch (error) {
    logger.error('Error updating user', error as Error, { userId: params.id })
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[id] - Частично обновяване на потребител
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { full_name, avatar_url, phone, location, bio, city, neighborhood } = body

    const updates: any = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (phone !== undefined) updates.phone = phone
    if (location !== undefined) updates.location = location
    if (bio !== undefined) updates.bio = bio
    if (city !== undefined) updates.city = city
    if (neighborhood !== undefined) updates.neighborhood = neighborhood

    // If city or neighborhood changed, update the combined location field
    if (city !== undefined || neighborhood !== undefined) {
      const newCity = city !== undefined ? city : ''
      const newNeighborhood = neighborhood !== undefined ? neighborhood : ''
      updates.location = newCity + (newNeighborhood ? `, ${newNeighborhood}` : '')
    }

    const user = await db.updateUser(params.id, updates)
    return NextResponse.json({ success: true, user })
  } catch (error) {
    logger.error('Error updating user', error as Error, { userId: params.id })
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
