import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

interface TaskAlert {
  id?: string
  user_id: string
  name?: string
  categories: string[]
  locations: string[]
  min_budget: number
  max_budget: number
  keywords: string[]
  email_enabled: boolean
  push_enabled: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
  is_active: boolean
}

// GET - Fetch user's task alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId е задължителен' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { data: alerts, error } = await supabase
      .from('task_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      // Table might not exist yet
      if (error.code === '42P01') {
        return NextResponse.json({ alerts: [] })
      }
      throw error
    }

    return NextResponse.json({ alerts: alerts || [] })

  } catch (error) {
    logger.error('Get task alerts error', error as Error, { endpoint: 'GET /api/task-alerts' })
    return NextResponse.json(
      { error: 'Грешка при зареждане на известията' },
      { status: 500 }
    )
  }
}

// POST - Create a new task alert
export async function POST(request: NextRequest) {
  try {
    const body: TaskAlert = await request.json()

    if (!body.user_id) {
      return NextResponse.json(
        { error: 'user_id е задължителен' },
        { status: 400 }
      )
    }

    // Validate at least one filter is set
    const hasFilter = 
      (body.categories && body.categories.length > 0) ||
      (body.locations && body.locations.length > 0) ||
      (body.keywords && body.keywords.length > 0) ||
      body.min_budget > 0 ||
      body.max_budget < 999999

    if (!hasFilter) {
      return NextResponse.json(
        { error: 'Моля изберете поне един филтър (категория, локация, цена или ключова дума)' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Check if user already has too many alerts (limit to 10)
    const { count } = await supabase
      .from('task_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', body.user_id)

    if (count && count >= 10) {
      return NextResponse.json(
        { error: 'Достигнахте максималния брой известия (10). Моля изтрийте някое от съществуващите.' },
        { status: 400 }
      )
    }

    // Generate a name if not provided
    const alertName = body.name || generateAlertName(body)

    const { data: alert, error } = await supabase
      .from('task_alerts')
      .insert({
        user_id: body.user_id,
        name: alertName,
        categories: body.categories || [],
        locations: body.locations || [],
        min_budget: body.min_budget || 0,
        max_budget: body.max_budget || 999999,
        keywords: body.keywords || [],
        email_enabled: body.email_enabled ?? true,
        push_enabled: body.push_enabled ?? false,
        frequency: body.frequency || 'immediate',
        is_active: true
      })
      .select()
      .single()

    if (error) {
      logger.error('Create task alert error', error, { userId: body.user_id })
      throw error
    }

    return NextResponse.json({
      success: true,
      alert,
      message: 'Известието е създадено успешно! Ще получите email когато се появи подходяща задача.'
    })

  } catch (error) {
    logger.error('Create task alert error', error as Error, { endpoint: 'POST /api/task-alerts' })
    return NextResponse.json(
      { error: 'Грешка при създаване на известието' },
      { status: 500 }
    )
  }
}

// PUT - Update a task alert
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, user_id, ...updates } = body

    if (!id || !user_id) {
      return NextResponse.json(
        { error: 'id и user_id са задължителни' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { data: alert, error } = await supabase
      .from('task_alerts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user_id) // Security: only update own alerts
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      alert,
      message: 'Известието е обновено'
    })

  } catch (error) {
    logger.error('Update task alert error', error as Error, { endpoint: 'PUT /api/task-alerts' })
    return NextResponse.json(
      { error: 'Грешка при обновяване на известието' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a task alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id и userId са задължителни' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    const { error } = await supabase
      .from('task_alerts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Security: only delete own alerts

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Известието е изтрито'
    })

  } catch (error) {
    logger.error('Delete task alert error', error as Error, { endpoint: 'DELETE /api/task-alerts' })
    return NextResponse.json(
      { error: 'Грешка при изтриване на известието' },
      { status: 500 }
    )
  }
}

// Helper function to generate alert name
function generateAlertName(alert: TaskAlert): string {
  const parts: string[] = []

  if (alert.categories && alert.categories.length > 0) {
    const categoryLabels: Record<string, string> = {
      'cleaning': 'Почистване',
      'handyman': 'Майсторски услуги',
      'moving': 'Преместване',
      'delivery': 'Доставки',
      'gardening': 'Градинарство',
      'assembly': 'Сглобяване',
      'painting': 'Боядисване',
      'plumbing': 'ВиК',
      'electrical': 'Електро',
      'tutoring': 'Уроци',
      'pet-care': 'Домашни любимци',
      'tech-help': 'Техническа помощ',
      'other': 'Други',
    }
    const labels = alert.categories.map(c => categoryLabels[c] || c)
    parts.push(labels.slice(0, 2).join(', '))
    if (labels.length > 2) parts[0] += ` +${labels.length - 2}`
  }

  if (alert.locations && alert.locations.length > 0) {
    parts.push(alert.locations.slice(0, 2).join(', '))
    if (alert.locations.length > 2) parts[parts.length - 1] += ` +${alert.locations.length - 2}`
  }

  if (alert.min_budget > 0 || alert.max_budget < 999999) {
    if (alert.min_budget > 0 && alert.max_budget < 999999) {
      parts.push(`${alert.min_budget}-${alert.max_budget} €`)
    } else if (alert.min_budget > 0) {
      parts.push(`от ${alert.min_budget} €`)
    } else {
      parts.push(`до ${alert.max_budget} €`)
    }
  }

  return parts.join(' • ') || 'Всички задачи'
}

