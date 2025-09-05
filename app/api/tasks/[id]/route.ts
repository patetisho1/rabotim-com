import { NextRequest, NextResponse } from 'next/server'
import { db, supabase } from '@/lib/supabase'

// GET /api/tasks/[id] - Вземи конкретна задача
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await db.getTask(params.id)
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[id] - Обнови задача
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, location, price, priceType, urgent, deadline, attachments, status } = body

    // Get current task to check ownership
    const currentTask = await db.getTask(params.id)
    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (category !== undefined) updates.category = category
    if (location !== undefined) updates.location = location
    if (price !== undefined) updates.price = parseFloat(price)
    if (priceType !== undefined) updates.price_type = priceType
    if (urgent !== undefined) updates.urgent = urgent
    if (deadline !== undefined) updates.deadline = deadline
    if (attachments !== undefined) updates.attachments = attachments
    if (status !== undefined) updates.status = status

    // Update task
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Изтрий задача
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current task to check ownership
    const currentTask = await db.getTask(params.id)
    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
