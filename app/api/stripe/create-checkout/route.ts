import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PREMIUM_PLANS, PlanId, getStripePriceId } from '@/lib/stripe'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, userId, userEmail, billingInterval = 'month' } = body

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      )
    }

    // Validate plan
    if (!PREMIUM_PLANS[planId as PlanId]) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    const plan = PREMIUM_PLANS[planId as PlanId]
    const stripe = getStripe()
    
    // Get or create Stripe Price ID
    let priceId = getStripePriceId(planId as PlanId)
    
    // If no price ID in env, create a price dynamically (for testing)
    if (!priceId) {
      // First, get or create a product
      const products = await stripe.products.list({
        limit: 1,
        active: true,
      })
      
      let product = products.data.find(p => p.metadata?.planId === planId)
      
      if (!product) {
        product = await stripe.products.create({
          name: `Rabotim.com ${plan.name}`,
          description: plan.description,
          metadata: {
            planId,
          }
        })
      }
      
      // Create a price for this product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: billingInterval === 'year' 
          ? Math.round(plan.price * 12 * 0.8) // 20% yearly discount
          : plan.price,
        currency: plan.currency,
        recurring: {
          interval: billingInterval,
        },
        metadata: {
          planId,
        }
      })
      
      priceId = price.id
    }

    // Get the base URL for redirects
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
        billingInterval,
      },
      success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium?canceled=true`,
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
      // Bulgarian locale
      locale: 'bg',
      // Allow promotion codes
      allow_promotion_codes: true,
    })

    logger.info('Stripe checkout session created', { sessionId: session.id, userId, planId })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error: any) {
    logger.error('Failed to create checkout session', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

