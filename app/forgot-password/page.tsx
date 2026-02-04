'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!email.trim()) {
        toast.error('Моля, въведете имейл адрес')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error('Моля, въведете валиден имейл адрес')
        return
      }

      // Supabase изпраща имейл за възстановяване само ако акаунтът съществува (не разкриваме дали имейлът е регистриран)
      const { error } = await resetPassword(email.trim())

      if (error) {
        const msg = error.message || ''
        const isRateLimit = /rate limit|limit exceeded|too many|превишен|лимит/i.test(msg)
        toast.error(isRateLimit ? 'Твърде много опити за кратко време. Моля изчакайте няколко минути и опитайте отново.' : (msg || 'Възникна грешка при изпращането'))
        return
      }

      setIsEmailSent(true)
      toast.success('Ако имейлът е регистриран, ще получите линк за възстановяване.')
    } catch (error) {
      toast.error('Възникна грешка при изпращането')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email.trim()) return
    setIsSubmitting(true)
    try {
      const { error } = await resetPassword(email.trim())
      if (error) {
        const msg = error.message || ''
        const isRateLimit = /rate limit|limit exceeded|too many|превишен|лимит/i.test(msg)
        toast.error(isRateLimit ? 'Твърде много опити за кратко време. Моля изчакайте няколко минути.' : (msg || 'Грешка при изпращането'))
        return
      }
      toast.success('Линкът е изпратен отново. Проверете пощата си.')
    } catch (error) {
      toast.error('Грешка при изпращането')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Забравена парола
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Въведете вашия имейл адрес и ще получите линк за възстановяване
          </p>
        </div>

        {!isEmailSent ? (
          /* Email Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имейл адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Изпращане...
                </>
              ) : (
                'Изпрати линк за възстановяване'
              )}
            </button>
          </form>
        ) : (
          /* Success Message */
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-success-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Проверете пощата си
              </h3>
              <p className="text-gray-600 mb-4">
                Ако имейлът <strong>{email}</strong> е регистриран в нашата система, изпратихме линк за възстановяване на паролата.
              </p>
              <p className="text-sm text-gray-500">
                Проверете входящата поща и спам папката и следвайте инструкциите в имейла.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={isSubmitting}
                className="w-full btn btn-outline"
              >
                {isSubmitting ? 'Изпращане...' : 'Изпрати отново'}
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="w-full text-primary-600 hover:text-primary-500 font-medium"
              >
                Връщане към входа
              </button>
            </div>
          </div>
        )}

        {/* Back to Login */}
        {!isEmailSent && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Помните ли паролата си?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Влезте тук
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 