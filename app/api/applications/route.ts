import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Проверка за автентикация
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    let query = supabase
      .from('applications')
      .select(`
        *,
        tasks (
          id,
          title,
          status
        ),
        profiles!applications_applicant_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)

    if (taskId) {
      query = query.eq('task_id', taskId)
    } else {
      // Показваме само приложенията на текущия потребител
      query = query.eq('applicant_id', user.id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
    }

    return NextResponse.json({ applications: data || [] })
  } catch (error) {
    console.error('Error in GET /api/applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Проверка за автентикация
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, message } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Проверка дали задачата съществува и е активна
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, status, posted_by')
      .eq('id', taskId)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.status !== 'active') {
      return NextResponse.json({ error: 'Task is not active' }, { status: 400 })
    }

    if (task.posted_by === user.id) {
      return NextResponse.json({ error: 'Cannot apply to your own task' }, { status: 400 })
    }

    // Проверка дали вече е кандидатствал
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('task_id', taskId)
      .eq('applicant_id', user.id)
      .single()

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied to this task' }, { status: 400 })
    }

    // Създаване на приложение
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        task_id: taskId,
        applicant_id: user.id,
        message: message || ''
      })
      .select(`
        *,
        tasks (
          id,
          title,
          status
        ),
        profiles!applications_applicant_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (applicationError) {
      console.error('Error creating application:', applicationError)
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
    }

    // Увеличаване на броя приложения за задачата
    await supabase
      .from('tasks')
      .update({ applications: (task.applications || 0) + 1 })
      .eq('id', taskId)

    // Създаване на известие за собственика на задачата
    await supabase
      .from('notifications')
      .insert({
        user_id: task.posted_by,
        title: 'Ново приложение',
        message: `Получихте ново приложение за задача "${task.title}"`,
        type: 'application'
      })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
