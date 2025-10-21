'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Zap,
  Star,
  Crown,
  Rocket,
  CheckCircle,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string
  title: string
  is_promoted: boolean
  is_featured: boolean
  is_top: boolean
  promoted_until: string | null
  featured_until: string | null
  top_until: string | null
  boost_count: number
  user_id: string
}

export default function PromoteTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<Task | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadTask()
  }, [user, authLoading, taskId])

  const loadTask = async () => {
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
        toast.error('Нямате права да промотирате тази задача')
        router.push(`/task/${taskId}`)
        return
      }

      setTask(taskData)
    } catch (error: any) {
      console.error('Error loading task:', error)
      toast.error('Грешка при зареждане на задачата')
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (type: 'promoted' | 'featured' | 'top', duration: number) => {
    if (!task) return

    setIsProcessing(true)
    try {
      const now = new Date()
      const expiryDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000)

      const updates: any = {}
      
      if (type === 'promoted') {
        updates.is_promoted = true
        updates.promoted_until = expiryDate.toISOString()
        updates.boost_count = (task.boost_count || 0) + 1
        updates.last_boosted_at = now.toISOString()
      } else if (type === 'featured') {
        updates.is_featured = true
        updates.featured_until = expiryDate.toISOString()
      } else if (type === 'top') {
        updates.is_top = true
        updates.top_until = expiryDate.toISOString()
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)

      if (error) throw error

      toast.success('Задачата е промотирана успешно!')
      router.push(`/task/${taskId}`)
    } catch (error: any) {
      console.error('Error promoting task:', error)
      toast.error('Грешка при промотиране на задачата')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isActive = (expiryDate: string | null) => {
    if (!expiryDate) return false
    return new Date(expiryDate) > new Date()
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Промоция на задача
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{task.title}</p>
        </div>

        {/* Current Status */}
        {(task.is_promoted || task.is_featured || task.is_top) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Активни промоции
            </h2>
            <div className="space-y-2">
              {task.is_promoted && isActive(task.promoted_until) && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Промотирана задача</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    До {formatDate(task.promoted_until)}
                  </span>
                </div>
              )}
              {task.is_featured && isActive(task.featured_until) && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Препоръчана задача</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    До {formatDate(task.featured_until)}
                  </span>
                </div>
              )}
              {task.is_top && isActive(task.top_until) && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Топ задача</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    До {formatDate(task.top_until)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promotion Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard Promotion */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 inline-block mb-4">
                <Rocket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Промоция
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Повишете видимостта на вашата задача
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>2x повече прегледи</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Специален badge</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>По-висока позиция</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handlePromote('promoted', 3)}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">5 лв</span>
                  <span className="text-sm">за 3 дни</span>
                </div>
              </button>
              <button
                onClick={() => handlePromote('promoted', 7)}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">10 лв</span>
                  <span className="text-sm">за 7 дни</span>
                </div>
              </button>
            </div>
          </div>

          {/* Featured */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-purple-500 dark:border-purple-400 p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                ПОПУЛЯРНО
              </span>
            </div>

            <div className="text-center mb-4">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 inline-block mb-4">
                <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Препоръчана
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Появете се в препоръчаните задачи
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>5x повече прегледи</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Препоръчана секция</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Голям badge</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Приоритет в търсенето</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handlePromote('featured', 3)}
                disabled={isProcessing}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">15 лв</span>
                  <span className="text-sm">за 3 дни</span>
                </div>
              </button>
              <button
                onClick={() => handlePromote('featured', 7)}
                disabled={isProcessing}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">25 лв</span>
                  <span className="text-sm">за 7 дни</span>
                </div>
              </button>
            </div>
          </div>

          {/* Top */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-block mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Топ задача
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Максимална видимост и приоритет
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="h-4 w-4" />
                <span>10x повече прегледи</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="h-4 w-4" />
                <span>Топ на първа страница</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="h-4 w-4" />
                <span>Златен badge</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="h-4 w-4" />
                <span>Email промоция</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="h-4 w-4" />
                <span>Социални медии</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handlePromote('top', 3)}
                disabled={isProcessing}
                className="w-full bg-white text-orange-600 py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold">30 лв</span>
                  <span className="text-sm">за 3 дни</span>
                </div>
              </button>
              <button
                onClick={() => handlePromote('top', 7)}
                disabled={isProcessing}
                className="w-full bg-white text-orange-600 py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold">50 лв</span>
                  <span className="text-sm">за 7 дни</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Важна информация
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Промоциите се активират веднага след плащане</li>
            <li>• Можете да промотирате една задача с няколко пакета едновременно</li>
            <li>• След изтичане на периода, задачата автоматично се връща към нормален режим</li>
            <li>• Промоцията НЕ продължава автоматично - трябва да я подновите ръчно</li>
            <li>• Статистиките за промотирани задачи са достъпни в раздел "Аналитика"</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

