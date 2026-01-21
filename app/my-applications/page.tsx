'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface Application {
  id: string
  task_id: string
  task_title: string
  task_description: string
  task_location: string
  task_price: number
  task_price_type: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  task_poster_name: string
  task_poster_avatar?: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const statusLabels = {
  pending: 'Чакаща',
  accepted: 'Приета',
  rejected: 'Отхвърлена'
}

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: XCircle
}

export default function MyApplicationsPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadApplications()
  }, [authUser, authLoading])

  useEffect(() => {
    filterApplications()
  }, [applications, selectedStatus, searchQuery])

  const loadApplications = () => {
    try {
      // Load from localStorage (mock data for now)
      const savedApplications = localStorage.getItem('myApplications')
      
      if (savedApplications) {
        const apps = JSON.parse(savedApplications)
        setApplications(apps)
      } else {
        // Mock data
        const mockApplications: Application[] = [
          {
            id: '1',
            task_id: '101',
            task_title: 'Почистване на апартамент',
            task_description: 'Трябва ми човек за генерално почистване на 2-стаен апартамент',
            task_location: 'София, Младост',
            task_price: 80,
            task_price_type: 'fixed',
            message: 'Имам опит в почистването. Мога да започна утре.',
            status: 'pending',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            task_poster_name: 'Мария Иванова',
            task_poster_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
          },
          {
            id: '2',
            task_id: '102',
            task_title: 'Ремонт на кран',
            task_description: 'Течащ кран в кухнята, спешно ми трябва водопроводчик',
            task_location: 'София, Лозенец',
            task_price: 50,
            task_price_type: 'fixed',
            message: 'Водопроводчик съм с 10 години опит.',
            status: 'accepted',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            task_poster_name: 'Иван Петров',
            task_poster_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
          },
          {
            id: '3',
            task_id: '103',
            task_title: 'Градинарство - косене на трева',
            task_description: 'Нужен ми е човек за косене на градина 200 кв.м',
            task_location: 'София, Драгалевци',
            task_price: 100,
            task_price_type: 'fixed',
            message: 'Имам оборудване и опит.',
            status: 'rejected',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            task_poster_name: 'Георги Георгиев',
            task_poster_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
          }
        ]
        
        setApplications(mockApplications)
        localStorage.setItem('myApplications', JSON.stringify(mockApplications))
      }
    } catch (error) {
      console.error('Error loading applications:', error)
      toast.error('Грешка при зареждане на кандидатурите')
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]
    
    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(app => app.status === selectedStatus)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(app => 
        app.task_title.toLowerCase().includes(query) ||
        app.task_description.toLowerCase().includes(query) ||
        app.task_location.toLowerCase().includes(query)
      )
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    setFilteredApplications(filtered)
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

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'hourly') return `${price} €/час`
    return `${price} €`
  }

  const handleViewTask = (taskId: string) => {
    router.push(`/task/${taskId}`)
  }

  const handleContactPoster = (applicationId: string) => {
    toast.success('Ще бъдете пренасочени към съобщенията')
    router.push('/messages')
  }

  const handleWithdrawApplication = (applicationId: string) => {
    if (confirm('Сигурни ли сте, че искате да оттеглите кандидатурата?')) {
      const updatedApplications = applications.filter(app => app.id !== applicationId)
      setApplications(updatedApplications)
      localStorage.setItem('myApplications', JSON.stringify(updatedApplications))
      toast.success('Кандидатурата е оттеглена')
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Моите кандидатури
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {applications.length} общо кандидатури
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/tasks')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search size={16} />
              Търси задачи
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Търси по заглавие, описание, локация..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
              >
                <option value="">Всички статуси</option>
                <option value="pending">Чакащи</option>
                <option value="accepted">Приети</option>
                <option value="rejected">Отхвърлени</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Няма кандидатури
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || selectedStatus 
                ? 'Не са намерени кандидатури с тези филтри'
                : 'Все още не сте кандидатствали за задачи'
              }
            </p>
            <button
              onClick={() => router.push('/tasks')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Search size={16} />
              Разгледай задачи
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const StatusIcon = statusIcons[application.status]
              
              return (
                <div
                  key={application.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {application.task_title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                          <div className="flex items-center gap-1">
                            <StatusIcon size={12} />
                            {statusLabels[application.status]}
                          </div>
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {application.task_description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {application.task_location}
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                          <DollarSign size={14} />
                          {formatPrice(application.task_price, application.task_price_type)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(application.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Message */}
                  {application.message && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Вашето съобщение:</span> {application.message}
                      </p>
                    </div>
                  )}

                  {/* Poster Info & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <img
                        src={application.task_poster_avatar || '/default-avatar.png'}
                        alt={application.task_poster_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {application.task_poster_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewTask(application.task_id)}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Виж
                      </button>
                      {application.status === 'accepted' && (
                        <button
                          onClick={() => handleContactPoster(application.id)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <MessageCircle size={14} />
                          Съобщение
                        </button>
                      )}
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleWithdrawApplication(application.id)}
                          className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Оттегли
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}






