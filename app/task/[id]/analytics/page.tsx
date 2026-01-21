'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Eye, 
  MessageCircle, 
  Calendar, 
  TrendingUp,
  Users,
  Clock,
  Target,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface TaskAnalytics {
  id: string
  title: string
  views: number
  applications: number
  created_at: string
  deadline: string | null
  urgent: boolean
  status: string
  category: string
  location: string
  price: number
  price_type: string
}

export default function TaskAnalyticsPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<TaskAnalytics | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadTaskAnalytics()
  }, [user, authLoading, taskId])

  const loadTaskAnalytics = async () => {
    try {
      setLoading(true)
      
      const { data: taskData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

      if (error) throw error
      
      if (!taskData) {
        toast.error('Задачата не е намерена')
        router.push('/my-tasks')
        return
      }

      // Check if user is owner
      if (taskData.user_id !== user?.id) {
        toast.error('Нямате права да видите аналитиката на тази задача')
        router.push(`/task/${taskId}`)
        return
      }

      setTask(taskData)
    } catch (error: any) {
      console.error('Error loading task analytics:', error)
      toast.error('Грешка при зареждане на аналитиката')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Няма срок'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  const getDaysActive = () => {
    if (!task) return 0
    const created = new Date(task.created_at)
    const now = new Date()
    return Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getViewsPerDay = () => {
    if (!task) return 0
    const days = getDaysActive()
    return days > 0 ? (task.views / days).toFixed(1) : task.views
  }

  const getApplicationRate = () => {
    if (!task) return 0
    return task.views > 0 ? ((task.applications / task.views) * 100).toFixed(1) : 0
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане...</p>
        </div>
      </div>
    )
  }

  if (!user || !task) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => router.push(`/task/${taskId}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Назад към задачата
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Аналитика за задача
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{task.title}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Общо прегледи</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{task.views}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getViewsPerDay()} прегледа/ден
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Кандидати</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{task.applications}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getApplicationRate()}% конверсия
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Дни активна</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{getDaysActive()}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                От {formatDate(task.created_at)}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Цена</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {task.price} €
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {task.price_type === 'hourly' ? 'на час' : 'общо'}
              </p>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Детайли за задачата
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Категория
                </label>
                <p className="text-gray-900 dark:text-gray-100">{task.category}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Локация
                </label>
                <p className="text-gray-900 dark:text-gray-100">{task.location}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Статус
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'active' ? 'bg-green-100 text-green-800' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status === 'active' ? 'Активна' :
                   task.status === 'in_progress' ? 'В процес' :
                   task.status === 'completed' ? 'Завършена' : 'Отменена'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Публикувана на
                </label>
                <p className="text-gray-900 dark:text-gray-100">{formatDate(task.created_at)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Краен срок
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {task.deadline ? formatDate(task.deadline) : 'Няма срок'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Спешност
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {task.urgent ? (
                    <span className="flex items-center gap-2 text-red-600">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                      Спешна задача
                    </span>
                  ) : 'Обикновена задача'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Анализ на производителността
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {getViewsPerDay()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Средни прегледи на ден</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {getApplicationRate()}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Процент конверсия</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {getDaysActive()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Дни активна</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



