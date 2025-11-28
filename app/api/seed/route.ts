import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { seedTasks, seedUsers } from '@/lib/seed-data'

// Only allow in development or with secret key
const SEED_SECRET = process.env.SEED_SECRET || 'dev-seed-secret'

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')
    
    // In production, require the secret
    if (process.env.NODE_ENV === 'production' && providedSecret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getServiceRoleClient()
    const results = {
      users: { created: 0, errors: [] as string[] },
      tasks: { created: 0, errors: [] as string[] }
    }

    // Check if we already have demo data
    const { count: existingDemoCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('is_demo', true)

    if (existingDemoCount && existingDemoCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Demo data already exists (${existingDemoCount} demo tasks)`,
        existing: true,
        demoCount: existingDemoCount
      })
    }

    // First, create demo users or get existing ones
    const userIds: string[] = []
    
    for (const userData of seedUsers) {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        userIds.push(existingUser.id)
        continue
      }

      // Create a new user in auth (this creates the user record too via trigger)
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'DemoUser123!', // Demo password
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name
        }
      })

      if (authError) {
        results.users.errors.push(`User ${userData.email}: ${authError.message}`)
        continue
      }

      if (authUser.user) {
        // Update the user profile with additional data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            rating: userData.rating,
            total_reviews: userData.total_reviews,
            is_verified: userData.is_verified
          })
          .eq('id', authUser.user.id)

        if (updateError) {
          results.users.errors.push(`User profile ${userData.email}: ${updateError.message}`)
        } else {
          userIds.push(authUser.user.id)
          results.users.created++
        }
      }
    }

    // If we don't have any user IDs, we can't create tasks
    if (userIds.length === 0) {
      // Try to get existing users
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .limit(5)

      if (existingUsers && existingUsers.length > 0) {
        userIds.push(...existingUsers.map(u => u.id))
      } else {
        return NextResponse.json({
          success: false,
          error: 'No users available to assign tasks',
          results
        }, { status: 400 })
      }
    }

    // Create tasks with random user assignment
    for (const taskData of seedTasks) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)]
      
      // Mark as demo task with is_demo flag
      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          title: `[Demo] ${taskData.title}`,
          user_id: randomUserId,
          is_demo: true, // Important: mark as demo
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 7 days
          views_count: Math.floor(Math.random() * 50) + 5,
          applications_count: Math.floor(Math.random() * 8)
        })

      if (taskError) {
        results.tasks.errors.push(`Task "${taskData.title}": ${taskError.message}`)
      } else {
        results.tasks.created++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${results.users.created} users and ${results.tasks.created} tasks`,
      results
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE - Remove demo data
export async function DELETE(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')
    
    if (process.env.NODE_ENV === 'production' && providedSecret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getServiceRoleClient()

    // Delete demo tasks (those with is_demo = true)
    const { error: deleteTasksError, count: deletedTasks } = await supabase
      .from('tasks')
      .delete({ count: 'exact' })
      .eq('is_demo', true)

    if (deleteTasksError) {
      return NextResponse.json(
        { error: 'Failed to delete demo tasks', details: deleteTasksError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedTasks || 0} demo tasks`
    })

  } catch (error) {
    console.error('Delete seed error:', error)
    return NextResponse.json(
      { error: 'Failed to delete seed data', details: String(error) },
      { status: 500 }
    )
  }
}

