import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

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

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        *,
        tasks (
          id,
          title,
          description,
          category,
          location,
          price,
          price_type,
          status,
          views,
          applications,
          created_at,
          profiles!tasks_posted_by_fkey (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching favorites', error, { userId: user.id })
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
    }

    return NextResponse.json({ favorites: favorites || [] })
  } catch (error) {
    logger.error('Error in GET /api/favorites', error as Error, { endpoint: 'GET /api/favorites' })
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
    const { taskId } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Проверка дали задачата съществува
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Проверка дали вече е в любими
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('task_id', taskId)
      .single()

    if (existingFavorite) {
      return NextResponse.json({ error: 'Task already in favorites' }, { status: 400 })
    }

    // Добавяне в любими
    const { data: favorite, error: favoriteError } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        task_id: taskId
      })
      .select()
      .single()

    if (favoriteError) {
      logger.error('Error adding to favorites', favoriteError, { userId: user.id, taskId })
      return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
    }

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error) {
    logger.error('Error in POST /api/favorites', error as Error, { endpoint: 'POST /api/favorites' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('task_id', taskId)

    if (error) {
      logger.error('Error removing from favorites', error, { userId: user.id, taskId })
      return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Removed from favorites successfully' })
  } catch (error) {
    logger.error('Error in DELETE /api/favorites', error as Error, { endpoint: 'DELETE /api/favorites' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

