import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Helper to get authenticated user from request
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

// GET - Get a single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    const serviceClient = getServiceRoleClient()

    const { data, error } = await serviceClient
      .from('bookings')
      .select(`
        *,
        professional:professional_profiles(
          id,
          username,
          display_name,
          profession_title,
          contact_phone,
          contact_email,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Check authorization - user must be either the client or the professional
    if (user) {
      const isClient = data.client_user_id === user.id
      const isProfessional = data.professional?.user_id === user.id
      if (!isClient && !isProfessional) {
        return NextResponse.json(
          { error: 'Not authorized to view this booking' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ booking: data })
  } catch (error) {
    logger.error('Failed to fetch booking', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH - Update booking status or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, professionalNotes } = body

    // Validate status if provided
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceRoleClient()
    
    // Verify user is authorized (must be the professional for this booking)
    const { data: booking } = await serviceClient
      .from('bookings')
      .select('professional_id, professional_profiles!inner(user_id)')
      .eq('id', params.id)
      .single()
    
    if (!booking || (booking as any).professional_profiles?.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this booking' },
        { status: 403 }
      )
    }

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updateData.status = status
      
      // Set timestamp based on status
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString()
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString()
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
    }

    if (professionalNotes !== undefined) {
      updateData.professional_notes = professionalNotes
    }

    const { data, error } = await serviceClient
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Send notification email to client about status change
    if (status) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking_status_update',
            bookingId: params.id,
            newStatus: status,
            clientEmail: data.client_email,
            clientName: data.client_name,
            bookingDate: data.booking_date,
            startTime: data.start_time
          })
        })
      } catch (emailError) {
        logger.warn('Failed to send booking status notification email', emailError as Error)
      }
    }

    return NextResponse.json({ 
      booking: data, 
      success: true,
      message: status === 'confirmed' 
        ? 'Резервацията е потвърдена!' 
        : status === 'cancelled'
        ? 'Резервацията е отказана'
        : 'Резервацията е обновена'
    })
  } catch (error) {
    logger.error('Failed to update booking', error as Error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a booking (only for pending bookings)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const serviceClient = getServiceRoleClient()

    // First check if booking exists, is pending, and user is authorized
    const { data: booking, error: fetchError } = await serviceClient
      .from('bookings')
      .select('status, client_user_id, professional_profiles!inner(user_id)')
      .eq('id', params.id)
      .single()
    
    // Check authorization - must be either client or professional
    if (booking) {
      const isClient = booking.client_user_id === user.id
      const isProfessional = (booking as any).professional_profiles?.user_id === user.id
      if (!isClient && !isProfessional) {
        return NextResponse.json(
          { error: 'Not authorized to delete this booking' },
          { status: 403 }
        )
      }
    }

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      throw fetchError
    }

    // Only allow deletion of pending or cancelled bookings
    if (!['pending', 'cancelled'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Cannot delete a confirmed or completed booking' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await serviceClient
      .from('bookings')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ 
      success: true,
      message: 'Резервацията е изтрита'
    })
  } catch (error) {
    logger.error('Failed to delete booking', error as Error)
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}

