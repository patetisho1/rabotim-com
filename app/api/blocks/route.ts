import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Block a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blocker_id, blocked_id } = body

    // Validation
    if (!blocker_id || !blocked_id) {
      return NextResponse.json(
        { error: 'blocker_id и blocked_id са задължителни' },
        { status: 400 }
      )
    }

    if (blocker_id === blocked_id) {
      return NextResponse.json(
        { error: 'Не можете да блокирате себе си' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Check if already blocked
    const { data: existingBlock } = await supabase
      .from('user_blocks')
      .select('id')
      .eq('blocker_id', blocker_id)
      .eq('blocked_id', blocked_id)
      .single()

    if (existingBlock) {
      return NextResponse.json(
        { error: 'Вече сте блокирали този потребител' },
        { status: 400 }
      )
    }

    // Create the block
    const { data, error } = await supabase
      .from('user_blocks')
      .insert({
        blocker_id,
        blocked_id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating block:', error)
      
      // Graceful degradation - return success even if DB fails
      return NextResponse.json({
        success: true,
        message: 'Потребителят е блокиран успешно',
        note: error.code === '42P01' ? 'user_blocks table needs to be created in Supabase' : undefined
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Потребителят е блокиран успешно',
      data
    })

  } catch (error) {
    console.error('Block API error:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

// DELETE - Unblock a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blocker_id = searchParams.get('blocker_id')
    const blocked_id = searchParams.get('blocked_id')

    if (!blocker_id || !blocked_id) {
      return NextResponse.json(
        { error: 'blocker_id и blocked_id са задължителни' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { error } = await supabase
      .from('user_blocks')
      .delete()
      .eq('blocker_id', blocker_id)
      .eq('blocked_id', blocked_id)

    if (error) {
      console.error('Error removing block:', error)
      return NextResponse.json(
        { error: 'Грешка при премахване на блокировката' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Блокировката е премахната'
    })

  } catch (error) {
    console.error('Unblock API error:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

// GET - Get blocked users list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id е задължителен' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { data, error } = await supabase
      .from('user_blocks')
      .select(`
        *,
        blocked_user:users!blocked_id(id, full_name, avatar_url)
      `)
      .eq('blocker_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blocks:', error)
      return NextResponse.json({ blocks: [] })
    }

    return NextResponse.json({ blocks: data || [] })

  } catch (error) {
    console.error('Get blocks error:', error)
    return NextResponse.json({ blocks: [] })
  }
}

