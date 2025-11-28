import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { sendTaskAlertEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

interface NotifyRequest {
  taskId: string
  taskTitle: string
  taskCategory: string
  taskLocation: string
  taskBudget: number
}

// POST - Notify users with matching alerts about a new task
export async function POST(request: NextRequest) {
  try {
    const body: NotifyRequest = await request.json()

    if (!body.taskId || !body.taskTitle) {
      return NextResponse.json(
        { error: 'taskId и taskTitle са задължителни' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Find all matching active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('task_alerts')
      .select(`
        id,
        user_id,
        name,
        categories,
        locations,
        min_budget,
        max_budget,
        keywords,
        email_enabled,
        push_enabled,
        frequency
      `)
      .eq('is_active', true)
      .eq('frequency', 'immediate')

    if (alertsError) {
      // Table might not exist
      if (alertsError.code === '42P01') {
        return NextResponse.json({ 
          success: true, 
          notified: 0,
          message: 'Task alerts table not yet created' 
        })
      }
      throw alertsError
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        notified: 0,
        message: 'No active alerts found' 
      })
    }

    // Filter alerts that match this task
    const matchingAlerts = alerts.filter(alert => {
      // Check category
      if (alert.categories && alert.categories.length > 0) {
        if (!alert.categories.includes(body.taskCategory)) {
          return false
        }
      }

      // Check location
      if (alert.locations && alert.locations.length > 0) {
        if (!alert.locations.includes(body.taskLocation)) {
          return false
        }
      }

      // Check budget
      if (body.taskBudget < (alert.min_budget || 0)) {
        return false
      }
      if (body.taskBudget > (alert.max_budget || 999999)) {
        return false
      }

      // Check keywords
      if (alert.keywords && alert.keywords.length > 0) {
        const titleLower = body.taskTitle.toLowerCase()
        const hasMatch = alert.keywords.some((keyword: string) => 
          titleLower.includes(keyword.toLowerCase())
        )
        if (!hasMatch) {
          return false
        }
      }

      return true
    })

    if (matchingAlerts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        notified: 0,
        message: 'No matching alerts found' 
      })
    }

    // Get unique user IDs
    const userIds = [...new Set(matchingAlerts.map(a => a.user_id))]

    // Fetch user details
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .in('id', userIds)

    if (usersError || !users) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ 
        success: true, 
        notified: 0,
        message: 'Could not fetch user details' 
      })
    }

    const userMap = new Map(users.map(u => [u.id, u]))

    // Send notifications
    let notifiedCount = 0
    const notificationPromises: Promise<void>[] = []

    for (const alert of matchingAlerts) {
      const user = userMap.get(alert.user_id)
      if (!user || !user.email) continue

      // Send email if enabled
      if (alert.email_enabled) {
        notificationPromises.push(
          sendTaskAlertEmail(
            user.email,
            user.full_name || 'Потребител',
            alert.name || 'Вашето известие',
            body.taskTitle,
            body.taskCategory,
            body.taskLocation,
            body.taskBudget,
            body.taskId
          ).then(() => {
            notifiedCount++
          }).catch(err => {
            console.error(`Failed to send alert email to ${user.email}:`, err)
          })
        )
      }

      // Update alert stats
      supabase
        .from('task_alerts')
        .update({
          matches_count: (alert as any).matches_count ? (alert as any).matches_count + 1 : 1,
          last_notified_at: new Date().toISOString()
        })
        .eq('id', alert.id)
        .then(() => {})
        .catch(err => console.error('Failed to update alert stats:', err))
    }

    // Wait for all notifications to complete
    await Promise.all(notificationPromises)

    return NextResponse.json({
      success: true,
      notified: notifiedCount,
      matchingAlerts: matchingAlerts.length,
      message: `Изпратени ${notifiedCount} известия`
    })

  } catch (error) {
    console.error('Notify task alerts error:', error)
    return NextResponse.json(
      { error: 'Грешка при изпращане на известия' },
      { status: 500 }
    )
  }
}

