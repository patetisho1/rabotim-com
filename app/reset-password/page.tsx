'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabaseAuth } from '@/lib/supabase-auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash || '' : ''
    const hasRecoveryHash = hash.includes('type=recovery') || hash.includes('access_token')

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true)
        return
      }
      // Ако има hash от линка за reset, изчакваме Supabase да обработи токена преди да покажем „Невалиден линк“
      if (hasRecoveryHash) {
        timeoutId = setTimeout(() => {
          supabaseAuth.auth.getSession().then(({ data: { session: s } }) => {
            setHasSession(!!s)
          })
        }, 3000)
        return
      }
      setHasSession(false)
    })

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session)
    })

    return () => {
      subscription.unsubscribe()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('Моля, попълнете двете полета за парола')
      return
    }
    if (password.length < 6) {
      toast.error('Паролата трябва да е поне 6 символа')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Паролите не съвпадат')
      return
    }
    setIsSubmitting(true)
    try {
      const { error } = await supabaseAuth.auth.updateUser({ password: password.trim() })
      if (error) {
        toast.error(error.message || 'Грешка при смяната на паролата')
        return
      }
      setIsSuccess(true)
      toast.success('Паролата е сменена. Сега влезте с новата си парола.')
      // Изход от акаунта – потребителят не остава „влязъл“, трябва да влезе с новата парола
      await supabaseAuth.auth.signOut()
      setTimeout(() => router.push('/login?password_reset=1'), 1500)
    } catch (error) {
      toast.error('Възникна грешка при смяната на паролата')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (hasSession === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Невалиден или изтекъл линк</h2>
          <p className="text-gray-600">
            Линкът за възстановяване на паролата не е валиден или е изтекъл. Моля, заявете нов линк от страницата „Забравена парола“.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Забравена парола
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-success-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Паролата е сменена</h2>
          <p className="text-gray-600">Ще бъдете пренасочени към входа. Влезте с новата си парола.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Възстановяване на парола</h2>
          <p className="mt-2 text-sm text-gray-600">
            Вие сте тук след линк от имейла. Задайте нова парола по-долу. След запазване ще бъдете пренасочени към входа – влезте с новата си парола.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Нова парола *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Минимум 6 символа"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Потвърди парола *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Повторете паролата"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                Запазване...
              </>
            ) : (
              'Запази новата парола'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Помните ли паролата си?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Влезте тук
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
