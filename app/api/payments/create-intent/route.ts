import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createPaymentIntent, PAYMENT_PLANS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, planId, planName, description } = await request.json()

    // Validate required fields
    if (!amount || !currency || !planId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate plan exists
    const plan = Object.values(PAYMENT_PLANS).find(p => p.id === planId)
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Validate amount matches plan
    if (amount !== plan.price) {
      return NextResponse.json(
        { success: false, error: 'Amount mismatch' },
        { status: 400 }
      )
    }

    // Create payment intent with Stripe
    const result = await createPaymentIntent(amount, currency, {
      userId: user.id,
      planId,
      planName: planName || plan.name,
      description: description || plan.description
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Store payment in database
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        type: planId.includes('subscription') ? 'premium_subscription' : 'task_promotion',
        plan_id: planId,
        amount,
        currency,
        status: 'pending',
        stripe_payment_intent_id: result.paymentIntentId,
        metadata: {
          planName: planName || plan.name,
          description: description || plan.description
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to store payment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentId: payment.id
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
