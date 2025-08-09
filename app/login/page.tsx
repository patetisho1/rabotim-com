'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Eye, EyeOff, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
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

      // Симулация на вход
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Проверка дали потребителят съществува в демо данните
      const user = demoUsers.find(u => u.email === formData.email && u.password === formData.password)
      
      if (!user) {
        toast.error('Невалиден имейл или парола')
        return
      }

      // Запазване на състоянието за вход
      const userData = {
        id: Date.now(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(userData))

      toast.success(`Добре дошли, ${user.firstName}!`)
      
      // Пренасочване към началната страница
      setTimeout(() => {
        router.push('/')
      }, 1000)

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

  const handleSocialLogin = (provider: string) => {
    toast(`Вход с ${provider} ще бъде добавен скоро`, {
      icon: 'ℹ️',
    })
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

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Продължи с Google
          </button>

          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Продължи с Facebook
          </button>
        </div>

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