'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, DollarSign, User, Star, Calendar, Clock,
  MessageSquare, AlertCircle, Heart, Share2, Shield, CheckCircle,
  Edit, Eye, Trash2, Users
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { bg } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { JobPostingStructuredData } from '@/components/StructuredData'
import SocialShare from '@/components/SocialShare'
import OptimizedImage from '@/components/OptimizedImage'
import { ImageGallerySkeleton, UserAvatarSkeleton } from '@/components/SkeletonLoader'
import DynamicMetaTags from '@/components/DynamicMetaTags'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useRatings } from '@/hooks/useRatings'

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

interface TaskApplication {
  id: string
  task_id: string
  user_id: string
  message: string | null
  proposed_price: number | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  user?: {
    id: string
    full_name: string
    avatar_url: string | null
    rating: number | null
    total_reviews: number | null
  } | null
}

function TaskDetailPageContent() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user: authUser, loading: authLoading } = useAuth()
  
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applications, setApplications] = useState<TaskApplication[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)
  const [applicationActionId, setApplicationActionId] = useState<string | null>(null)
  const [applicationActionStatus, setApplicationActionStatus] = useState<'accepted' | 'rejected' | null>(null)
  const [applicationActionError, setApplicationActionError] = useState<string | null>(null)
  const { reviews: taskReviews, isLoading: reviewsLoading } = useRatings()

  useEffect(() => {
    if (taskId) {
      loadTask()
      loadApplications()
      incrementViewCount()
    }
  }, [taskId])

  useEffect(() => {
    if (authUser && taskId) {
      checkIfApplied()
    }
  }, [authUser, taskId])

  // Get task-specific reviews from API
  const [taskReviewsList, setTaskReviewsList] = useState<any[]>([])
  const [taskReviewsLoading, setTaskReviewsLoading] = useState(false)

  useEffect(() => {
    const loadTaskReviews = async () => {
      if (task?.status === 'completed' && taskId) {
        setTaskReviewsLoading(true)
        try {
          const response = await fetch(`/api/reviews?taskId=${taskId}`)
          if (response.ok) {
            const reviewsData = await response.json()
            setTaskReviewsList(reviewsData || [])
          }
        } catch (error) {
          console.error('Error loading task reviews:', error)
        } finally {
          setTaskReviewsLoading(false)
        }
      }
    }
    loadTaskReviews()
  }, [task?.status, taskId])

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

  const loadApplications = async () => {
    if (!taskId) return

    try {
      setApplicationsLoading(true)
      setApplicationsError(null)

      const response = await fetch(`/api/applications?task_id=${taskId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Грешка при зареждането на кандидатурите')
      }

      setApplications(result as TaskApplication[])
    } catch (error: any) {
      console.error('Error loading applications:', error)
      setApplicationsError(error.message || 'Грешка при зареждането на кандидатурите')
      setApplications([])
    } finally {
      setApplicationsLoading(false)
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
      console.log('Applying for task:', {
        task_id: taskId,
        user_id: authUser.id,
        message_length: applicationMessage.trim().length
      })

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
      console.log('Application response:', {
        status: response.status,
        ok: response.ok,
        result
      })

      if (!response.ok) {
        const errorMessage = result.error || result.message || 'Грешка при изпращането на кандидатурата'
        console.error('Application failed:', {
          status: response.status,
          error: result,
          errorMessage
        })
        throw new Error(errorMessage)
      }

      setHasApplied(true)
      setApplicationMessage('')
      toast.success('Кандидатурата е изпратена успешно!')
      
      // Reload task to update applications count
      loadTask()
      loadApplications()
    } catch (error: any) {
      console.error('Error applying for task:', {
        error,
        message: error?.message,
        stack: error?.stack,
        task_id: taskId,
        user_id: authUser?.id
      })
      
      // Показваме по-детайлна грешка
      const errorMessage = error?.message || error?.toString() || 'Грешка при изпращането на кандидатурата'
      toast.error(errorMessage, {
        duration: 5000
      })
    } finally {
      setIsApplying(false)
    }
  }

  const handleApplicationStatusChange = async (applicationId: string, status: 'accepted' | 'rejected') => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    setApplicationActionId(applicationId)
    setApplicationActionStatus(status)
    setApplicationActionError(null)

    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: applicationId,
          status,
          task_id: taskId,
          requester_id: authUser.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Грешка при обновяване на кандидатурата')
      }

      toast.success(status === 'accepted' ? 'Кандидатът е одобрен' : 'Кандидатът е отхвърлен')

      await loadApplications()
      await loadTask()
    } catch (error: any) {
      console.error('Error updating application status:', error)
      const errorMessage = error.message || 'Грешка при обновяване на кандидатурата'
      setApplicationActionError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setApplicationActionId(null)
      setApplicationActionStatus(null)
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

  const handleContactApplicant = (userId: string) => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си за да се свържете')
      router.push('/login')
      return
    }
    router.push(`/messages?userId=${userId}`)
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

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: bg
      }).replace('около ', 'приблизително ')
    } catch (error) {
      console.error('Error formatting date:', error)
      return new Date(dateString).toLocaleString('bg-BG')
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'R'
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
    return initials || 'R'
  }

  const isTaskOwner = task?.user_id === authUser?.id
  
  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (authUser && task?.id) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.includes(task.id))
    }
  }, [authUser, task?.id])

  const handleToggleFavorite = () => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си за да добавите в любими')
      router.push('/login')
      return
    }

    if (!task?.id) return

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    let newFavorites: string[]

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== task.id)
      toast.success('Премахната от любими')
    } else {
      newFavorites = [...favorites, task.id]
      toast.success('Добавена в любими')
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleDeleteTask = async () => {
    if (!task || !isTaskOwner) return

    const confirmed = window.confirm('Сигурни ли сте, че искате да изтриете тази задача? Това действие не може да бъде отменено.')

    if (!confirmed) return

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Грешка при изтриване на задачата')
      }

      toast.success('Задачата е изтрита успешно')
      router.push('/my-tasks')
    } catch (error: any) {
      console.error('Error deleting task:', error)
      toast.error(error.message || 'Грешка при изтриване на задачата')
    }
  }

  const renderTaskStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
      'active': {
        label: 'Активна',
        color: 'text-green-700 dark:text-green-300',
        bgColor: 'bg-green-100 dark:bg-green-900/30'
      },
      'pending': {
        label: 'В очакване на одобрение',
        color: 'text-orange-700 dark:text-orange-300',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30'
      },
      'in_progress': {
        label: 'В процес',
        color: 'text-blue-700 dark:text-blue-300',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30'
      },
      'completed': {
        label: 'Завършена',
        color: 'text-gray-700 dark:text-gray-300',
        bgColor: 'bg-gray-100 dark:bg-gray-800'
      },
      'cancelled': {
        label: 'Отменена',
        color: 'text-red-700 dark:text-red-300',
        bgColor: 'bg-red-100 dark:bg-red-900/30'
      }
    }

    const config = statusConfig[status] || {
      label: status,
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-800'
    }

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}>
        <Clock size={12} />
        {config.label}
      </span>
    )
  }

  const acceptedApplications = useMemo(
    () => applications.filter((application) => application.status === 'accepted'),
    [applications]
  )

  const pendingApplications = useMemo(
    () => applications.filter((application) => application.status === 'pending'),
    [applications]
  )

  const rejectedApplications = useMemo(
    () => applications.filter((application) => application.status === 'rejected'),
    [applications]
  )

  const renderStatusBadge = (status: TaskApplication['status']) => {
    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          <CheckCircle size={12} />
          Назначен изпълнител
        </span>
      )
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-200">
          <AlertCircle size={12} />
          Отхвърлена кандидатура
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
        <Clock size={12} />
        Очаква одобрение
      </span>
    )
  }

  const renderApplicationCard = (application: TaskApplication) => {
    const applicant = application.user
    const isAccepted = application.status === 'accepted'
    const isRejected = application.status === 'rejected'
    const isOwnApplication = application.user_id === authUser?.id
    const canModerate = isTaskOwner && application.status === 'pending'
    const acceptLoading =
      applicationActionId === application.id && applicationActionStatus === 'accepted'
    const rejectLoading =
      applicationActionId === application.id && applicationActionStatus === 'rejected'
    const proposedPriceLabel =
      application.proposed_price !== null && application.proposed_price !== undefined
        ? `${Number(application.proposed_price).toFixed(2)} лв`
        : null

    const cardClasses = [
      'rounded-2xl border p-4 sm:p-5 transition-shadow',
      'bg-white dark:bg-gray-800',
      isAccepted
        ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-900/10'
        : isRejected
          ? 'border-gray-200 dark:border-gray-700'
          : 'border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-900/10'
    ].join(' ')

    return (
      <div key={application.id} className={cardClasses}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${isAccepted ? 'bg-emerald-500' : 'bg-blue-500'} text-white font-semibold overflow-hidden`}>
              {applicant?.avatar_url ? (
                <OptimizedImage
                  src={applicant.avatar_url}
                  alt={applicant.full_name || 'Потребител'}
                  fill
                  className="rounded-full"
                  sizes="48px"
                  objectFit="cover"
                />
              ) : (
                getInitials(applicant?.full_name)
              )}
              {isOwnApplication && !isTaskOwner && (
                <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 shadow">
                  Вие
                </span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {applicant?.full_name || 'Потребител'}
                </h4>
                {renderStatusBadge(application.status)}
              </div>
              <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                {applicant?.rating !== null && applicant?.rating !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    {applicant.rating.toFixed(1)} ({applicant.total_reviews || 0} отзива)
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} />
                  Кандидатствал {formatRelativeTime(application.created_at)}
                </span>
              </div>
              {application.message && (
                <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                  {application.message}
                </p>
              )}
              {proposedPriceLabel && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-gray-900/40 dark:text-blue-200">
                  <DollarSign size={12} />
                  Предложение: {proposedPriceLabel}
                </div>
              )}
            </div>
          </div>
          {isTaskOwner && isAccepted && (
            <button
              onClick={() => handleContactApplicant(application.user_id)}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
            >
              <MessageSquare size={14} />
              Свържи се с изпълнителя
            </button>
          )}
        </div>

        {canModerate && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => handleApplicationStatusChange(application.id, 'accepted')}
              disabled={acceptLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {acceptLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Одобряване...
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Одобри кандидат
                </>
              )}
            </button>
            <button
              onClick={() => handleApplicationStatusChange(application.id, 'rejected')}
              disabled={rejectLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {rejectLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                  Отхвърляне...
                </>
              ) : (
                <>
                  <AlertCircle size={14} />
                  Отхвърли
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
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

  // Generate SEO metadata
  const seoTitle = task ? `${task.title} - ${task.location} | Rabotim.com` : 'Задача | Rabotim.com'
  const seoDescription = task ? `${task.description.substring(0, 160)}... Намери работа в ${task.location} с Rabotim.com` : 'Намери работа и изпълнители в България с Rabotim.com'
  const seoImage = task?.images && task.images.length > 0 ? task.images[0] : '/og-image.png'
  const seoUrl = typeof window !== 'undefined' ? `${window.location.origin}/task/${taskId}` : `https://rabotim.com/task/${taskId}`
  const seoKeywords = task ? [task.category, task.location, 'работа', 'изпълнители', 'услуги', 'rabotim'] : ['работа', 'изпълнители', 'услуги', 'rabotim']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dynamic Meta Tags for SEO */}
      {task && (
        <DynamicMetaTags
          title={seoTitle}
          description={seoDescription}
          image={seoImage}
          url={seoUrl}
          type="article"
          keywords={seoKeywords}
        />
      )}
      
      {/* Structured Data for SEO */}
      {task && (
        <JobPostingStructuredData task={task} />
      )}
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Назад"
              title="Назад"
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
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(task.price, task.price_type)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {task.price_type === 'hourly' ? 'на час' : 'общо'}
                  </div>
                </div>
              </div>

              {/* Share Button - Prominent Position */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{task.views_count || 0}</span> прегледа • 
                    <span className="font-medium ml-1">{task.applications_count || 0}</span> кандидатури
                  </div>
                  {renderTaskStatusBadge(task.status)}
                </div>
                <div className="flex items-center gap-2">
                  {authUser && (
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-lg transition-colors ${
                        isFavorite
                          ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      title={isFavorite ? 'Премахни от любими' : 'Добави в любими'}
                    >
                      <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                  )}
                  <SocialShare
                    url={`${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/task/${task.id}`}
                    title={task.title}
                    description={task.description.substring(0, 160)}
                    hashtags={[task.category, task.location, 'работа', 'rabotim']}
                    variant="compact"
                    className="flex-shrink-0"
                  />
                </div>
              </div>

              {/* Owner Actions */}
              {isTaskOwner && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {(task.status === 'active' || task.status === 'pending') && (
                    <>
                      <button
                        onClick={() => router.push(`/task/${taskId}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Edit size={16} />
                        Редактирай
                      </button>
                      {task.applications_count === 0 && (
                        <button
                          onClick={handleDeleteTask}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Изтрий
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => router.push(`/task/${taskId}/applicants`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <Users size={16} />
                    Виж кандидатури ({task.applications_count || 0})
                  </button>
                </div>
              )}

              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-200">
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
                      <div key={index} className="relative group h-48 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                        <OptimizedImage
                          src={image}
                          alt={`${task.title} - Снимка ${index + 1}`}
                          fill
                          className="group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index === 0}
                          objectFit="cover"
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

            {/* Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Кандидатури
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {applicationsLoading
                      ? 'Зареждаме кандидатурите...'
                      : applications.length === 0
                        ? 'Все още няма кандидатури за тази задача.'
                        : `${applications.length} ${applications.length === 1 ? 'кандидат' : 'кандидати'}`}
                  </p>
                </div>
                {!applicationsLoading && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium dark:bg-blue-900/40 dark:text-blue-200">
                    <MessageSquare size={16} />
                    {task.applications_count || applications.length} отговора
                  </span>
                )}
              </div>

              {applicationsError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                  {applicationsError}
                </div>
              )}

              {applicationActionError && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200">
                  {applicationActionError}
                </div>
              )}

              {applicationsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </div>
                      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Няма кандидатури все още
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Бъдете първи, който ще кандидатства, за да увеличите шанса си да получите задачата.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {isTaskOwner && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200">
                      След одобрение кандидатът автоматично получава достъп до чата, останалите се поместват в история. Можете да променяте решението си по всяко време.
                    </div>
                  )}

                  {acceptedApplications.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-emerald-800 dark:text-emerald-200">
                          Назначени изпълнители
                        </h4>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                          {acceptedApplications.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {acceptedApplications.map((application) => renderApplicationCard(application))}
                      </div>
                    </section>
                  )}

                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        Кандидатури в изчакване
                      </h4>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                        {pendingApplications.length}
                      </span>
                    </div>
                    {pendingApplications.length > 0 ? (
                      <div className="space-y-3">
                        {pendingApplications.map((application) => renderApplicationCard(application))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        Няма кандидатури, които очакват вашето решение.
                      </div>
                    )}
                  </section>

                  {rejectedApplications.length > 0 && (
                    <section>
                      <details className="group rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
                        <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                          История на отхвърлените кандидати
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            {rejectedApplications.length}
                          </span>
                        </summary>
                        <div className="mt-4 space-y-3">
                          {rejectedApplications.map((application) => renderApplicationCard(application))}
                        </div>
                      </details>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                За потребителя
              </h3>
              <div className="flex items-center gap-4">
                {task.profiles?.avatar_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={task.profiles.avatar_url}
                      alt={task.profiles.full_name || 'Потребител'}
                      fill
                      className="rounded-full"
                      sizes="48px"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                )}
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

        {/* Task Reviews Section - Show when task is completed */}
        {task?.status === 'completed' && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Отзиви за задачата
              </h3>
              {task?.profiles?.id && (
                <button
                  onClick={() => router.push(`/user/${task.profiles?.id}?tab=reviews`)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  Виж всички отзиви
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {taskReviewsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Зареждане на отзиви...</p>
              </div>
            ) : taskReviewsList.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 dark:text-gray-400">
                  Все още няма отзиви за тази задача.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Отзивите се появяват след като задачата е завършена и участниците оставят оценки.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {taskReviewsList.slice(0, 5).map((review: any) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          <OptimizedImage
                            src={review.reviewer?.avatar_url || '/default-avatar.png'}
                            alt={review.reviewer?.full_name || 'Потребител'}
                            width={40}
                            height={40}
                            className="rounded-full"
                            sizes="40px"
                            objectFit="cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {review.reviewer?.full_name || 'Анонимен потребител'}
                            </h4>
                            {review.is_verified && (
                              <CheckCircle size={14} className="text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: bg })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>

                    {review.title && (
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {review.title}
                      </h5>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {review.comment}
                    </p>

                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {taskReviewsList.length > 5 && task?.profiles?.id && (
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => router.push(`/user/${task.profiles?.id}?tab=reviews`)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Виж всички {taskReviewsList.length} отзива
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Structured Data */}
      {task && <JobPostingStructuredData task={task} />}
    </div>
  )
}

export default function TaskDetailPage() {
  return (
    <ErrorBoundary>
      <TaskDetailPageContent />
    </ErrorBoundary>
  )
}
