'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'
import AdminStats from '../../components/AdminStats'
import BoostSystem from '../../components/BoostSystem'

interface Stats {
  totalUsers: number
  totalTasks: number
  totalRevenue: number
  activeTasks: number
  pendingApplications: number
  completedTasks: number
}

interface RecentActivity {
  id: string
  type: 'user_registration' | 'task_created' | 'payment_completed' | 'review_posted'
  title: string
  description: string
  timestamp: string
  user: string
}

interface Task {
  id: number
  title: string
  status: 'active' | 'completed' | 'cancelled'
  price: string
  user: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
    loadDashboardData()
  }, [])

  const checkAdminStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loginStatus !== 'true' || !userData) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    // В реалност ще се проверява дали потребителят е админ
    // За демо цели всички потребители са админи
    setIsAdmin(true)
  }

  const loadDashboardData = () => {
    // Симулация на зареждане на данни
    const sampleStats: Stats = {
      totalUsers: 1247,
      totalTasks: 892,
      totalRevenue: 45680,
      activeTasks: 156,
      pendingApplications: 89,
      completedTasks: 736
    }

    const sampleActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'user_registration',
        title: 'Нов потребител',
        description: 'Иван Петров се регистрира',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'Иван Петров'
      },
      {
        id: '2',
        type: 'task_created',
        title: 'Нова задача',
        description: 'Създадена задача "Помощ при преместване"',
        timestamp: '2024-01-15T09:15:00Z',
        user: 'Мария Георгиева'
      },
      {
        id: '3',
        type: 'payment_completed',
        title: 'Плащане',
        description: 'Плащането за задача "Ремонт на водопровод" е завършено',
        timestamp: '2024-01-15T08:45:00Z',
        user: 'Стоян Димитров'
      },
      {
        id: '4',
        type: 'review_posted',
        title: 'Нов отзив',
        description: 'Публикуван 5-звезден отзив',
        timestamp: '2024-01-15T08:20:00Z',
        user: 'Елена Василева'
      }
    ]

    const sampleTasks: Task[] = [
      {
        id: 1,
        title: 'Помощ при преместване',
        status: 'active',
        price: '45',
        user: 'Мария Георгиева',
        createdAt: '2024-01-15T09:15:00Z'
      },
      {
        id: 2,
        title: 'Почистване на апартамент',
        status: 'completed',
        price: '30',
        user: 'Иван Петров',
        createdAt: '2024-01-14T16:30:00Z'
      },
      {
        id: 3,
        title: 'Ремонт на водопровод',
        status: 'active',
        price: '80',
        user: 'Стоян Димитров',
        createdAt: '2024-01-14T14:20:00Z'
      }
    ]

    setStats(sampleStats)
    setRecentActivity(sampleActivity)
    setRecentTasks(sampleTasks)
    setIsLoading(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users size={16} className="text-blue-600" />
      case 'task_created':
        return <Briefcase size={16} className="text-green-600" />
      case 'payment_completed':
        return <DollarSign size={16} className="text-yellow-600" />
      case 'review_posted':
        return <CheckCircle size={16} className="text-purple-600" />
      default:
        return <AlertCircle size={16} className="text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} className="text-blue-600" />
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-600" />
      default:
        return <Clock size={16} className="text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на админ панела...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield size={24} className="text-primary-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Админ панел
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline text-sm flex items-center gap-2">
                <Settings size={16} />
                Настройки
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <AdminStats />

        {/* Boost System */}
        <div className="mb-8">
          <BoostSystem />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Последна активност
                </h2>
                <button className="text-sm text-primary-600 hover:text-primary-500">
                  Виж всички
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {activity.user}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Бърза статистика
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Кандидатури в изчакване</span>
                  <span className="font-semibold text-primary-600">{stats?.pendingApplications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Завършени задачи</span>
                  <span className="font-semibold text-green-600">{stats?.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Среден рейтинг</span>
                  <span className="font-semibold text-yellow-600">4.7</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Последни задачи
              </h3>
              
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {task.user}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {task.price} лв
                      </span>
                      {getStatusIcon(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Аналитика
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">
                  7 дни
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  30 дни
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  90 дни
                </button>
              </div>
            </div>

            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Графиката ще бъде добавена скоро</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 