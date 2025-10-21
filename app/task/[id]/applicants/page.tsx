'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  User,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  Eye,
  Clock,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Applicant {
  id: string
  user_id: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  user: {
    id: string
    full_name: string
    avatar_url?: string
    rating?: number
    total_reviews?: number
    verified?: boolean
  }
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  posted_by: string
}

export default function TaskApplicantsPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user: authUser, loading: authLoading } = useAuth()
  
  const [task, setTask] = useState<Task | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadTaskAndApplicants()
  }, [authUser, authLoading, taskId])

  const loadTaskAndApplicants = async () => {
    try {
      setLoading(true)
      
      // Load task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('id, title, description, status, user_id')
        .eq('id', taskId)
        .single()

      if (taskError) throw taskError
      
      if (!taskData) {
        toast.error('Задачата не е намерена')
        router.push('/my-tasks')
        return
      }

      // Check if user is task owner
      if (taskData.user_id !== authUser?.id) {
        toast.error('Нямате достъп до тази страница')
        router.push(`/task/${taskId}`)
        return
      }

      setTask({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        posted_by: taskData.user_id
      })

      // Load applicants
      const { data: applicantsData, error: applicantsError } = await supabase
        .from('task_applications')
        .select(`
          id,
          user_id,
          message,
          status,
          created_at,
          users:user_id (
            id,
            full_name,
            avatar_url,
            rating,
            total_reviews,
            verified
          )
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })

      if (applicantsError) throw applicantsError

      const formattedApplicants = (applicantsData || []).map((app: any) => ({
        id: app.id,
        user_id: app.user_id,
        message: app.message || '',
        status: app.status,
        created_at: app.created_at,
        user: {
          id: app.users.id,
          full_name: app.users.full_name,
          avatar_url: app.users.avatar_url,
          rating: app.users.rating,
          total_reviews: app.users.total_reviews,
          verified: app.users.verified
        }
      }))

      setApplicants(formattedApplicants)
    } catch (error: any) {
      console.error('Error loading data:', error)
      toast.error('Грешка при зареждане на данните')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptApplicant = async (applicantId: string, userId: string) => {
    if (!confirm('Сигурни ли сте, че искате да приемете този кандидат?')) {
      return
    }

    setProcessingId(applicantId)
    
    try {
      // Update application status to accepted
      const { error: updateError } = await supabase
        .from('task_applications')
        .update({ status: 'accepted' })
        .eq('id', applicantId)

      if (updateError) throw updateError

      // Update task status to in_progress if not already
      if (task?.status === 'active') {
        const { error: taskError } = await supabase
          .from('tasks')
          .update({ status: 'in_progress' })
          .eq('id', taskId)

        if (taskError) throw taskError
      }

      toast.success('Кандидатът е приет успешно!')
      
      // Reload data
      await loadTaskAndApplicants()
    } catch (error: any) {
      console.error('Error accepting applicant:', error)
      toast.error('Грешка при приемане на кандидата')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectApplicant = async (applicantId: string) => {
    if (!confirm('Сигурни ли сте, че искате да отхвърлите този кандидат?')) {
      return
    }

    setProcessingId(applicantId)
    
    try {
      const { error } = await supabase
        .from('task_applications')
        .update({ status: 'rejected' })
        .eq('id', applicantId)

      if (error) throw error

      toast.success('Кандидатът е отхвърлен')
      
      // Reload data
      await loadTaskAndApplicants()
    } catch (error: any) {
      console.error('Error rejecting applicant:', error)
      toast.error('Грешка при отхвърляне на кандидата')
    } finally {
      setProcessingId(null)
    }
  }

  const handleContactApplicant = (userId: string) => {
    router.push(`/messages?user=${userId}`)
  }

  const handleViewProfile = (userId: string) => {
    router.push(`/user/${userId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `Преди ${diffMins} минути`
    if (diffHours < 24) return `Преди ${diffHours} часа`
    if (diffDays < 7) return `Преди ${diffDays} дни`
    
    return date.toLocaleDateString('bg-BG')
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

  if (!task) {
    return null
  }

  const pendingApplicants = applicants.filter(a => a.status === 'pending')
  const acceptedApplicants = applicants.filter(a => a.status === 'accepted')
  const rejectedApplicants = applicants.filter(a => a.status === 'rejected')

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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Кандидати за задача
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {task.title}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
              {applicants.length} {applicants.length === 1 ? 'кандидат' : 'кандидати'}
            </span>
            {task.status === 'in_progress' && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                В процес
              </span>
            )}
          </div>
        </div>

        {/* Pending Applicants */}
        {pendingApplicants.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Чакащи кандидати ({pendingApplicants.length})
            </h2>
            <div className="space-y-4">
              {pendingApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={applicant.user.avatar_url || '/default-avatar.png'}
                      alt={applicant.user.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {applicant.user.full_name}
                            </h3>
                            {applicant.user.verified && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          {applicant.user.rating && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{applicant.user.rating.toFixed(1)}</span>
                              <span>({applicant.user.total_reviews || 0} отзива)</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(applicant.created_at)}
                        </span>
                      </div>

                      {/* Message */}
                      {applicant.message && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {applicant.message}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptApplicant(applicant.id, applicant.user_id)}
                          disabled={processingId === applicant.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Приеми
                        </button>
                        <button
                          onClick={() => handleRejectApplicant(applicant.id)}
                          disabled={processingId === applicant.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Отхвърли
                        </button>
                        <button
                          onClick={() => handleViewProfile(applicant.user_id)}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Профил
                        </button>
                        <button
                          onClick={() => handleContactApplicant(applicant.user_id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <MessageCircle size={16} />
                          Съобщение
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Applicants */}
        {acceptedApplicants.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Приети кандидати ({acceptedApplicants.length})
            </h2>
            <div className="space-y-4">
              {acceptedApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={applicant.user.avatar_url || '/default-avatar.png'}
                      alt={applicant.user.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {applicant.user.full_name}
                        </h3>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Приет на {formatDate(applicant.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleContactApplicant(applicant.user_id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Съобщение
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Applicants */}
        {rejectedApplicants.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Отхвърлени кандидати ({rejectedApplicants.length})
            </h2>
            <div className="space-y-4">
              {rejectedApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 opacity-60"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={applicant.user.avatar_url || '/default-avatar.png'}
                      alt={applicant.user.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {applicant.user.full_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Отхвърлен
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {applicants.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Все още няма кандидати
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Когато някой кандидатства за вашата задача, ще го видите тук
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

