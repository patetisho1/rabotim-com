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

// PATCH - Обновяване на статус на кандидатура (приемане/отхвърляне)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { application_id, status, task_id, requester_id, reason } = body

    if (!application_id || !status || !task_id || !requester_id) {
      return NextResponse.json(
        { error: 'application_id, status, task_id и requester_id са задължителни' },
        { status: 400 }
      )
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Невалиден статус. Разрешени са accepted или rejected.' },
        { status: 400 }
      )
    }

    // Проверка дали заявителя е собственик на задачата
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('user_id, title, status')
      .eq('id', task_id)
      .single()

    if (taskError || !task) {
      console.error('Supabase error (task lookup):', taskError)
      return NextResponse.json(
        { error: 'Задачата не е намерена' },
        { status: 404 }
      )
    }

    if (task.user_id !== requester_id) {
      return NextResponse.json(
        { error: 'Нямате права да управлявате кандидатурите за тази задача' },
        { status: 403 }
      )
    }

    // Зареждаме кандидатурата и кандидата
    const { data: application, error: applicationError } = await supabase
      .from('task_applications')
      .select('id, task_id, user_id, status')
      .eq('id', application_id)
      .single()

    if (applicationError || !application) {
      console.error('Supabase error (application lookup):', applicationError)
      return NextResponse.json(
        { error: 'Кандидатурата не е намерена' },
        { status: 404 }
      )
    }

    // Обновяваме статуса
    const { data: updatedApplication, error: updateError } = await supabase
      .from('task_applications')
      .update({ status })
      .eq('id', application_id)
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .single()

    if (updateError) {
      console.error('Supabase error (update application):', updateError)
      return NextResponse.json(
        { error: 'Грешка при обновяване на кандидатурата' },
        { status: 500 }
      )
    }

    // Ако статусът е accepted → отхвърляме всички останали кандидатури и обновяваме задачата
    if (status === 'accepted') {
      const { error: rejectOthersError } = await supabase
        .from('task_applications')
        .update({ status: 'rejected' })
        .eq('task_id', task_id)
        .neq('id', application_id)

      if (rejectOthersError) {
        console.error('Supabase error (reject others):', rejectOthersError)
      }

      const { error: updateTaskStatusError } = await supabase
        .from('tasks')
        .update({ status: 'assigned' })
        .eq('id', task_id)

      if (updateTaskStatusError) {
        console.error('Supabase error (update task status):', updateTaskStatusError)
      }
    } else if (status === 'rejected') {
      // Ако отказваме кандидатура и няма други приети → връщаме задачата в активна
      const { data: acceptedApplications } = await supabase
        .from('task_applications')
        .select('id')
        .eq('task_id', task_id)
        .eq('status', 'accepted')

      if (!acceptedApplications || acceptedApplications.length === 0) {
        const { error: revertTaskStatusError } = await supabase
          .from('tasks')
          .update({ status: 'active' })
          .eq('id', task_id)

        if (revertTaskStatusError) {
          console.error('Supabase error (revert task status):', revertTaskStatusError)
        }
      }
    }

    // Нотификация към кандидата
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        user_id: application.user_id,
        type: status === 'accepted' ? 'application_accepted' : 'application_rejected',
        title: status === 'accepted' ? 'Кандидатурата е одобрена' : 'Кандидатурата е отхвърлена',
        message: status === 'accepted'
          ? `Вашата кандидатура за "${task.title}" беше одобрена.`
          : `Вашата кандидатура за "${task.title}" беше отхвърлена.${reason ? ` Причина: ${reason}` : ''}`,
        data: {
          task_id,
          application_id,
          status,
        },
        read: false
      }])

    if (notificationError) {
      console.error('Supabase error (notification):', notificationError)
    }

    return NextResponse.json(updatedApplication, { status: 200 })
  } catch (error: any) {
    console.error('API error (PATCH /applications):', error)
    return NextResponse.json(
      { error: error.message || 'Вътрешна грешка' },
      { status: 500 }
    )
  }
}
