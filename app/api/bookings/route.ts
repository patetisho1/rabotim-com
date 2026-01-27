import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export interface BookingData {
  professionalId: string
  professionalUserId: string
  clientUserId?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName?: string
  serviceId?: string
  bookingDate: string // ISO date string YYYY-MM-DD
  startTime: string // HH:MM format
  endTime?: string
  durationMinutes?: number
  clientNotes?: string
  estimatedPrice?: number
}

// GET - List bookings for a professional or client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const professionalUserId = searchParams.get('professionalUserId')
    const clientUserId = searchParams.get('clientUserId')
    const status = searchParams.get('status')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const serviceClient = getServiceRoleClient()

    let query = serviceClient
      .from('bookings')
      .select(`
        *,
        professional:professional_profiles(
          id,
          username,
          display_name,
          profession_title,
          contact_phone,
          contact_email
        )
      `)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true })

    // Filter by professional
    if (professionalId) {
      query = query.eq('professional_id', professionalId)
    }
    if (professionalUserId) {
      query = query.eq('professional_user_id', professionalUserId)
    }

    // Filter by client
    if (clientUserId) {
      query = query.eq('client_user_id', clientUserId)
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }

    // Filter by date range
    if (fromDate) {
      query = query.gte('booking_date', fromDate)
    }
    if (toDate) {
      query = query.lte('booking_date', toDate)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ bookings: data || [] })
  } catch (error) {
    logger.error('Failed to fetch bookings', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body: BookingData = await request.json()

    // Validate required fields
    if (!body.professionalId || !body.professionalUserId || !body.clientName || 
        !body.clientEmail || !body.bookingDate || !body.startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate date is not in the past
    const bookingDate = new Date(body.bookingDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Booking date cannot be in the past' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceRoleClient()

    // Check for conflicting bookings
    const { data: existingBookings } = await serviceClient
      .from('bookings')
      .select('id, start_time, end_time')
      .eq('professional_id', body.professionalId)
      .eq('booking_date', body.bookingDate)
      .neq('status', 'cancelled')

    // Simple overlap check (can be improved)
    const newStartMinutes = timeToMinutes(body.startTime)
    const newEndMinutes = body.endTime 
      ? timeToMinutes(body.endTime)
      : newStartMinutes + (body.durationMinutes || 60)

    const hasConflict = existingBookings?.some(booking => {
      const existingStart = timeToMinutes(booking.start_time)
      const existingEnd = booking.end_time 
        ? timeToMinutes(booking.end_time) 
        : existingStart + 60
      
      return (newStartMinutes < existingEnd && newEndMinutes > existingStart)
    })

    if (hasConflict) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    // Create the booking
    const bookingData = {
      professional_id: body.professionalId,
      professional_user_id: body.professionalUserId,
      client_user_id: body.clientUserId || null,
      client_name: body.clientName,
      client_email: body.clientEmail,
      client_phone: body.clientPhone || null,
      service_name: body.serviceName || null,
      service_id: body.serviceId || null,
      booking_date: body.bookingDate,
      start_time: body.startTime,
      end_time: body.endTime || null,
      duration_minutes: body.durationMinutes || 60,
      client_notes: body.clientNotes || null,
      estimated_price: body.estimatedPrice || null,
      status: 'pending',
      professional_notified_at: new Date().toISOString() // Mark as notified
    }

    const { data, error } = await serviceClient
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) throw error

    // Send notification email to professional
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_booking',
          professionalUserId: body.professionalUserId,
          bookingData: {
            clientName: body.clientName,
            clientEmail: body.clientEmail,
            clientPhone: body.clientPhone,
            serviceName: body.serviceName,
            bookingDate: body.bookingDate,
            startTime: body.startTime,
            clientNotes: body.clientNotes
          }
        })
      })
    } catch (emailError) {
      logger.warn('Failed to send booking notification email', emailError as Error)
    }

    return NextResponse.json({ 
      booking: data, 
      success: true,
      message: 'Резервацията е изпратена успешно!'
    })
  } catch (error) {
    logger.error('Failed to create booking', error as Error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// Helper function to convert time string to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

