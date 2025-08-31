'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, User, MessageCircle, Star, TrendingUp, Settings, Filter, Search, Archive, Trash2, MoreVertical, ArrowLeft, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
  icon?: string
  priority: 'low' | 'medium' | 'high'
  category: 'task' | 'payment' | 'offer' | 'system' | 'reminder'
}

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null)
  const [swipeEnd, setSwipeEnd] = useState<{ x: number; y: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed)
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
    }

    // Simulate real-time notifications
    const interval = setInterval(() => {
      addRandomNotification()
    }, 45000) // Every 45 seconds

    return () => clearInterval(interval)
  }, [])

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

  const addRandomNotification = () => {
    const notificationTypes = [
      {
        type: 'success' as const,
        title: 'Нова оферта получена',
        message: 'Получихте нова оферта за задачата "Почистване на апартамент" от 120 лв',
        icon: 'offer',
        priority: 'medium' as const,
        category: 'offer' as const
      },
      {
        type: 'info' as const,
        title: 'Нова задача в района',
        message: 'Нова задача публикувана близо до вас: "Ремонт на врата" - 80 лв',
        icon: 'location',
        priority: 'low' as const,
        category: 'task' as const
      },
      {
        type: 'warning' as const,
        title: 'Напомняне за задача',
        message: 'Задачата "Доставка на пакет" изтича след 2 часа',
        icon: 'clock',
        priority: 'high' as const,
        category: 'reminder' as const
      },
      {
        type: 'success' as const,
        title: 'Плащане получено',
        message: 'Получихте плащане от 150 лв за извършената работа',
        icon: 'payment',
        priority: 'medium' as const,
        category: 'payment' as const
      },
      {
        type: 'info' as const,
        title: 'Нов рейтинг',
        message: 'Получихте 5 звезди за задачата "Почистване на офис"',
        icon: 'star',
        priority: 'low' as const,
        category: 'system' as const
      }
    ]

    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: randomType.type,
      title: randomType.title,
      message: randomType.message,
      timestamp: new Date(),
      read: false,
      icon: randomType.icon,
      priority: randomType.priority,
      category: randomType.category,
      action: {
        label: 'Преглед',
        url: '/notifications'
      }
    }

    addNotification(newNotification)
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, maxNotifications)
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    
    if (!notification.read) {
      setUnreadCount(prev => prev + 1)
    }

    // Show toast notification
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] touch-manipulation"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-right'
    })
  }

  const getNotificationIcon = (notification: Notification) => {
    const iconClass = "w-8 h-8 rounded-full flex items-center justify-center"
    
    switch (notification.icon) {
      case 'offer':
        return (
          <div className={`${iconClass} bg-blue-100 dark:bg-blue-900/20`}>
            <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
        )
      case 'location':
        return (
          <div className={`${iconClass} bg-green-100 dark:bg-green-900/20`}>
            <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
          </div>
        )
      case 'clock':
        return (
          <div className={`${iconClass} bg-yellow-100 dark:bg-yellow-900/20`}>
            <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
          </div>
        )
      case 'payment':
        return (
          <div className={`${iconClass} bg-green-100 dark:bg-green-900/20`}>
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
          </div>
        )
      case 'star':
        return (
          <div className={`${iconClass} bg-purple-100 dark:bg-purple-900/20`}>
            <Star size={16} className="text-purple-600 dark:text-purple-400" />
          </div>
        )
      default:
        return (
          <div className={`${iconClass} bg-gray-100 dark:bg-gray-700`}>
            <Bell size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
        )
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === id)
      return notification && !notification.read ? Math.max(0, prev - 1) : prev
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    localStorage.removeItem('notifications')
  }

  const archiveNotifications = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(0)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Сега'
    if (minutes < 60) return `преди ${minutes} мин`
    if (hours < 24) return `преди ${hours} ч`
    if (days < 7) return `преди ${days} дни`
    return date.toLocaleDateString('bg-BG')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
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
      case 'task':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
      case 'payment':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'offer':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
      case 'system':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      case 'reminder':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read)
    
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
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id)
                        onNotificationClick?.(notification)
                        if (notification.action?.url) {
                          window.location.href = notification.action.url
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
                                  {notification.category}
                                </span>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
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
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.action && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {notification.action.label}
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
                        onClick={markAllAsRead}
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