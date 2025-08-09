'use client'

import React, { useState, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationToast from './NotificationToast'
import { Notification } from '@/types/notification'

const NotificationManager: React.FC = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }
  const { notifications, addNotification } = useNotifications()
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([])
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null)

  // Check for new notifications and show toast
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      
      // Only show toast for new notifications
      if (latestNotification.id !== lastNotificationId) {
        setLastNotificationId(latestNotification.id)
        
        // Add to toast queue
        setToastNotifications(prev => [latestNotification, ...prev.slice(0, 4)])
      }
    }
  }, [notifications, lastNotificationId])

  const handleToastClose = (notificationId: string) => {
    setToastNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const handleToastAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  // Demo: Add test notification every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const demoNotifications = [
        {
          userId: 'current-user',
          type: 'message' as const,
          title: 'Ново съобщение',
          message: 'Иван Петров ви изпрати ново съобщение относно задачата "Ремонт на кухня"',
          isRead: false,
          isPinned: false,
          priority: 'normal' as const,
          category: 'communication' as const,
          actionUrl: '/messages?user=ivan-petrov',
          actionText: 'Отвори съобщението',
          icon: '💬'
        },
        {
          userId: 'current-user',
          type: 'task_update' as const,
          title: 'Задачата е приета',
          message: 'Вашата задача "Ремонт на кухня" беше приета от Иван Петров',
          isRead: false,
          isPinned: false,
          priority: 'high' as const,
          category: 'tasks' as const,
          actionUrl: '/task/123',
          actionText: 'Преглед на задачата',
          icon: '✅'
        },
        {
          userId: 'current-user',
          type: 'rating_received' as const,
          title: 'Нов рейтинг',
          message: 'Получихте 5 звезди от Мария Георгиева за работата по "Ремонт на баня"',
          isRead: false,
          isPinned: false,
          priority: 'normal' as const,
          category: 'achievements' as const,
          actionUrl: '/ratings',
          actionText: 'Преглед на рейтинга',
          icon: '⭐'
        }
      ]

      const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
      addNotification(randomNotification)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastNotifications.map((notification, index) => (
        <div
          key={`${notification.id}-${index}`}
          style={{ transform: `translateY(${index * 80}px)` }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => handleToastClose(notification.id)}
            onAction={handleToastAction}
            duration={5000}
          />
        </div>
      ))}
    </div>
  )
}

export default NotificationManager 