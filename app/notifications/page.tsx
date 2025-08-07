'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, MessageSquare, Star, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'message' | 'application' | 'review' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  icon: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    checkLoginStatus()
    loadNotifications()
  }, [])

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loginStatus !== 'true' || !userData) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    setIsLoggedIn(true)
  }

  const loadNotifications = () => {
    // Симулация на зареждане на уведомления
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'Ново съобщение',
        message: 'Иван Петров ви изпрати съобщение относно задачата "Помощ при преместване"',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
        actionUrl: '/messages',
        icon: 'message'
      },
      {
        id: '2',
        type: 'application',
        title: 'Нова кандидатура',
        message: 'Мария Георгиева кандидатства за вашата задача "Почистване на апартамент"',
        timestamp: '2024-01-15T09:15:00Z',
        isRead: false,
        actionUrl: '/profile',
        icon: 'application'
      },
      {
        id: '3',
        type: 'review',
        title: 'Нов отзив',
        message: 'Получихте 5-звезден отзив от Стоян Димитров за задачата "Ремонт на водопровод"',
        timestamp: '2024-01-14T16:45:00Z',
        isRead: true,
        actionUrl: '/review/1',
        icon: 'review'
      },
      {
        id: '4',
        type: 'system',
        title: 'Добре дошли в Rabotim.com!',
        message: 'Вашият акаунт е създаден успешно. Започнете да публикувате задачи или да кандидатствате.',
        timestamp: '2024-01-14T14:20:00Z',
        isRead: true,
        icon: 'system'
      },
      {
        id: '5',
        type: 'message',
        title: 'Съобщение прочетено',
        message: 'Вашето съобщение към Елена Василева беше прочетено',
        timestamp: '2024-01-14T12:30:00Z',
        isRead: true,
        actionUrl: '/messages',
        icon: 'message'
      }
    ]
    setNotifications(sampleNotifications)
    setIsLoading(false)
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    toast.success('Всички уведомления са маркирани като прочетени')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    toast.success('Уведомлението е изтрито')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const getNotificationIcon = (icon: string) => {
    switch (icon) {
      case 'message':
        return <MessageSquare size={20} className="text-blue-600" />
      case 'application':
        return <CheckCircle size={20} className="text-green-600" />
      case 'review':
        return <Star size={20} className="text-yellow-600" />
      case 'system':
        return <Bell size={20} className="text-purple-600" />
      default:
        return <Bell size={20} className="text-gray-600" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)
    const diffInHours = diffInMinutes / 60
    const diffInDays = diffInHours / 24

    if (diffInMinutes < 1) return 'Сега'
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)} мин`
    if (diffInHours < 24) return `${Math.floor(diffInHours)} ч`
    if (diffInDays < 7) return `${Math.floor(diffInDays)} дни`
    return date.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit' })
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead)

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Уведомления
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="btn btn-outline text-sm"
              >
                Маркирай всички като прочетени
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Всички ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Непрочетени ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Зареждане на уведомления...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Няма уведомления
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Все още нямате уведомления' 
                  : 'Всички уведомления са прочетени'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-primary-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.icon)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <span className="inline-flex items-center justify-center w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <AlertCircle size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 