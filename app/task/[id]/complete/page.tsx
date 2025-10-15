'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string
  title: string
  description: string
  status: string
  user_id: string
  completion_confirmed_by_poster: boolean
  completion_confirmed_by_worker: boolean
}

interface AcceptedApplicant {
  id: string
  user_id: string
  user: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export default function CompleteTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user: authUser, loading: authLoading } = useAuth()
  
  const [task, setTask] = useState<Task | null>(null)
  const [acceptedApplicants, setAcceptedApplicants] = useState<AcceptedApplicant[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userRole, setUserRole] = useState<'poster' | 'worker' | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadTaskData()
  }, [authUser, authLoading, taskId])

  const loadTaskData = async () => {
    try {
      setLoading(true)
      
      // Load task with completion status
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('id, title, description, status, user_id, completion_confirmed_by_poster, completion_confirmed_by_worker')
        .eq('id', taskId)
        .single()

      if (taskError) throw taskError
      
      if (!taskData) {
        toast.error('Задачата не е намерена')
        router.push('/tasks')
        return
      }

      // Check if task is in progress
      if (taskData.status !== 'in_progress') {
        toast.error('Задачата трябва да е в процес за да може да се завърши')
        router.push(`/task/${taskId}`)
        return
      }

      setTask(taskData)

      // Determine user role
      if (taskData.user_id === authUser?.id) {
        setUserRole('poster')
      } else {
        // Check if user is accepted applicant
        const { data: applicantData } = await supabase
          .from('task_applications')
          .select('id')
          .eq('task_id', taskId)
          .eq('user_id', authUser?.id)
          .eq('status', 'accepted')
          .single()

        if (applicantData) {
          setUserRole('worker')
        } else {
          toast.error('Нямате достъп до тази страница')
          router.push(`/task/${taskId}`)
          return
        }
      }

      // Load accepted applicants (for poster view)
      if (taskData.user_id === authUser?.id) {
        const { data: applicantsData, error: applicantsError } = await supabase
          .from('task_applications')
          .select(`
            id,
            user_id,
            users:user_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('task_id', taskId)
          .eq('status', 'accepted')

        if (applicantsError) throw applicantsError

        const formatted = (applicantsData || []).map((app: any) => ({
          id: app.id,
          user_id: app.user_id,
          user: {
            id: app.users.id,
            full_name: app.users.full_name,
            avatar_url: app.users.avatar_url
          }
        }))

        setAcceptedApplicants(formatted)
      }
    } catch (error: any) {
      console.error('Error loading data:', error)
      toast.error('Грешка при зареждане на данните')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCompletion = async () => {
    if (!task || !userRole) return

    setIsSubmitting(true)
    
    try {
      const updateField = userRole === 'poster' 
        ? 'completion_confirmed_by_poster' 
        : 'completion_confirmed_by_worker'
      
      const timestampField = userRole === 'poster'
        ? 'completion_confirmed_by_poster_at'
        : 'completion_confirmed_by_worker_at'

      // Update confirmation status with timestamp
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          [updateField]: true,
          [timestampField]: new Date().toISOString()
        })
        .eq('id', taskId)

      if (updateError) throw updateError

      // Check if both parties confirmed
      const otherPartyConfirmed = userRole === 'poster'
        ? task.completion_confirmed_by_worker
        : task.completion_confirmed_by_poster

      if (otherPartyConfirmed) {
        // Both confirmed - mark task as completed
        const { error: completeError } = await supabase
          .from('tasks')
          .update({ status: 'completed' })
          .eq('id', taskId)

        if (completeError) throw completeError

        toast.success('Задачата е завършена успешно! Сега можете да оставите отзив.')
        
        // Redirect to rating page
        router.push(`/task/${taskId}/rate`)
      } else {
        toast.success('Вашето потвърждение е записано. Чакаме потвърждение от другата страна.')
        toast.info('Ако другата страна не потвърди до 7 дни, автоматично ще можете да оставите отзив.')
        router.push(`/task/${taskId}`)
      }
    } catch (error: any) {
      console.error('Error confirming completion:', error)
      toast.error('Грешка при потвърждаване на завършването')
    } finally {
      setIsSubmitting(false)
    }
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

  if (!task || !userRole) {
    return null
  }

  const hasUserConfirmed = userRole === 'poster' 
    ? task.completion_confirmed_by_poster 
    : task.completion_confirmed_by_worker

  const hasOtherPartyConfirmed = userRole === 'poster'
    ? task.completion_confirmed_by_worker
    : task.completion_confirmed_by_poster

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => router.push(`/task/${taskId}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Назад към задачата
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Завършване на задача
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {task.title}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-4 mb-8">
            {/* Current User Status */}
            <div className={`p-4 rounded-lg border-2 ${
              hasUserConfirmed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3">
                {hasUserConfirmed ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock className="h-6 w-6 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {userRole === 'poster' ? 'Вие (Работодател)' : 'Вие (Изпълнител)'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasUserConfirmed ? 'Потвърдихте завършването' : 'Чака потвърждение'}
                  </p>
                </div>
              </div>
            </div>

            {/* Other Party Status */}
            <div className={`p-4 rounded-lg border-2 ${
              hasOtherPartyConfirmed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3">
                {hasOtherPartyConfirmed ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock className="h-6 w-6 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {userRole === 'poster' ? 'Изпълнител' : 'Работодател'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasOtherPartyConfirmed ? 'Потвърди завършването' : 'Чака потвърждение'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workers List (for poster) */}
          {userRole === 'poster' && acceptedApplicants.length > 0 && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                Приети изпълнители:
              </h3>
              <div className="space-y-2">
                {acceptedApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center gap-2">
                    <img
                      src={applicant.user.avatar_url || '/default-avatar.png'}
                      alt={applicant.user.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {applicant.user.full_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Как работи завършването:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>И двете страни трябва да потвърдят, че работата е завършена</li>
                  <li>След двустранно потвърждение, задачата става "Завършена"</li>
                  <li>След това можете да оставите отзиви един за друг</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!hasUserConfirmed ? (
            <button
              onClick={handleConfirmCompletion}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
            >
              <CheckCircle size={20} />
              {isSubmitting ? 'Потвърждаване...' : 'Потвърди завършването'}
            </button>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
                <CheckCircle size={20} />
                <span className="font-medium">Вие вече потвърдихте завършването</span>
              </div>
              {!hasOtherPartyConfirmed && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Чакаме потвърждение от другата страна...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Имате проблем? <button className="text-blue-600 dark:text-blue-400 hover:underline">Свържете се с поддръжка</button></p>
        </div>
      </div>
    </div>
  )
}

