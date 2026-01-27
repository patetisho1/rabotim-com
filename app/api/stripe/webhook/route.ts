import { NextRequest, NextResponse } from 'next/server'
import { stripe, PlanId } from '@/lib/stripe'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import Stripe from 'stripe'

async function activatePremium(userId: string, planId: PlanId, subscriptionId: string, currentPeriodEnd: Date) {
  const supabase = getServiceRoleClient()
  
  // Update user's premium status
  const { error: userError } = await supabase
    .from('users')
    .update({
      is_premium: true,
      premium_type: planId,
      premium_until: currentPeriodEnd.toISOString(),
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (userError) {
    logger.error('Failed to update user premium status', userError)
    throw userError
  }

  // Also update professional_profiles if exists
  const { error: profileError } = await supabase
    .from('professional_profiles')
    .update({
      is_premium: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (profileError && profileError.code !== 'PGRST116') {
    logger.error('Failed to update professional profile premium status', profileError)
  }

  logger.info('Premium activated', { userId, planId, subscriptionId })
}

async function deactivatePremium(userId: string) {
  const supabase = getServiceRoleClient()
  
  // Update user's premium status
  const { error: userError } = await supabase
    .from('users')
    .update({
      is_premium: false,
      premium_type: null,
      premium_until: null,
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (userError) {
    logger.error('Failed to deactivate user premium status', userError)
    throw userError
  }

  // Also update professional_profiles if exists
  const { error: profileError } = await supabase
    .from('professional_profiles')
    .update({
      is_premium: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (profileError && profileError.code !== 'PGRST116') {
    logger.error('Failed to deactivate professional profile premium status', profileError)
  }

  logger.info('Premium deactivated', { userId })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      logger.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      logger.error('Webhook signature verification failed', err)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    logger.info('Stripe webhook received', { type: event.type, id: event.id })

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId || session.client_reference_id
        const planId = session.metadata?.planId as PlanId

        if (userId && planId && session.subscription) {
          // Get subscription details - use 'any' due to Stripe SDK type mismatch
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
          
          await activatePremium(userId, planId, subscription.id, currentPeriodEnd)
        }
        break
      }

      case 'customer.subscription.updated': {
        // Use 'any' due to Stripe SDK type mismatch
        const subscription = event.data.object as any
        const userId = subscription.metadata?.userId
        const planId = subscription.metadata?.planId as PlanId

        if (userId && planId) {
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
          
          if (subscription.status === 'active') {
            await activatePremium(userId, planId, subscription.id, currentPeriodEnd)
          } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            await deactivatePremium(userId)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Use 'any' due to Stripe SDK type mismatch
        const subscription = event.data.object as any
        const userId = subscription.metadata?.userId

        if (userId) {
          await deactivatePremium(userId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        // Handle successful payment - could send email notification
        logger.info('Invoice payment succeeded', { 
          invoiceId: invoice.id, 
          customerId: String(invoice.customer || '')
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Handle failed payment - could send email notification
        logger.warn('Invoice payment failed', undefined, { 
          invoiceId: invoice.id, 
          customerId: String(invoice.customer || '')
        })
        break
      }

      default:
        logger.info('Unhandled webhook event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    logger.error('Webhook handler error', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

