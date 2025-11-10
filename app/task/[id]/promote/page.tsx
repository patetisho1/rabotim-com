'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import TaskPromotion from '@/components/TaskPromotion'

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

  const handlePromotionSuccess = () => {
    toast.success('Задачата е промотирана успешно!')
    router.push(`/task/${taskId}`)
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

        {/* Task Promotion Component */}
        <TaskPromotion
          taskId={taskId}
          currentPromotion={
            task.is_promoted ? 'VIP' : 
            task.is_featured ? 'Featured' : 
            task.is_top ? 'Top' : undefined
          }
          onPromotionSuccess={handlePromotionSuccess}
        />
      </div>
    </div>
  )
}


