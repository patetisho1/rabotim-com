'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Eye, EyeOff, Lock, User, Phone, CheckCircle, Briefcase, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    roles: {
      taskGiver: false,
      taskExecutor: false
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Валидация
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Моля, попълнете всички задължителни полета')
        return
      }

      // Валидация на имената
      if (formData.firstName.length < 2) {
        toast.error('Името трябва да бъде поне 2 символа')
        return
      }

      if (formData.lastName.length < 2) {
        toast.error('Фамилията трябва да бъде поне 2 символа')
        return
      }

      // Валидация на email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Моля, въведете валиден имейл адрес')
        return
      }

      // Проверка дали email вече съществува
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const userExists = existingUsers.find((user: any) => user.email === formData.email)
      if (userExists) {
        toast.error('Този имейл адрес вече е регистриран')
        return
      }

      // Валидация на паролата
      if (formData.password.length < 6) {
        toast.error('Паролата трябва да е поне 6 символа')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Паролите не съвпадат')
        return
      }

      // Валидация на телефон (ако е въведен)
      if (formData.phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
        if (!phoneRegex.test(formData.phone)) {
          toast.error('Моля, въведете валиден телефонен номер')
          return
        }
      }

      // Валидация на ролите
      if (!formData.roles.taskGiver && !formData.roles.taskExecutor) {
        toast.error('Трябва да изберете поне една роля')
        return
      }

      if (!formData.agreeToTerms) {
        toast.error('Трябва да се съгласите с условията за ползване')
        return
      }

      // Симулация на регистрация
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Запазване в localStorage
      const userData = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // В реален проект паролата ще бъде хеширана
        roles: formData.roles,
        createdAt: new Date().toISOString(),
        isVerified: false,
        
        // Данни за даващ задачи
        taskGiver: {
          totalTasksPosted: 0,
          completedTasks: 0,
          totalSpent: 0,
          rating: 0,
          reviews: []
        },
        
        // Данни за изпълнител
        taskExecutor: {
          completedTasks: 0,
          totalEarnings: 0,
          rating: 0,
          totalReviews: 0,
          skills: [],
          portfolio: [],
          responseRate: 100,
          avgResponseTime: '2ч',
          isVerified: false,
          badges: []
        },
        
        // Общи данни
        profile: {
          bio: '',
          location: '',
          avatar: '',
          joinDate: new Date().toISOString()
        }
      }

      // Запазване в списъка с потребители
      existingUsers.push(userData)
      localStorage.setItem('users', JSON.stringify(existingUsers))

      // Запазване на текущия потребител
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isLoggedIn', 'true')

      toast.success('Регистрацията е успешна!')
      
      // Пренасочване към профила
      setTimeout(() => {
        router.push('/profile')
      }, 1000)

    } catch (error) {
      toast.error('Възникна грешка при регистрацията')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (name.startsWith('roles.')) {
      const roleName = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        roles: {
          ...prev.roles,
          [roleName]: checked
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Назад
          </button>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Създайте акаунт
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Присъединете се към нашата общност
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Имена */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Име *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Вашето име"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Фамилия *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Вашата фамилия"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Имейл адрес *
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Телефон */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <div className="mt-1 relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+359 888 123 456"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Роли */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Как искате да използвате платформата? *
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="roles.taskGiver"
                    checked={formData.roles.taskGiver}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Даващ задачи</div>
                      <div className="text-sm text-gray-500">Публикувайте задачи и намерете изпълнители</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="roles.taskExecutor"
                    checked={formData.roles.taskExecutor}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex items-center">
                    <Wrench className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Изпълнител</div>
                      <div className="text-sm text-gray-500">Изпълнявайте задачи и изкаравайте пари</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Пароли */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Парола *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Минимум 6 символа"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Потвърди парола *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Повторете паролата"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Условия */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                Съгласен съм с{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  условията за ползване
                </a>{' '}
                и{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  политиката за поверителност
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Регистриране...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Създайте акаунт
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Вече имате акаунт?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Влезте тук
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 