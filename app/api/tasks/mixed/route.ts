import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const TARGET_TASKS_COUNT = 22 // Minimum tasks to show

/**
 * GET /api/tasks/mixed
 * 
 * Intelligent task listing that:
 * 1. Shows real tasks first
 * 2. Fills remaining slots with demo tasks (if needed)
 * 3. If 22+ real tasks exist, shows NO demo tasks
 * 
 * Query params:
 * - category: filter by category
 * - location: filter by location
 * - limit: max tasks to return (default: 22)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const limit = parseInt(searchParams.get('limit') || String(TARGET_TASKS_COUNT))
    const status = searchParams.get('status') || 'active'

    const supabase = getServiceRoleClient()

    // Step 1: Get count of real (non-demo) active tasks
    let realCountQuery = supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('is_demo', false)
      .eq('status', status)

    if (category) {
      realCountQuery = realCountQuery.eq('category', category)
    }
    if (location) {
      realCountQuery = realCountQuery.ilike('location', `%${location}%`)
    }

    const { count: realTasksCount } = await realCountQuery

    // Step 2: Fetch real tasks
    let realTasksQuery = supabase
      .from('tasks')
      .select('*')
      .eq('is_demo', false)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (category) {
      realTasksQuery = realTasksQuery.eq('category', category)
    }
    if (location) {
      realTasksQuery = realTasksQuery.ilike('location', `%${location}%`)
    }

    const { data: realTasks, error: realError } = await realTasksQuery

    if (realError) {
      // If is_demo column doesn't exist, fall back to showing all tasks
      if (realError.message?.includes('is_demo')) {
        const { data: allTasks, error: fallbackError } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (fallbackError) throw fallbackError

        return NextResponse.json({
          tasks: allTasks || [],
          meta: {
            total: allTasks?.length || 0,
            realCount: allTasks?.length || 0,
            demoCount: 0,
            note: 'is_demo column not yet added'
          }
        })
      }
      throw realError
    }

    const realCount = realTasks?.length || 0
    const realTotal = realTasksCount || 0

    // Step 3: If we have enough real tasks, return them only
    if (realTotal >= TARGET_TASKS_COUNT) {
      return NextResponse.json({
        tasks: realTasks || [],
        meta: {
          total: realCount,
          realCount: realCount,
          demoCount: 0,
          hiddenDemoTasks: true,
          message: 'Showing only real tasks (enough real content available)'
        }
      })
    }

    // Step 4: Need to fill with demo tasks
    const demoSlotsNeeded = Math.min(limit - realCount, TARGET_TASKS_COUNT - realTotal)

    if (demoSlotsNeeded <= 0) {
      return NextResponse.json({
        tasks: realTasks || [],
        meta: {
          total: realCount,
          realCount: realCount,
          demoCount: 0
        }
      })
    }

    // Step 5: Fetch demo tasks to fill the gaps
    let demoTasksQuery = supabase
      .from('tasks')
      .select('*')
      .eq('is_demo', true)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(demoSlotsNeeded)

    if (category) {
      demoTasksQuery = demoTasksQuery.eq('category', category)
    }
    if (location) {
      demoTasksQuery = demoTasksQuery.ilike('location', `%${location}%`)
    }

    const { data: demoTasks, error: demoError } = await demoTasksQuery

    if (demoError) {
      // If demo fetch fails, just return real tasks
      console.error('Error fetching demo tasks:', demoError)
      return NextResponse.json({
        tasks: realTasks || [],
        meta: {
          total: realCount,
          realCount: realCount,
          demoCount: 0,
          demoError: true
        }
      })
    }

    // Step 6: Combine real + demo tasks
    const combinedTasks = [...(realTasks || []), ...(demoTasks || [])]

    return NextResponse.json({
      tasks: combinedTasks,
      meta: {
        total: combinedTasks.length,
        realCount: realCount,
        demoCount: demoTasks?.length || 0,
        targetCount: TARGET_TASKS_COUNT,
        message: realCount > 0 
          ? `Showing ${realCount} real + ${demoTasks?.length || 0} demo tasks`
          : 'Showing demo tasks (no real tasks yet)'
      }
    })

  } catch (error) {
    console.error('Mixed tasks API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: String(error) },
      { status: 500 }
    )
  }
}

