'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield,
  Settings,
  BarChart3,
  Users, 
  Briefcase, 
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import AdminDashboard from '@/components/AdminDashboard'
import UserManagement from '@/components/UserManagement'
import TaskManagement from '@/components/TaskManagement'

type AdminTab = 'dashboard' | 'users' | 'tasks' | 'settings'

export default function AdminPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

  useEffect(() => {
    checkAdminStatus()
  }, [authUser, authLoading])

  const checkAdminStatus = async () => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    try {
      // Проверка дали потребителят е админ
      const response = await fetch('/api/admin/stats')
      
      if (response.status === 403) {
        toast.error('Нямате админ права')
        router.push('/profile')
        return
      }

      if (response.ok) {
        setIsAdmin(true)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      toast.error('Възникна грешка при проверката на админ правата')
      router.push('/profile')
    } finally {
    setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Табло', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'Потребители', icon: Users },
    { id: 'tasks' as AdminTab, label: 'Задачи', icon: Briefcase },
    { id: 'settings' as AdminTab, label: 'Настройки', icon: Settings }
  ]

  if (!isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                <Shield size={24} className="text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Админ панел
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Здравейте, {authUser?.user_metadata?.full_name || authUser?.email}
              </span>
              <button 
                onClick={() => router.push('/profile')}
                className="btn btn-outline text-sm"
              >
                Обратно към профила
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
            </div>
          </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'tasks' && <TaskManagement />}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Настройки</h2>
            <p className="text-gray-600">Настройките ще бъдат добавени скоро...</p>
                </div>
        )}
      </div>
    </div>
  )
} 