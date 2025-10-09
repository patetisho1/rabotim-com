'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Star, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Task } from '@/hooks/useTasksAPI'

interface OfferFormData {
  proposedPrice: string
  message: string
  estimatedTime: string
  availability: string
  experience: string
}

export default function SubmitOfferPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.taskId as string
  
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<OfferFormData>({
    proposedPrice: '',
    message: '',
    estimatedTime: '',
    availability: '',
    experience: ''
  })

  // Проверка дали потребителят е влязъл
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      toast.error('Трябва да влезете в акаунта си, за да подадете оферта')
      router.push('/login')
    }
  }, [router])

  // Зареждане на задачата
  useEffect(() => {
    const loadTask = () => {
      try {
        // Търсим в localStorage
        const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        const foundTask = savedTasks.find((t: Task) => t.id.toString() === taskId)
        
        if (foundTask) {
          setTask(foundTask)
        } else {
          toast.error('Задачата не е намерена')
          router.push('/tasks')
        }
        setLoading(false)
      } catch (error) {
        console.error('Грешка при зареждането на задачата:', error)
        toast.error('Възникна грешка при зареждането на задачата')
        router.push('/tasks')
      }
    }

    if (taskId) {
      loadTask()
    }
  }, [taskId, router])

  const handleInputChange = (field: keyof OfferFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Валидация
      if (!formData.proposedPrice || !formData.message || !formData.estimatedTime) {
        toast.error('Моля, попълнете всички задължителни полета')
        return
      }

      if (parseFloat(formData.proposedPrice) < 5) {
        toast.error('Минималната цена е 5 лв')
        return
      }

      if (formData.message.length < 20) {
        toast.error('Съобщението трябва да бъде поне 20 символа')
        return
      }

      // Симулация на подаване на оферта
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Запазване в localStorage
      const offers = JSON.parse(localStorage.getItem('offers') || '[]')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      const newOffer = {
        id: Date.now(),
        taskId: parseInt(taskId),
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userAvatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        ...formData,
        proposedPrice: parseFloat(formData.proposedPrice),
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      offers.push(newOffer)
      localStorage.setItem('offers', JSON.stringify(offers))

      toast.success('Офертата е подадена успешно!')
      
      setTimeout(() => {
        router.push('/tasks')
      }, 1000)

    } catch (error) {
      toast.error('Възникна грешка при подаването на офертата')
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number, priceType: string | undefined) => {
    return priceType === 'hourly' ? `${price} лв/час` : `${price} лв`
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Няма краен срок'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Изтекъл срок'
    if (diffDays === 0) return 'Днес'
    if (diffDays === 1) return 'Утре'
    if (diffDays <= 7) return `След ${diffDays} дни`
    return date.toLocaleDateString('bg-BG')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на задачата...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Задачата не е намерена</h3>
          <p className="text-gray-600 mb-4">Възможно е задачата да е премахната или да не съществува.</p>
          <button
            onClick={() => router.push('/tasks')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Назад към задачите
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Назад
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Подай оферта
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Детайли за задачата</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Бюджет:</span>
                    <span className="text-gray-600">{formatPrice(task.price, task.price_type)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Срок:</span>
                    <span className="text-gray-600">{formatDate(task.deadline)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Локация:</span>
                    <span className="text-gray-600">{task.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Категория:</span>
                    <span className="text-gray-600">{task.category}</span>
                  </div>
                </div>

                {task.urgent && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Спешна задача</span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={task.profiles?.avatar_url || 'https://via.placeholder.com/40'} 
                      alt={task.profiles?.full_name || 'Потребител'} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{task.profiles?.full_name || 'Анонимен'}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{task.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {task.applications} оферти • {task.views} прегледа
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Подай оферта</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Proposed Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Предложена цена *
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={formData.proposedPrice}
                      onChange={(e) => handleInputChange('proposedPrice', e.target.value)}
                      placeholder="0"
                      min="5"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center">
                      {task.price_type === 'hourly' ? 'лв/час' : 'лв'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Оригиналният бюджет е {formatPrice(task.price, task.price_type)}
                  </p>
                </div>

                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Очаквано време за изпълнение *
                  </label>
                  <select
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Изберете време</option>
                    <option value="1-2 часа">1-2 часа</option>
                    <option value="Половина ден">Половина ден</option>
                    <option value="1 ден">1 ден</option>
                    <option value="2-3 дни">2-3 дни</option>
                    <option value="1 седмица">1 седмица</option>
                    <option value="2+ седмици">2+ седмици</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Кога сте налични?
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Изберете наличност</option>
                    <option value="Веднага">Веднага</option>
                    <option value="Днес">Днес</option>
                    <option value="Утре">Утре</option>
                    <option value="Тази седмица">Тази седмица</option>
                    <option value="Следващата седмица">Следващата седмица</option>
                    <option value="По-късно">По-късно</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опит в тази област
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Изберете опит</option>
                    <option value="Начинаещ (0-1 години)">Начинаещ (0-1 години)</option>
                    <option value="Опитен (1-3 години)">Опитен (1-3 години)</option>
                    <option value="Експерт (3-5 години)">Експерт (3-5 години)</option>
                    <option value="Професионалист (5+ години)">Професионалист (5+ години)</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Съобщение към клиента *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Опишете как ще изпълните задачата, какви са вашите предимства и защо сте най-подходящия избор..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 символа
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Подаване...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Подай оферта
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
