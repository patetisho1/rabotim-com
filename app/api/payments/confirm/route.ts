import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { PAYMENT_PLANS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, paymentId } = await request.json()

    if (!paymentIntentId || !paymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get payment from database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', user.id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)

    if (updateError) {
      console.error('Update payment error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update payment' },
        { status: 500 }
      )
    }

    // Apply payment benefits based on plan type
    const plan = Object.values(PAYMENT_PLANS).find(p => p.id === payment.plan_id)
    if (plan) {
      if (payment.plan_id.includes('subscription')) {
        // Handle subscription
        await handleSubscriptionPayment(supabase, user.id, payment, plan)
      } else if (payment.plan_id.includes('task')) {
        // Handle task promotion
        await handleTaskPromotionPayment(supabase, user.id, payment, plan)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully'
    })

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionPayment(supabase: any, userId: string, payment: any, plan: any) {
  try {
    // Create or update premium subscription
    const expiresAt = new Date()
    if (plan.interval === 'month') {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else if (plan.interval === 'year') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    }

    const { error: subscriptionError } = await supabase
      .from('premium_subscriptions')
      .upsert({
        user_id: userId,
        plan_id: payment.plan_id,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: expiresAt.toISOString(),
        stripe_payment_intent_id: payment.stripe_payment_intent_id
      })

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError)
    }
  } catch (error) {
    console.error('Handle subscription payment error:', error)
  }
}

async function handleTaskPromotionPayment(supabase: any, userId: string, payment: any, plan: any) {
  try {
    if (!payment.task_id) return

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + plan.duration)

    // Update task with promotion
    const promotionFields: any = {
      expires_at: expiresAt.toISOString()
    }

    if (payment.plan_id === 'vip_task') {
      promotionFields.is_promoted = true
      promotionFields.promotion_level = 'vip'
    } else if (payment.plan_id === 'featured_task') {
      promotionFields.is_featured = true
      promotionFields.promotion_level = 'featured'
    } else if (payment.plan_id === 'top_task') {
      promotionFields.is_top = true
      promotionFields.promotion_level = 'top'
    }

    const { error: taskUpdateError } = await supabase
      .from('tasks')
      .update(promotionFields)
      .eq('id', payment.task_id)
      .eq('user_id', userId)

    if (taskUpdateError) {
      console.error('Task promotion update error:', taskUpdateError)
    }
  } catch (error) {
    console.error('Handle task promotion payment error:', error)
  }
}
