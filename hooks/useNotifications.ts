import { useState, useEffect } from 'react'
import { Notification as SupabaseNotification } from '@/lib/supabase'
import { Notification } from '@/types/notification'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/notifications?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data: SupabaseNotification[] = await response.json()
      
      // Transform Supabase notifications to our Notification type
      const transformedNotifications: Notification[] = data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type as any,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.read,
        isPinned: notification.isPinned || false,
        createdAt: new Date(notification.created_at),
        priority: 'normal' as any,
        category: 'system' as any
      }))
      
      setNotifications(transformedNotifications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const createNotification = async (notificationData: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      })

      if (!response.ok) {
        throw new Error('Failed to create notification')
      }

      const newNotification = await response.json()
      setNotifications(prev => [newNotification, ...prev])
      return newNotification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      if (unreadNotifications.length === 0) return

      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId])

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
  }
}