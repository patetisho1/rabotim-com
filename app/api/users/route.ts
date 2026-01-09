import { NextRequest, NextResponse } from 'next/server'
import { db, supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// GET /api/users - Вземи потребители (за админ или търсене)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching users', error as Error, { endpoint: 'GET /api/users' })
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
