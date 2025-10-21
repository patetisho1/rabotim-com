import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

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
    console.error('Error fetching user:', error)
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
    const { full_name, avatar_url, phone, location, bio } = body

    const updates: any = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (phone !== undefined) updates.phone = phone
    if (location !== undefined) updates.location = location
    if (bio !== undefined) updates.bio = bio

    const user = await db.updateUser(params.id, updates)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
