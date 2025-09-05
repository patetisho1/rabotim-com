import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

// GET /api/tasks - Вземи всички задачи с филтри
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const filters = {
      category: category || undefined,
      location: location || undefined,
      search: search || undefined
    }

    const tasks = await db.getTasks(filters)
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTasks = tasks.slice(startIndex, endIndex)

    return NextResponse.json({
      tasks: paginatedTasks,
      pagination: {
        page,
        limit,
        total: tasks.length,
        totalPages: Math.ceil(tasks.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Създай нова задача
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, location, price, priceType, urgent, deadline, attachments, userId } = body

    // Validation
    if (!title || !description || !category || !location || !price || !priceType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const task = await db.createTask({
      title,
      description,
      category,
      location,
      price: parseFloat(price),
      price_type: priceType,
      urgent: urgent || false,
      user_id: userId,
      status: 'active',
      applications_count: 0,
      views_count: 0,
      deadline: deadline || null,
      attachments: attachments || []
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
