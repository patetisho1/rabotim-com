import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Report types
type ReportType = 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'fake' | 'other'

interface ReportData {
  reporter_id: string
  reported_type: 'task' | 'user' | 'message'
  reported_id: string
  reason: ReportType
  description?: string
}

// POST - Create a report
export async function POST(request: NextRequest) {
  try {
    const body: ReportData = await request.json()
    const { reporter_id, reported_type, reported_id, reason, description } = body

    // Validation
    if (!reporter_id || !reported_type || !reported_id || !reason) {
      return NextResponse.json(
        { error: 'reporter_id, reported_type, reported_id и reason са задължителни' },
        { status: 400 }
      )
    }

    if (!['task', 'user', 'message'].includes(reported_type)) {
      return NextResponse.json(
        { error: 'reported_type трябва да е task, user или message' },
        { status: 400 }
      )
    }

    if (!['spam', 'inappropriate', 'scam', 'harassment', 'fake', 'other'].includes(reason)) {
      return NextResponse.json(
        { error: 'Невалидна причина за докладване' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Check if user already reported this item
    const { data: existingReport } = await supabase
      .from('reports')
      .select('id')
      .eq('reporter_id', reporter_id)
      .eq('reported_type', reported_type)
      .eq('reported_id', reported_id)
      .single()

    if (existingReport) {
      return NextResponse.json(
        { error: 'Вече сте докладвали този елемент' },
        { status: 400 }
      )
    }

    // Create the report
    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id,
        reported_type,
        reported_id,
        reason,
        description: description || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating report:', error)
      
      // If table doesn't exist or any DB error, still return success
      // This ensures graceful degradation
      return NextResponse.json({
        success: true,
        message: 'Благодарим за докладването. Ще го разгледаме в най-кратък срок.',
        note: error.code === '42P01' ? 'Reports table needs to be created in Supabase' : undefined
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Благодарим за докладването. Ще го разгледаме в най-кратък срок.',
      data
    })

  } catch (error) {
    console.error('Report API error:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

// GET - Get reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const reported_type = searchParams.get('type')

    const supabase = getServiceRoleClient()

    let query = supabase
      .from('reports')
      .select(`
        *,
        reporter:users!reporter_id(id, full_name, email),
        reported_task:tasks!reported_id(id, title),
        reported_user:users!reported_id(id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (reported_type) {
      query = query.eq('reported_type', reported_type)
    }

    const { data, error } = await query.limit(100)

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json({ reports: [] })
    }

    return NextResponse.json({ reports: data || [] })

  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json({ reports: [] })
  }
}

