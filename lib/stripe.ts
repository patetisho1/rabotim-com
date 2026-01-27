import Stripe from 'stripe'

// Server-side Stripe instance - lazy initialization to avoid build errors
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured. Please add it to your environment variables.')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  }
  return stripeInstance
}


// Premium plan configuration
export const PREMIUM_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    description: 'Основен премиум план за професионалисти',
    price: 2900, // in cents (29.00 EUR)
    currency: 'eur',
    interval: 'month' as const,
    features: [
      'Листване в каталога „Професионалисти"',
      'До 5 директни заявки на ден',
      '5 промотирани обяви на месец',
      'Основни статистики',
      'Email поддръжка',
    ],
    limits: {
      dailyContacts: 5,
      monthlyPromotedListings: 5,
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Професионален план с неограничени заявки',
    price: 3900, // in cents (39.00 EUR)
    currency: 'eur',
    interval: 'month' as const,
    features: [
      'Листване в каталога „Професионалисти"',
      'Неограничени директни заявки',
      '10 промотирани обяви на месец',
      'Разширени статистики',
      'Приоритетна поддръжка',
      'Календар за резервации',
    ],
    limits: {
      dailyContacts: -1, // unlimited
      monthlyPromotedListings: 10,
    },
    popular: true, // Mark as most popular
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Корпоративен план за екипи',
    price: 8900, // in cents (89.00 EUR)
    currency: 'eur',
    interval: 'month' as const,
    features: [
      'Всичко от Professional',
      'До 5 под-акаунта (служители)',
      '15 промотирани обяви на месец',
      'Персонален мениджър',
      'API достъп',
      'Приоритетна 24/7 поддръжка',
      'Бял етикет (white label)',
    ],
    limits: {
      dailyContacts: -1, // unlimited
      monthlyPromotedListings: 15,
      subAccounts: 5,
    }
  }
} as const

export type PlanId = keyof typeof PREMIUM_PLANS

// Get Stripe Price ID from environment or create dynamically
export function getStripePriceId(planId: PlanId): string {
  const envKey = `STRIPE_PRICE_${planId.toUpperCase()}`
  return process.env[envKey] || ''
}

// Format price for display
export function formatPrice(cents: number, currency: string = 'eur'): string {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

// Calculate yearly price with discount
export function getYearlyPrice(monthlyPriceCents: number, discountPercent: number = 20): number {
  const yearlyWithoutDiscount = monthlyPriceCents * 12
  const discount = yearlyWithoutDiscount * (discountPercent / 100)
  return Math.round(yearlyWithoutDiscount - discount)
}

// =========================================
// PAYMENT PLANS - for one-time payments (task promotions, etc.)
// =========================================

export const PAYMENT_PLANS = {
  TOP_TASK: {
    id: 'top_task',
    name: 'Базово промотиране',
    description: 'Покажи задачата си на повече хора',
    price: 299, // 2.99 EUR in cents
    currency: 'eur',
    duration: 3, // days
    features: [
      'Промотиране за 3 дни',
      'Показване в началото на списъка',
      'До 2x повече кандидати',
    ],
  },
  FEATURED_TASK: {
    id: 'featured_task',
    name: 'Професионално промотиране',
    description: 'Максимална видимост за твоята задача',
    price: 699, // 6.99 EUR in cents
    currency: 'eur',
    duration: 7, // days
    features: [
      'Промотиране за 7 дни',
      'Показване в началото + специален badge',
      'До 5x повече кандидати',
      'Изпращане в имейл бюлетин',
    ],
  },
  VIP_TASK: {
    id: 'vip_task',
    name: 'Премиум промотиране',
    description: 'Най-мощното промотиране за спешни задачи',
    price: 1299, // 12.99 EUR in cents
    currency: 'eur',
    duration: 14, // days
    features: [
      'Промотиране за 14 дни',
      'Показване в началото + премиум badge',
      'До 10x повече кандидати',
      'Изпращане в имейл бюлетин',
      'Показване на началната страница',
    ],
  },
} as const

export type PaymentPlanId = keyof typeof PAYMENT_PLANS

// Create a payment intent for one-time payments
export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: {
    userId: string
    planId: string
    planName?: string
    description?: string
  }
): Promise<{ success: boolean; clientSecret?: string; paymentIntentId?: string; error?: string }> {
  try {
    const stripeClient = getStripe()
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: metadata.userId,
        planId: metadata.planId,
        planName: metadata.planName || '',
        description: metadata.description || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret || undefined,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error.message || 'Failed to create payment intent',
    }
  }
}
