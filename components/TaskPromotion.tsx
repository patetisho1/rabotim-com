'use client'

import { useState } from 'react'
import { Star, Zap, Crown, CheckCircle } from 'lucide-react'
import PaymentModal from './PaymentModal'
import { PAYMENT_PLANS } from '@/lib/stripe'

interface TaskPromotionProps {
  taskId: string
  currentPromotion?: string
  onPromotionSuccess?: () => void
}

export default function TaskPromotion({ 
  taskId, 
  currentPromotion,
  onPromotionSuccess 
}: TaskPromotionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const promotionPlans = [
    {
      id: 'top_task',
      name: 'Top Promotion',
      icon: <Star className="h-6 w-6" />,
      price: PAYMENT_PLANS.TOP_TASK.price,
      currency: PAYMENT_PLANS.TOP_TASK.currency,
      duration: PAYMENT_PLANS.TOP_TASK.duration,
      features: PAYMENT_PLANS.TOP_TASK.features,
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      isPopular: false
    },
    {
      id: 'featured_task',
      name: 'Featured Promotion',
      icon: <Zap className="h-6 w-6" />,
      price: PAYMENT_PLANS.FEATURED_TASK.price,
      currency: PAYMENT_PLANS.FEATURED_TASK.currency,
      duration: PAYMENT_PLANS.FEATURED_TASK.duration,
      features: PAYMENT_PLANS.FEATURED_TASK.features,
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-600',
      isPopular: true
    },
    {
      id: 'vip_task',
      name: 'VIP Promotion',
      icon: <Crown className="h-6 w-6" />,
      price: PAYMENT_PLANS.VIP_TASK.price,
      currency: PAYMENT_PLANS.VIP_TASK.currency,
      duration: PAYMENT_PLANS.VIP_TASK.duration,
      features: PAYMENT_PLANS.VIP_TASK.features,
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-600',
      isPopular: false
    }
  ]

  const handlePromote = (planId: string) => {
    setSelectedPlan(planId)
    setIsModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsModalOpen(false)
    setSelectedPlan(null)
    onPromotionSuccess?.()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Promote Your Task
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get more visibility and reach more potential workers
        </p>
      </div>

      {/* Current Promotion Status */}
      {currentPromotion && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800 dark:text-green-200">
              Currently promoted with {currentPromotion} plan
            </span>
          </div>
        </div>
      )}

      {/* Promotion Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 ${
              plan.isPopular ? plan.borderColor : 'border-gray-200 dark:border-gray-700'
            } p-6 shadow-sm hover:shadow-lg transition-all duration-200`}
          >
            {plan.isPopular && (
              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                Most Popular
              </div>
            )}

            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${plan.color} text-white rounded-full mb-4`}>
                {plan.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {plan.name}
              </h3>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {(plan.price / 100).toFixed(2)}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {plan.currency.toUpperCase()}
                </span>
                <div className="text-sm text-gray-500">
                  for {plan.duration} days
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePromote(plan.id)}
                disabled={currentPromotion === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                  currentPromotion === plan.id
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : plan.isPopular
                    ? `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                    : `border-2 ${plan.borderColor} ${plan.textColor} hover:bg-gray-50 dark:hover:bg-gray-700`
                }`}
              >
                {currentPromotion === plan.id ? 'Current Plan' : `Promote with ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planId={selectedPlan}
          taskId={taskId}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Additional Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Why promote your task?
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Get 3x more views and applications</li>
          <li>• Stand out from other tasks</li>
          <li>• Attract higher quality workers</li>
          <li>• Faster task completion</li>
        </ul>
      </div>
    </div>
  )
}


