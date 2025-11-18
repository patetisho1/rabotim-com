'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import NotificationItem from '@/components/NotificationItem'
import NotificationSettings from '@/components/NotificationSettings'
import { Bell, Settings, Check, Trash2, Filter, Search, BarChart3, Pin } from 'lucide-react'
import { Notification, NotificationCategory, NotificationPriority, NotificationPreferences } from '@/types/notification'
import toast from 'react-hot-toast'

const NotificationsPage: React.FC = () => {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const {
    notifications,
    preferences,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    togglePin,
    deleteNotification,
    createNotification,
    updatePreferences,
    refetchPreferences
  } = useNotifications(authUser?.id || '')
  
  const [preferencesLoading, setPreferencesLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'pinned' | 'settings'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all')
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | 'all'>('all')

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
  }, [authUser, authLoading, router])

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.isRead)
    } else if (activeTab === 'pinned') {
      filtered = filtered.filter(n => false) // No pinned property in our schema
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(n => n.category === selectedCategory)
    }

    // Filter by priority (not available in our schema)
    // if (selectedPriority !== 'all') {
    //   filtered = filtered.filter(n => n.priority === selectedPriority)
    // }

    return filtered
  }, [notifications, activeTab, searchQuery, selectedCategory, selectedPriority])

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const categoryLabels: Record<NotificationCategory, string> = {
    communication: 'Комуникация',
    tasks: 'Задачи',
    payments: 'Плащания',
    system: 'Система',
    security: 'Сигурност',
    achievements: 'Постижения'
  }

  const priorityLabels: Record<NotificationPriority, string> = {
    urgent: 'Спешно',
    high: 'Важно',
    normal: 'Нормално',
    low: 'Ниско'
  }

  const tabs = [
    { id: 'all', label: 'Всички', count: notifications.length, icon: Bell },
    { id: 'unread', label: 'Непрочетени', count: notifications.filter(n => !n.isRead).length, icon: Check },
    { id: 'pinned', label: 'Закачени', count: 0, icon: Pin },
    { id: 'settings', label: 'Настройки', count: null, icon: Settings }
  ]

  const handleUpdatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!preferences) return
    
    setPreferencesLoading(true)
    try {
      await updatePreferences({
        ...preferences,
        ...updates
      })
      toast.success('Настройките са обновени успешно')
    } catch (err) {
      toast.error('Грешка при обновяване на настройките')
    } finally {
      setPreferencesLoading(false)
    }
  }

  const handleSubscribe = async () => {
    try {
      await handleUpdatePreferences({ push: true })
      return true
    } catch {
      return false
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await handleUpdatePreferences({ push: false })
      return true
    } catch {
      return false
    }
  }

  if (activeTab === 'settings') {
    const defaultPreferences: NotificationPreferences = {
      userId: authUser?.id || '',
      email: true,
      push: false,
      inApp: true,
      soundEnabled: true,
      categories: {
        communication: { email: true, push: false, inApp: true },
        tasks: { email: true, push: false, inApp: true },
        payments: { email: true, push: false, inApp: true },
        system: { email: false, push: false, inApp: true },
        security: { email: true, push: true, inApp: true },
        achievements: { email: false, push: false, inApp: true }
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'Europe/Sofia'
      },
      frequency: 'immediate'
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Настройки на известията
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Управлявайте как и кога получавате известия
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <NotificationSettings
              preferences={preferences || defaultPreferences}
              onUpdatePreferences={handleUpdatePreferences}
              isSubscribed={preferences?.push || false}
              onSubscribe={handleSubscribe}
              onUnsubscribe={handleUnsubscribe}
              error={error}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Известия
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Управлявайте всички ваши известия и настройки
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BarChart3 size={16} />
                <span>{notifications.filter(n => !n.isRead).length} непрочетени</span>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings size={16} />
                Настройки
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Общо</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Непрочетени</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.filter(n => !n.isRead).length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Pin className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Закачени</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => n.isPinned).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-purple-600" size={20} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Днес</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.filter(n => new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.count !== null && (
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Търси в известия..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as NotificationCategory | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всички категории</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as NotificationPriority | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всички приоритети</option>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                disabled={notifications.filter(n => !n.isRead).length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check size={16} />
                Маркирай всички като прочетени
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Bell className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Няма известия
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'all' && searchQuery 
                  ? 'Не са намерени известия, отговарящи на търсенето.'
                  : activeTab === 'unread'
                  ? 'Всички известия са прочетени.'
                  : activeTab === 'pinned'
                  ? 'Няма закачени известия.'
                  : 'Все още нямате известия.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onTogglePin={togglePin}
                onDelete={deleteNotification}
                onAction={handleNotificationAction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage 