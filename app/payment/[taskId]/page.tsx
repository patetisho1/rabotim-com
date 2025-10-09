'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Task } from '@/hooks/useTasksAPI'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'paypal'
  name: string
  icon: string
  last4?: string
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = parseInt(params.taskId as string)
  
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Кредитна/дебитна карта',
      icon: 'card'
    },
    {
      id: 'bank',
      type: 'bank',
      name: 'Банков превод',
      icon: 'bank'
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: 'paypal'
    }
  ]

  useEffect(() => {
    checkLoginStatus()
    loadTask()
  }, [taskId])

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loginStatus !== 'true' || !userData) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    setIsLoggedIn(true)
  }

  const loadTask = () => {
    // Симулация на зареждане на задача
    const sampleTask: Task = {
      id: taskId,
      title: 'Помощ при преместване',
      price: '45',
      priceType: 'fixed',
      user: {
        name: 'Иван Петров'
      }
    }
    setTask(sampleTask)
    setIsLoading(false)
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
    if (methodId === 'card') {
      setShowCardForm(true)
    } else {
      setShowCardForm(false)
    }
  }

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmitPayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Моля, изберете начин на плащане')
      return
    }

    if (selectedPaymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name)) {
      toast.error('Моля, попълнете всички полета за картата')
      return
    }

    setIsProcessing(true)

    try {
      // Симулация на плащане
      await new Promise(resolve => setTimeout(resolve, 3000))

      toast.success('Плащането е успешно!')
      
      // Пренасочване към страница за успех
      setTimeout(() => {
        router.push(`/payment-success/${taskId}`)
      }, 1500)

    } catch (error) {
      toast.error('Възникна грешка при плащането')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodIcon = (icon: string) => {
    switch (icon) {
      case 'card':
        return <CreditCard size={20} className="text-blue-600" />
      case 'bank':
        return <CreditCard size={20} className="text-green-600" />
      case 'paypal':
        return <CreditCard size={20} className="text-blue-500" />
      default:
        return <CreditCard size={20} className="text-gray-600" />
    }
  }

  if (!isLoggedIn) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Задачата не е намерена</p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary mt-4"
          >
            Назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Плащане
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Task Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Детайли за задачата
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Задача:</span>
                  <span className="font-medium">{task.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Изпълнител:</span>
                  <span className="font-medium">{task.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Сума:</span>
                  <span className="font-semibold text-lg text-primary-600">
                    {task.price} {task.price_type === 'hourly' ? 'лв/час' : 'лв'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Начин на плащане
              </h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => handlePaymentMethodSelect(method.id)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-3">
                      {getPaymentMethodIcon(method.icon)}
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Card Form */}
              {showCardForm && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Данни за картата
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Номер на картата
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Валидност
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Име на картодържателя
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                        placeholder="Иван Петров"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitPayment}
              disabled={isProcessing || !selectedPaymentMethod}
              className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Обработка на плащането...
                </>
              ) : (
                `Плати ${task.price} ${task.price_type === 'hourly' ? 'лв/час' : 'лв'}`
              )}
            </button>
          </div>

          {/* Security Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Сигурност
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                  <span>SSL криптиране за защита на данните</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                  <span>Плащането се обработва чрез сигурни платежни системи</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                  <span>Вашите данни не се съхраняват в нашата система</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle size={20} className="text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  Важно
                </h3>
              </div>
              
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  • Плащането се обработва в реално време
                </p>
                <p>
                  • Получавате потвърждение на email
                </p>
                <p>
                  • При проблеми се свържете с поддръжката
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 