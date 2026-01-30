'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Eye, EyeOff, Lock, User, Phone, CheckCircle, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabaseAuth } from '@/lib/supabase-auth'
import SocialLogin from '@/components/SocialLogin'
import LocationSelector from '@/components/LocationSelector'
import ShareProfileModal from '@/components/ShareProfileModal'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [newUserId, setNewUserId] = useState<string | null>(null)
  const [newUserName, setNewUserName] = useState('')
  const [showDuplicateEmailMessage, setShowDuplicateEmailMessage] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    neighborhood: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    aboutMe: '' // Кратко описание - какво предлагаш / с какво се занимаваш
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowDuplicateEmailMessage(false)

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

      if (!formData.agreeToTerms) {
        toast.error('Трябва да се съгласите с условията за ползване')
        return
      }

      // Реална регистрация с Supabase
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          city: formData.city || null,
          neighborhood: formData.neighborhood || null,
          about_me: formData.aboutMe || null
        }
      )

      if (error) {
        toast.error(error.message || 'Грешка при регистрацията')
        return
      }

      // Supabase при съществуващ имейл не връща грешка (защита срещу изброяване); identities е празен
      if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
        setShowDuplicateEmailMessage(true)
        toast.error('Този имейл вече е регистриран. Вижте съобщението по-долу за „Забравена парола“.', { duration: 6000 })
        return
      }

      if (data.user) {
        console.log('Registration successful:', {
          user: data.user.id,
          email: data.user.email,
          confirmed: !!data.user.email_confirmed_at,
          hasSession: !!data.session
        })

        // Проверяваме дали потребителят е вече потвърден
        if (data.user.email_confirmed_at) {
          toast.success('Регистрацията е успешна! Добре дошли!')
          
          // Изпращане на welcome email ако Resend е конфигуриран
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'welcome',
                to: formData.email,
                name: `${formData.firstName} ${formData.lastName}`
              })
            })
          } catch (emailError) {
            // Игнорираме грешки при изпращане на welcome email - не е критично
            console.log('Welcome email not sent (Resend may not be configured):', emailError)
          }
          
          // Show share modal
          setNewUserId(data.user.id)
          setNewUserName(`${formData.firstName} ${formData.lastName}`)
          setShowShareModal(true)
          return
        }

        // Ако има session, значи потвърждението не е задължително
        if (data.session) {
          toast.success('Регистрацията е успешна! Добре дошли!')
          
          // Изпращане на welcome email ако Resend е конфигуриран
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'welcome',
                to: formData.email,
                name: `${formData.firstName} ${formData.lastName}`
              })
            })
          } catch (emailError) {
            console.log('Welcome email not sent:', emailError)
          }
          
          // Show share modal
          setNewUserId(data.user.id)
          setNewUserName(`${formData.firstName} ${formData.lastName}`)
          setShowShareModal(true)
          return
        }

        // Няма session и няма потвърждение - вероятно confirmations са включени
        // Supabase вече е изпратил имейл за потвърждение при signup
        // Проверяваме дали трябва да изпратим повторно
        console.log('No session after signup, email confirmation required')
        
        // Supabase автоматично изпраща имейл при signup, ако confirmations са включени
        // Не е нужно да изпращаме повторно веднага
        toast.success('Регистрацията е успешна!', {
          duration: 4000
        })
        toast('Моля, проверете имейла си за потвърждение. След като потвърдите имейла си, ще можете да влезете в акаунта си.', {
          duration: 10000,
          icon: '📧'
        })

        router.push('/login')
        return
      }

      // Ако стигнем до тук, значи има проблем с регистрацията
      toast.error('Възникна неочаквана грешка при регистрацията')

    } catch (error) {
      toast.error('Възникна грешка при регистрацията')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
          {/* Social Login бутони */}
          <div className="mb-6">
            <SocialLogin 
              variant="compact" 
              onSuccess={() => router.push('/')}
            />
          </div>

          {/* Разделител */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                или се регистрирайте с имейл
              </span>
            </div>
          </div>

          {showDuplicateEmailMessage && (
            <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p>
                Този имейл вече е регистриран. Ако сте забравили паролата си, използвайте линка{' '}
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 underline">
                  Забравена парола
                </Link>
                .
              </p>
            </div>
          )}

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

            {/* Местоположение */}
            <LocationSelector
              city={formData.city}
              neighborhood={formData.neighborhood}
              onCityChange={(city) => setFormData(prev => ({ ...prev, city }))}
              onNeighborhoodChange={(neighborhood) => setFormData(prev => ({ ...prev, neighborhood }))}
              required={false}
              showLabel={true}
            />

            {/* За мен - опционално */}
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700">
                С какво се занимавате? <span className="text-gray-400 font-normal">(опционално)</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Кратко описание на вашите услуги или умения. Можете да го добавите и по-късно.
              </p>
              <div className="mt-1">
                <textarea
                  id="aboutMe"
                  name="aboutMe"
                  rows={2}
                  maxLength={200}
                  value={formData.aboutMe}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="напр. Майстор на ремонти, Почистване на домове, Уроци по математика..."
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.aboutMe.length}/200</p>
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

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false)
          router.push('/')
        }}
        onSkip={() => {
          setShowShareModal(false)
          router.push('/')
        }}
        profileUrl={newUserId ? `${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/user/${newUserId}` : ''}
        userName={newUserName}
      />
    </div>
  )
} 