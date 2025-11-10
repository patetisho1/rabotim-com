'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Eye, EyeOff, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import SocialLogin from '@/components/SocialLogin'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle, signInWithFacebook, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  // Демо потребители за тестване
  const demoUsers = [
    {
      email: 'demo@rabotim.com',
      password: 'demo123',
      firstName: 'Демо',
      lastName: 'Потребител',
      role: 'user'
    },
    {
      email: 'admin@rabotim.com',
      password: 'admin123',
      firstName: 'Админ',
      lastName: 'Потребител',
      role: 'admin'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Валидация
      if (!formData.email || !formData.password) {
        toast.error('Моля, попълнете всички полета')
        return
      }

      // Проверка на email формат
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Моля, въведете валиден имейл адрес')
        return
      }

      // Проверка на парола
      if (formData.password.length < 6) {
        toast.error('Паролата трябва да бъде поне 6 символа')
        return
      }

      // Реален вход с Supabase
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        toast.error(error.message || 'Невалиден имейл или парола')
        return
      }

      if (data.user) {
        console.log('Login successful, user:', data.user)
        console.log('Session:', data.session)
        toast.success('Успешно влизане!')
        // Малко забавяне за да се синхронизира сесията
        setTimeout(() => {
          router.push('/profile')
        }, 1000)
      }


    } catch (error) {
      toast.error('Възникна грешка при входа')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsSubmitting(true)
      let result
      
      if (provider === 'google') {
        result = await signInWithGoogle()
      } else {
        result = await signInWithFacebook()
      }
      
      if (result?.error) {
        toast.error(`Грешка при вход с ${provider === 'google' ? 'Google' : 'Facebook'}`)
      } else {
        toast.success(`Успешен вход с ${provider === 'google' ? 'Google' : 'Facebook'}!`)
        // Пренасочване към профила след OAuth логин
        router.push('/profile')
      }
    } catch (error) {
      toast.error('Възникна грешка при входа')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({
      email,
      password,
      rememberMe: false
    })
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
            Влезте в акаунта си
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Добре дошли обратно в Rabotim.com
          </p>
        </div>

        {/* Demo Login Buttons */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500 text-center">Бързо тестване:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('demo@rabotim.com', 'demo123')}
              className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Демо потребител
            </button>
            <button
              onClick={() => handleDemoLogin('admin@rabotim.com', 'admin123')}
              className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Админ
            </button>
          </div>
        </div>

        {/* Social Login */}
        <SocialLogin
          variant="default"
          onSuccess={() => router.push('/')}
          onError={(error) => toast.error(error)}
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">или</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имейл адрес
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Парола
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Въведете паролата си"
                required
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-gray-600">
                Запомни ме
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Забравена парола?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Влизане...
              </>
            ) : (
              'Влез'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Нямате акаунт?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Регистрирайте се тук
            </button>
          </p>
        </div>
      </div>
    </div>
  )
} 