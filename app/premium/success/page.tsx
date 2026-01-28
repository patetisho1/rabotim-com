'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAccountMode } from '@/contexts/AccountModeContext'
import confetti from '@/lib/confetti'

export default function PremiumSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { refreshStatus } = useAccountMode()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('Невалидна сесия')
      setIsLoading(false)
      return
    }

    // Verify the session and refresh status
    const verifyPayment = async () => {
      try {
        // Refresh the account mode status to get updated premium info
        await refreshStatus()
        
        // Trigger confetti animation
        confetti()
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error verifying payment:', err)
        setError('Грешка при проверка на плащането')
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, refreshStatus])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Проверяваме плащането...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Възникна грешка
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/premium')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Опитай отново
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            🎉 Поздравления!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Вече си <span className="text-yellow-600 font-semibold">Professional</span>!
          </p>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-medium mb-8">
            <Crown className="h-5 w-5" />
            Premium активиран
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Какво следва?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Профилът ти вече е видим в каталога „Професионалисти"
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Клиентите могат да се свържат директно с теб
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Имаш достъп до всички премиум функции
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/profile/professional')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Редактирай профила
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/professionals')}
              className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
            >
              Виж профила си в каталога
            </button>
          </div>
        </div>

        {/* Support Note */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Имаш въпроси? Свържи се с нас на{' '}
          <a href="mailto:support@rabotim.com" className="text-blue-600 hover:underline">
            support@rabotim.com
          </a>
        </p>
      </div>
    </div>
  )
}


