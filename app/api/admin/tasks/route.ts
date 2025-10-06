import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Нямате админ права' }, { status: 403 })
    }

    // Построяване на заявката
    let query = supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        category,
        location,
        price,
        price_type,
        urgent,
        status,
        applications_count,
        views_count,
        created_at,
        updated_at,
        deadline,
        profiles!tasks_user_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `, { count: 'exact' })

    // Филтри
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    // Пагинация
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: tasks, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      tasks: tasks || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при зареждането на задачите' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { taskId, updates } = await request.json()

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Нямате админ права' }, { status: 403 })
    }

    // Обновяване на задачата
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ task: data })

  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при обновяването на задачата' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json({ error: 'ID на задача е задължително' }, { status: 400 })
    }

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Нямате админ права' }, { status: 403 })
    }

    // Изтриване на задачата (ще изтрие и свързаните данни заради CASCADE)
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изтриването на задачата' },
      { status: 500 }
    )
  }
}
