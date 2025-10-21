import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/tasks/[id]/apply - Кандидатствай за задача
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { user_id, message, proposed_price } = body

    // Validation
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already applied
    const { data: existingApplication } = await supabase
      .from('task_applications')
      .select('id')
      .eq('task_id', params.id)
      .eq('user_id', user_id)
      .single()

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this task' },
        { status: 400 }
      )
    }

    // Create application
    const { data, error } = await supabase
      .from('task_applications')
      .insert({
        task_id: params.id,
        user_id,
        message: message || null,
        proposed_price: proposed_price ? parseFloat(proposed_price) : null,
        status: 'pending'
      })
      .select(`
        *,
        user:users(full_name, rating, avatar_url)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error applying for task:', error)
    return NextResponse.json(
      { error: 'Failed to apply for task' },
      { status: 500 }
    )
  }
}
