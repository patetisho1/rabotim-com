import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// GET - Get a single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
          contact_email
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
    const serviceClient = getServiceRoleClient()

    // First check if booking exists and is pending
    const { data: booking, error: fetchError } = await serviceClient
      .from('bookings')
      .select('status')
      .eq('id', params.id)
      .single()

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

