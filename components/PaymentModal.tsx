'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle } from 'lucide-react'
import PaymentForm from './PaymentForm'
import { PAYMENT_PLANS } from '@/lib/stripe'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  taskId?: string
  onSuccess?: () => void
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  planId, 
  taskId,
  onSuccess 
}: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const plan = Object.values(PAYMENT_PLANS).find(p => p.id === planId)

  if (!plan) {
    return null
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setPaymentStatus('processing')

      // Confirm payment with our API
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentId: taskId // This should be the payment ID from create-intent
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus('success')
        setTimeout(() => {
          onSuccess?.()
          onClose()
          setPaymentStatus('idle')
        }, 2000)
      } else {
        setErrorMessage(data.error || 'Payment confirmation failed')
        setPaymentStatus('error')
      }
    } catch (error) {
      setErrorMessage('Network error occurred')
      setPaymentStatus('error')
    }
  }

  const handlePaymentError = (error: string) => {
    setErrorMessage(error)
    setPaymentStatus('error')
  }

  const handleClose = () => {
    if (paymentStatus === 'processing') return
    setPaymentStatus('idle')
    setErrorMessage('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Complete Payment
          </h2>
          <button
            onClick={handleClose}
            disabled={paymentStatus === 'processing'}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your payment has been processed successfully.
              </p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {errorMessage}
              </p>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {paymentStatus === 'idle' && (
            <div>
              {/* Plan Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {plan.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {(plan.price / 100).toFixed(2)} {plan.currency.toUpperCase()}
                  </span>
                  {'duration' in plan && plan.duration && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.duration} days
                    </span>
                  )}
                  {'interval' in plan && plan.interval && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      per {plan.interval}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              {plan.features && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Payment Form */}
              <PaymentForm
                amount={plan.price}
                currency={plan.currency}
                planId={plan.id}
                planName={plan.name}
                description={plan.description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Processing Payment...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we confirm your payment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
