import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Проверка за админ права
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 })
    }

    // Проверка дали потребителят е админ
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Нямате админ права' }, { status: 403 })
    }

    // Събиране на статистики
    const [
      { count: totalUsers },
      { count: totalTasks },
      { count: activeTasks },
      { count: completedTasks },
      { count: pendingApplications }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('task_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    // Изчисляване на общи приходи (от завършени задачи)
    const { data: revenueData } = await supabase
      .from('tasks')
      .select('price')
      .eq('status', 'completed')

    const totalRevenue = revenueData?.reduce((sum, task) => sum + (task.price || 0), 0) || 0

    // Последна активност
    const { data: recentActivity } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Последни задачи
    const { data: recentTasks } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        status,
        price,
        created_at,
        profiles!tasks_user_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    const stats = {
      totalUsers: totalUsers || 0,
      totalTasks: totalTasks || 0,
      totalRevenue,
      activeTasks: activeTasks || 0,
      pendingApplications: pendingApplications || 0,
      completedTasks: completedTasks || 0
    }

    return NextResponse.json({
      stats,
      recentActivity: recentActivity || [],
      recentTasks: recentTasks || []
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при зареждането на статистиките' },
      { status: 500 }
    )
  }
}
