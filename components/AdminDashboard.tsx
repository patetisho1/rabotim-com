'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Shield,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminStats {
  totalUsers: number
  totalTasks: number
  totalRevenue: number
  activeTasks: number
  pendingApplications: number
  completedTasks: number
}

interface RecentActivity {
  id: string
  full_name: string
  email: string
  created_at: string
}

interface RecentTask {
  id: string
  title: string
  status: string
  price: number
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) {
        throw new Error('Неуспешно зареждане на данните')
      }

      const data = await response.json()
      setStats(data.stats)
      setRecentActivity(data.recentActivity)
      setRecentTasks(data.recentTasks)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Възникна грешка при зареждането на данните')
    } finally {
      setLoading(false)
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активна'
      case 'completed':
        return 'Завършена'
      case 'cancelled':
        return 'Отказана'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общо потребители</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общо задачи</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTasks || 0}</p>
            </div>
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общи приходи</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalRevenue || 0} €</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активни задачи</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeTasks || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Последна активност</h3>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Няма налична активност</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {activity.full_name || 'Анонимен потребител'}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">{activity.email}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Последни задачи</h3>
            </div>
            <div className="p-6">
              {recentTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Няма налични задачи</p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {task.profiles?.full_name || 'Анонимен'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-sm font-medium text-gray-900">
                          {task.price} €
                        </span>
                        {getStatusIcon(task.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Бърза статистика</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Кандидатури в изчакване</span>
                <span className="font-semibold text-blue-600">{stats?.pendingApplications || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Завършени задачи</span>
                <span className="font-semibold text-green-600">{stats?.completedTasks || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Среден рейтинг</span>
                <span className="font-semibold text-yellow-600">4.7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

