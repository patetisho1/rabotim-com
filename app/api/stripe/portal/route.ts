import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = getServiceRoleClient()

    // Get user's Stripe customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let customerId = userData.stripe_customer_id

    // If no customer ID, try to find by email or create new customer
    if (!customerId) {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email: userData.email,
        limit: 1,
      })

      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: userData.email,
          metadata: {
            userId,
          },
        })
        customerId = customer.id
      }

      // Save customer ID to database
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Get the base URL for redirects
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'

    // Create Stripe Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/profile`,
    })

    logger.info('Stripe portal session created', { userId })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    logger.error('Failed to create portal session', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}

