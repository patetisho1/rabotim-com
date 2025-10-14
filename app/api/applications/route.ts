import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Кандидатстване за задача
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { task_id, user_id, message, proposed_price } = body

    if (!task_id || !user_id) {
      return NextResponse.json(
        { error: 'task_id и user_id са задължителни' },
        { status: 400 }
      )
    }

    // Проверка дали потребителят вече е кандидатствал
    const { data: existing, error: checkError } = await supabase
      .from('task_applications')
      .select('id')
      .eq('task_id', task_id)
      .eq('user_id', user_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Вече сте кандидатствали за тази задача' },
        { status: 400 }
      )
    }

    // Създаване на кандидатура
    const { data, error } = await supabase
      .from('task_applications')
      .insert([{
        task_id,
        user_id,
        message: message || '',
        proposed_price: proposed_price || null,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Създаване на нотификация за собственика на задачата
    const { data: task } = await supabase
      .from('tasks')
      .select('user_id, title')
      .eq('id', task_id)
      .single()

    if (task && task.user_id) {
      const { data: applicant } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user_id)
        .single()

      await supabase
        .from('notifications')
        .insert([{
          user_id: task.user_id,
          type: 'new_application',
          title: 'Нова кандидатура',
          message: `${applicant?.full_name || 'Потребител'} кандидатства за "${task.title}"`,
          data: {
            task_id,
            application_id: data.id,
            applicant_id: user_id
          },
          read: false
        }])
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Вътрешна грешка' },
      { status: 500 }
    )
  }
}

// GET - Получаване на кандидатури (за потребител или за задача)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const task_id = searchParams.get('task_id')
    const user_id = searchParams.get('user_id')

    let query = supabase
      .from('task_applications')
      .select(`
        *,
        task:tasks(id, title, price, price_type),
        user:users(id, full_name, avatar_url, rating)
      `)

    if (task_id) {
      query = query.eq('task_id', task_id)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Вътрешна грешка' },
      { status: 500 }
    )
  }
}
