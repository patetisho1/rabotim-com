import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        profiles!tasks_posted_by_fkey (
          id,
          full_name,
          avatar_url,
          is_verified,
          bio,
          location
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching task:', error)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Увеличаване на броя гледания
    await supabase
      .from('tasks')
      .update({ views: (task.views || 0) + 1 })
      .eq('id', params.id)

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error in GET /api/tasks/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Проверка дали потребителят е собственик на задачата
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('posted_by')
      .eq('id', params.id)
      .single()

    if (fetchError || existingTask.posted_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(body)
      .eq('id', params.id)
      .select(`
        *,
        profiles!tasks_posted_by_fkey (
          id,
          full_name,
          avatar_url,
          is_verified
        )
      `)
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error in PUT /api/tasks/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Проверка дали потребителят е собственик на задачата
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('posted_by')
      .eq('id', params.id)
      .single()

    if (fetchError || existingTask.posted_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/tasks/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
