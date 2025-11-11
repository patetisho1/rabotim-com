import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0',
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        profiles:users!tasks_user_id_fkey (
          id,
          full_name,
          avatar_url,
          verified
        )
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    } else if (!status) {
      query = query.eq('status', 'active')
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (location && location !== 'all') {
      query = query.ilike('location', `%${location}%`)
    }

    if (priceMin) {
      query = query.gte('price', parseFloat(priceMin))
    }

    if (priceMax) {
      query = query.lte('price', parseFloat(priceMax))
    }

    // Филтър по userId (за "Моите задачи")
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }

    return NextResponse.json({ tasks: data || [] })
  } catch (error) {
    console.error('Error in GET /api/tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0',
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
    const {
      title,
      description,
      category,
      location,
      price,
      priceType,
      deadline,
      urgent = false,
      remote = false,
      conditions = '',
      images = []
    } = body

    // Валидация
    if (!title || !description || !category || !location || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const normalizedTitle = title?.toString().trim()
    const normalizedDescription = description?.toString().trim()
    const normalizedConditions = conditions?.toString().trim() || ''
    const numericPrice = Number(price)

    if (!normalizedTitle || !normalizedDescription || Number.isNaN(numericPrice)) {
      return NextResponse.json({ error: 'Invalid task payload' }, { status: 400 })
    }

    // Допълнителни проверки
    const MIN_TITLE_LENGTH = 10
    const MIN_DESCRIPTION_LENGTH = 80
    const MIN_PRICE_VALUE = 5
    const bannedPatterns = [
      /https?:\/\//i,
      /\bтелефон\b/i,
      /\bwhatsapp\b/i,
      /\bviber\b/i,
      /\bemail\b/i
    ]

    const issues: string[] = []

    if (normalizedTitle.length < MIN_TITLE_LENGTH) {
      issues.push('Заглавието е твърде кратко')
    }
    if (normalizedDescription.length < MIN_DESCRIPTION_LENGTH) {
      issues.push('Описанието е твърде кратко')
    }
    if (numericPrice < MIN_PRICE_VALUE) {
      issues.push('Посочената цена е подозрително ниска')
    }
    if (
      bannedPatterns.some((pattern) => pattern.test(normalizedTitle) || pattern.test(normalizedDescription) || pattern.test(normalizedConditions))
    ) {
      issues.push('Открито е съдържание, изискващо модерация')
    }

    // Проверка на историята на потребителя
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, verified, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error loading user profile for moderation:', profileError)
    }

    const { count: tasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const userIsTrusted = Boolean(profile?.verified) || (tasksCount || 0) >= 5
    if (!userIsTrusted) {
      issues.push('Нов профил – изисква се първоначален преглед')
    }

    const moderationStatus = issues.length === 0 ? 'active' : 'pending'

    // Създаване на задача
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title: normalizedTitle,
        description: normalizedDescription,
        category,
        location,
        price: numericPrice,
        price_type: priceType,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        urgent,
        remote,
        images,
        user_id: user.id,
        status: moderationStatus,
        applications_count: 0,
        views_count: 0
      })
      .select(`
        *,
        profiles:users!tasks_user_id_fkey (
          id,
          full_name,
          avatar_url,
          verified
        )
      `)
      .single()

    if (taskError) {
      console.error('Error creating task:', taskError)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    return NextResponse.json({ 
      task, 
      moderation: {
        status: moderationStatus,
        issues
      } 
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

