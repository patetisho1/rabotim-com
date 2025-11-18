'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, User, MessageCircle, Star, TrendingUp, Settings, Filter, Search, Archive, Trash2, MoreVertical, ArrowLeft, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '@/types/notification'

interface NotificationManagerProps {
  onNotificationClick?: (notification: Notification) => void
  maxNotifications?: number
  className?: string
}

export default function NotificationManager({ 
  onNotificationClick, 
  maxNotifications = 20,
  className = ''
}: NotificationManagerProps) {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const { notifications, loading, markAsRead, deleteNotification, refetch } = useNotifications(authUser?.id || '')
  
  const [showNotifications, setShowNotifications] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null)
  const [swipeEnd, setSwipeEnd] = useState<{ x: number; y: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Refresh notifications every 30 seconds
  useEffect(() => {
    if (!authUser?.id) return

    const interval = setInterval(() => {
      refetch()
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [authUser?.id, refetch])

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const getNotificationIcon = (notification: Notification) => {
    const iconClass = "w-8 h-8 rounded-full flex items-center justify-center"
    
    // Map notification types/categories to icons
    if (notification.category === 'communication' || notification.type === 'message') {
      return (
        <div className={`${iconClass} bg-blue-100 dark:bg-blue-900/20`}>
          <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
      )
    }
    
    if (notification.category === 'tasks' || notification.type === 'task_update' || notification.type === 'task_assigned' || notification.type === 'task_completed') {
      return (
        <div className={`${iconClass} bg-green-100 dark:bg-green-900/20`}>
          <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
        </div>
      )
    }
    
    if (notification.type === 'reminder') {
      return (
        <div className={`${iconClass} bg-yellow-100 dark:bg-yellow-900/20`}>
          <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
        </div>
      )
    }
    
    if (notification.category === 'payments' || notification.type === 'payment_received') {
      return (
        <div className={`${iconClass} bg-green-100 dark:bg-green-900/20`}>
          <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
        </div>
      )
    }
    
    if (notification.type === 'rating_received' || notification.type === 'achievement') {
      return (
        <div className={`${iconClass} bg-purple-100 dark:bg-purple-900/20`}>
          <Star size={16} className="text-purple-600 dark:text-purple-400" />
        </div>
      )
    }
    
    return (
      <div className={`${iconClass} bg-gray-100 dark:bg-gray-700`}>
        <Bell size={16} className="text-gray-600 dark:text-gray-400" />
      </div>
    )
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
    } catch (error) {
      toast.error('Грешка при маркиране на известието')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: authUser?.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark all as read')
      }

      refetch()
      toast.success('Всички известия са маркирани като прочетени')
    } catch (error) {
      toast.error('Грешка при маркиране на известията')
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id)
      toast.success('Известието е изтрито')
    } catch (error) {
      toast.error('Грешка при изтриване на известието')
    }
  }

  const clearAllNotifications = async () => {
    if (!authUser?.id) return

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      if (unreadNotifications.length > 0) {
        await handleMarkAllAsRead()
      }
      toast.success('Всички известия са премахнати')
    } catch (error) {
      toast.error('Грешка при изчистване на известията')
    }
  }

  const archiveNotifications = async () => {
    await handleMarkAllAsRead()
  }

  const formatTime = (date: Date | string) => {
    const notificationDate = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - notificationDate.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Сега'
    if (minutes < 60) return `преди ${minutes} мин`
    if (hours < 24) return `преди ${hours} ч`
    if (days < 7) return `преди ${days} дни`
    return notificationDate.toLocaleDateString('bg-BG')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'border-l-red-500'
      case 'normal':
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-blue-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasks':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
      case 'payments':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'communication':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
      case 'system':
      case 'achievements':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      case 'security':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead)
    
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleSwipeStart = (e: React.TouchEvent) => {
    setSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleSwipeMove = (e: React.TouchEvent) => {
    if (!swipeStart) return
    setSwipeEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleSwipeEnd = (notificationId: string) => {
    if (!swipeStart || !swipeEnd) return
    
    const deltaX = swipeEnd.x - swipeStart.x
    const deltaY = Math.abs(swipeEnd.y - swipeStart.y)
    
    // Only trigger if horizontal swipe is significant and vertical movement is minimal
    if (Math.abs(deltaX) > 50 && deltaY < 30) {
      if (deltaX > 0) {
        // Swipe right - mark as read
        markAsRead(notificationId)
      } else {
        // Swipe left - delete
        deleteNotification(notificationId)
      }
    }
    
    setSwipeStart(null)
    setSwipeEnd(null)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div 
          ref={panelRef}
          className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:right-0 lg:mt-2 lg:w-96 lg:max-h-[80vh] lg:overflow-hidden"
        >
          {/* Mobile Overlay */}
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowNotifications(false)} />
          
          {/* Panel Content */}
          <div className="lg:relative fixed bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto bg-white dark:bg-gray-800 rounded-t-xl lg:rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] lg:max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Уведомления
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Търси уведомления..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Всички' },
                  { value: 'unread', label: 'Непрочетени' },
                  { value: 'read', label: 'Прочетени' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] lg:max-h-96">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'Няма намерени уведомления' : 'Няма уведомления'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => {
                        handleMarkAsRead(notification.id)
                        onNotificationClick?.(notification)
                        if (notification.actionUrl) {
                          router.push(notification.actionUrl)
                        } else {
                          router.push('/notifications')
                        }
                      }}
                      onTouchStart={handleSwipeStart}
                      onTouchMove={handleSwipeMove}
                      onTouchEnd={() => handleSwipeEnd(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                                  {notification.category === 'tasks' ? 'Задачи' :
                                   notification.category === 'payments' ? 'Плащания' :
                                   notification.category === 'communication' ? 'Комуникация' :
                                   notification.category === 'system' ? 'Система' :
                                   notification.category === 'security' ? 'Сигурност' :
                                   notification.category === 'achievements' ? 'Постижения' :
                                   notification.category}
                                </span>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteNotification(notification.id)
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                            {notification.actionText && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {notification.actionText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
        </div>
      ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {unreadCount} непрочетени
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Маркирай всички
                      </button>
                    )}
                    <button
                      onClick={clearAllNotifications}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      Изчисти всички
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Swipe Hint */}
            <div className="lg:hidden p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                             <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                 <div className="flex items-center gap-1">
                   <ArrowRight size={12} />
                   <span>Маркирай като прочетено</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <ArrowLeft size={12} />
                   <span>Изтрий</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

