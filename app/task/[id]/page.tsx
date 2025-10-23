'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, DollarSign, User, Star, Calendar, 
  MessageSquare, AlertCircle, Heart, Share2, Shield, CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { JobPostingStructuredData } from '@/components/StructuredData'

interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  price_type: 'fixed' | 'hourly'
  urgent: boolean
  deadline: string | null
  created_at: string
  user_id: string
  status: string
  applications_count: number
  views_count: number
  images?: string[]
  profiles?: {
    id: string
    full_name: string
    avatar_url: string | null
    rating: number
    total_reviews: number
    verified: boolean
  }
}

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user: authUser, loading: authLoading } = useAuth()
  
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')

  useEffect(() => {
    if (taskId) {
      loadTask()
      incrementViewCount()
    }
  }, [taskId])

  useEffect(() => {
    if (authUser && taskId) {
      checkIfApplied()
    }
  }, [authUser, taskId])

  const loadTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          profiles:users!user_id(
            id,
            full_name,
            avatar_url,
            rating,
            total_reviews,
            verified
          )
        `)
        .eq('id', taskId)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (!data) {
        toast.error('Задачата не е намерена')
        router.push('/tasks')
        return
      }

      setTask(data)
    } catch (error: any) {
      console.error('Error loading task:', error)
      toast.error('Грешка при зареждането на задачата')
      router.push('/tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_task_views', { task_id: taskId })
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  const checkIfApplied = async () => {
    if (!authUser) return

    try {
      const { data, error } = await supabase
        .from('task_applications')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', authUser.id)
        .single()

      setHasApplied(!!data)
    } catch (error) {
      // No application found is not an error
      setHasApplied(false)
    }
  }

  const handleApply = async () => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си за да кандидатствате')
      router.push('/login')
      return
    }

    if (!applicationMessage.trim()) {
      toast.error('Моля, напишете съобщение за кандидатурата')
      return
    }

    if (task?.user_id === authUser.id) {
      toast.error('Не можете да кандидатствате за собствената си задача')
      return
    }

    setIsApplying(true)
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          user_id: authUser.id,
          message: applicationMessage.trim()
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Грешка при изпращането на кандидатурата')
      }

      setHasApplied(true)
      setApplicationMessage('')
      toast.success('Кандидатурата е изпратена успешно!')
      
      // Reload task to update applications count
      loadTask()
    } catch (error: any) {
      console.error('Error applying:', error)
      toast.error(error.message || 'Грешка при изпращането на кандидатурата')
    } finally {
      setIsApplying(false)
    }
  }

  const handleContact = () => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си за да се свържете')
      router.push('/login')
      return
    }
    
    // Navigate to messages with this user
    router.push(`/messages?userId=${task?.user_id}`)
  }

  const getCategoryLabel = (categoryValue: string) => {
    const categories: Record<string, string> = {
      'repair': 'Ремонт',
      'cleaning': 'Почистване',
      'care': 'Грижа',
      'delivery': 'Доставка',
      'moving': 'Преместване',
      'garden': 'Градинарство',
      'tutoring': 'Обучение',
      'it-services': 'IT услуги',
      'assembly': 'Сглобяване',
      'other': 'Друго',
    }
    return categories[categoryValue] || categoryValue
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'днес'
    if (diffDays === 2) return 'вчера'
    if (diffDays <= 7) return `преди ${diffDays - 1} дни`
    
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'hourly') {
      return `${price} лв/час`
    }
    return `${price} лв`
  }

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане на задачата...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Задачата не е намерена</p>
          <button
            onClick={() => router.push('/tasks')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Връщане към задачите
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Детайли за задачата
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {task.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {task.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(task.created_at)}
                    </span>
                    {task.urgent && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertCircle size={16} />
                        Спешно
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(task.price, task.price_type)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {task.price_type === 'hourly' ? 'на час' : 'общо'}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getCategoryLabel(task.category)}
                </span>
              </div>

              {/* Images */}
              {task.images && task.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Снимки
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {task.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Снимка ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Описание
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                За потребителя
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {task.profiles?.full_name || 'Потребител'}
                    {task.profiles?.verified && (
                      <Shield size={16} className="inline ml-2 text-green-600" />
                    )}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      {task.profiles?.rating?.toFixed(1) || '0.0'} ({task.profiles?.total_reviews || 0} отзива)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleContact}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Свържи се
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Complete Task Button - Show for poster or accepted worker when task is in_progress */}
            {task.status === 'in_progress' && (task.user_id === authUser?.id || hasApplied) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <button
                  onClick={() => router.push(`/task/${taskId}/complete`)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle size={20} />
                  Завърши задачата
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  И двете страни трябва да потвърдят завършването
                </p>
              </div>
            )}

            {/* Apply Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Кандидатствай за тази задача
              </h3>
              
              {task.user_id === authUser?.id ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Това е ваша задача
                  </p>
                </div>
              ) : hasApplied ? (
                <div className="text-center py-4">
                  <div className="text-green-600 mb-2 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Вече сте кандидатствали
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Вашата кандидатура е в изчакване
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Съобщение към потребителя *
                    </label>
                    <textarea
                      value={applicationMessage}
                      onChange={(e) => setApplicationMessage(e.target.value)}
                      placeholder="Напишете защо искате да изпълните тази задача..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      rows={4}
                    />
                  </div>
                  
                  <button
                    onClick={handleApply}
                    disabled={isApplying || !applicationMessage.trim()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isApplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Изпращане...
                      </>
                    ) : (
                      'Кандидатствай'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Task Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Детайли
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Локация:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{task.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Категория:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{getCategoryLabel(task.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Публикувана:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(task.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Прегледи:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{task.views_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Кандидатури:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{task.applications_count || 0}</span>
                </div>
                {task.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Срок:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(task.deadline).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      {task && <JobPostingStructuredData task={task} />}
    </div>
  )
}
