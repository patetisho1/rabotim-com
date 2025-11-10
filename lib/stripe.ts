import Stripe from 'stripe'

// Initialize Stripe with test keys
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key_here', {
  apiVersion: '2025-09-30.clover',
})

// Stripe publishable key for frontend
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key_here'

// Payment plans configuration
export const PAYMENT_PLANS = {
  // Task promotion plans
  VIP_TASK: {
    id: 'vip_task',
    name: 'VIP Task Promotion',
    description: 'Make your task stand out with VIP promotion',
    price: 2990, // 29.90 BGN in stotinki
    currency: 'bgn',
    duration: 7, // days
    features: ['Top placement', 'Highlighted design', 'Priority support']
  },
  FEATURED_TASK: {
    id: 'featured_task',
    name: 'Featured Task Promotion',
    description: 'Get more visibility with featured promotion',
    price: 1990, // 19.90 BGN in stotinki
    currency: 'bgn',
    duration: 5, // days
    features: ['Featured placement', 'Enhanced visibility', 'Better reach']
  },
  TOP_TASK: {
    id: 'top_task',
    name: 'Top Task Promotion',
    description: 'Boost your task to the top',
    price: 990, // 9.90 BGN in stotinki
    currency: 'bgn',
    duration: 3, // days
    features: ['Top placement', 'Increased views', 'Better engagement']
  },
  
  // Premium user plans
  PREMIUM_USER_MONTHLY: {
    id: 'premium_user_monthly',
    name: 'Premium User (Monthly)',
    description: 'Premium features for one month',
    price: 1990, // 19.90 BGN in stotinki
    currency: 'bgn',
    interval: 'month',
    features: ['Unlimited task posts', 'Advanced analytics', 'Priority support', 'Custom branding']
  },
  PREMIUM_USER_YEARLY: {
    id: 'premium_user_yearly',
    name: 'Premium User (Yearly)',
    description: 'Premium features for one year',
    price: 19900, // 199.00 BGN in stotinki
    currency: 'bgn',
    interval: 'year',
    features: ['Unlimited task posts', 'Advanced analytics', 'Priority support', 'Custom branding', '2 months free']
  }
}

// Payment status types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'

// Payment types
export type PaymentType = 'task_promotion' | 'premium_subscription' | 'one_time_payment'

// Payment interface
export interface Payment {
  id: string
  userId: string
  taskId?: string
  type: PaymentType
  planId: string
  amount: number
  currency: string
  status: PaymentStatus
  stripePaymentIntentId?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  metadata?: Record<string, any>
}

// Create payment intent
export async function createPaymentIntent(
  amount: number,
  currency: string = 'bgn',
  metadata: Record<string, any> = {}
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Create subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata: Record<string, any> = {}
) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    return {
      success: true,
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Verify webhook signature
export function verifyWebhookSignature(payload: string, signature: string) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    throw error
  }
}
