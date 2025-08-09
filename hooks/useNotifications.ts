import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  type Notification, 
  NotificationPreferences, 
  NotificationStats, 
  PushSubscription,
  NotificationType,
  NotificationPriority,
  NotificationCategory
} from '@/types/notification'

const DEMO_USER_ID = 'current-user'

// Demo data
const demoNotifications: Notification[] = [
  {
    id: '1',
    userId: DEMO_USER_ID,
    type: 'message',
    title: 'Ново съобщение',
    message: 'Иван Петров ви изпрати ново съобщение относно задачата "Ремонт на кухня"',
    isRead: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    priority: 'normal',
    category: 'communication',
    actionUrl: '/messages?user=ivan-petrov',
    actionText: 'Отвори съобщението',
    icon: '💬'
  },
  {
    id: '2',
    userId: DEMO_USER_ID,
    type: 'task_update',
    title: 'Задачата е приета',
    message: 'Вашата задача "Ремонт на кухня" беше приета от Иван Петров',
    isRead: true,
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    priority: 'high',
    category: 'tasks',
    actionUrl: '/task/123',
    actionText: 'Преглед на задачата',
    icon: '✅'
  },
  {
    id: '3',
    userId: DEMO_USER_ID,
    type: 'rating_received',
    title: 'Нов рейтинг',
    message: 'Получихте 5 звезди от Мария Георгиева за работата по "Ремонт на баня"',
    isRead: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    priority: 'normal',
    category: 'achievements',
    actionUrl: '/ratings',
    actionText: 'Преглед на рейтинга',
    icon: '⭐'
  }
]

const demoPreferences: NotificationPreferences = {
  userId: DEMO_USER_ID,
  email: true,
  push: true,
  inApp: true,
  categories: {
    communication: { email: true, push: true, inApp: true },
    tasks: { email: true, push: true, inApp: true },
    payments: { email: true, push: false, inApp: true },
    system: { email: false, push: false, inApp: true },
    security: { email: true, push: true, inApp: true },
    achievements: { email: false, push: true, inApp: true }
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
    timezone: 'Europe/Sofia'
  },
  frequency: 'immediate'
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>(demoPreferences)
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byCategory: {
      communication: 0,
      tasks: 0,
      payments: 0,
      system: 0,
      security: 0,
      achievements: 0
    },
    byPriority: {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0
    },
    recentActivity: {
      last24h: 0,
      last7d: 0,
      last30d: 0
    }
  })
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)

  // Load notifications from localStorage
  const loadNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem('rabotim-notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          readAt: n.readAt ? new Date(n.readAt) : undefined,
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
        })))
      } else {
        setNotifications(demoNotifications)
        localStorage.setItem('rabotim-notifications', JSON.stringify(demoNotifications))
      }
    } catch (err) {
      console.error('Error loading notifications:', err)
      setNotifications(demoNotifications)
    }
  }, [])

  // Load preferences from localStorage
  const loadPreferences = useCallback(() => {
    try {
      const stored = localStorage.getItem('rabotim-notification-preferences')
      if (stored) {
        setPreferences(JSON.parse(stored))
      } else {
        setPreferences(demoPreferences)
        localStorage.setItem('rabotim-notification-preferences', JSON.stringify(demoPreferences))
      }
    } catch (err) {
      console.error('Error loading preferences:', err)
      setPreferences(demoPreferences)
    }
  }, [])

  // Calculate notification stats
  const calculateStats = useCallback((notifs: Notification[]) => {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const stats: NotificationStats = {
      total: notifs.length,
      unread: notifs.filter(n => !n.isRead).length,
      byCategory: {
        communication: notifs.filter(n => n.category === 'communication').length,
        tasks: notifs.filter(n => n.category === 'tasks').length,
        payments: notifs.filter(n => n.category === 'payments').length,
        system: notifs.filter(n => n.category === 'system').length,
        security: notifs.filter(n => n.category === 'security').length,
        achievements: notifs.filter(n => n.category === 'achievements').length
      },
      byPriority: {
        low: notifs.filter(n => n.priority === 'low').length,
        normal: notifs.filter(n => n.priority === 'normal').length,
        high: notifs.filter(n => n.priority === 'high').length,
        urgent: notifs.filter(n => n.priority === 'urgent').length
      },
      recentActivity: {
        last24h: notifs.filter(n => n.createdAt >= last24h).length,
        last7d: notifs.filter(n => n.createdAt >= last7d).length,
        last30d: notifs.filter(n => n.createdAt >= last30d).length
      }
    }
    setStats(stats)
  }, [])

  // Save notifications to localStorage
  const saveNotifications = useCallback((notifs: Notification[]) => {
    try {
      localStorage.setItem('rabotim-notifications', JSON.stringify(notifs))
      calculateStats(notifs)
    } catch (err) {
      console.error('Error saving notifications:', err)
    }
  }, [calculateStats])

  // Save preferences to localStorage
  const savePreferences = useCallback((prefs: NotificationPreferences) => {
    try {
      localStorage.setItem('rabotim-notification-preferences', JSON.stringify(prefs))
    } catch (err) {
      console.error('Error saving preferences:', err)
    }
  }, [])

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      saveNotifications(updated)
      return updated
    })

    // Show browser notification if enabled
    if (preferences.push && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id,
        requireInteraction: newNotification.priority === 'urgent'
      })
    }

    // Play notification sound
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch(console.error)
    }

    return newNotification
  }, [preferences.push, saveNotifications])

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId 
          ? { ...n, isRead: true, readAt: new Date() }
          : n
      )
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId)
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  // Toggle notification pin
  const togglePin = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId 
          ? { ...n, isPinned: !n.isPinned }
          : n
      )
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    savePreferences(updated)
  }, [preferences, savePreferences])

  // Request push notification permission
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setError('Push notifications are not supported in this browser')
      return false
    }

    if (Notification.permission === 'granted') {
      setIsSubscribed(true)
      return true
    }

    if (Notification.permission === 'denied') {
      setError('Push notifications are blocked. Please enable them in your browser settings.')
      return false
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setIsSubscribed(true)
      return true
    } else {
      setError('Push notification permission denied')
      return false
    }
  }, [])

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setError('Push notifications are not supported')
      return false
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      const pushSubscription: PushSubscription = {
        id: Date.now().toString(),
        userId: DEMO_USER_ID,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(Array.from(new Uint8Array(subscription.getKey('p256dh')!)).map(b => String.fromCharCode(b)).join('')),
          auth: btoa(Array.from(new Uint8Array(subscription.getKey('auth')!)).map(b => String.fromCharCode(b)).join(''))
        },
        createdAt: new Date(),
        lastUsed: new Date(),
        isActive: true,
        userAgent: navigator.userAgent,
        platform: 'web'
      }

      setSubscription(pushSubscription)
      setIsSubscribed(true)
      
      // In a real app, you would send this to your server
      console.log('Push subscription created:', pushSubscription)
      
      return true
    } catch (err) {
      console.error('Error subscribing to push notifications:', err)
      setError('Failed to subscribe to push notifications')
      return false
    }
  }, [])

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    if (subscription) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.pushManager.getSubscription().then(sub => sub?.unsubscribe())
        setSubscription(null)
        setIsSubscribed(false)
        return true
      } catch (err) {
        console.error('Error unsubscribing from push notifications:', err)
        setError('Failed to unsubscribe from push notifications')
        return false
      }
    }
    return false
  }, [subscription])

  // Initialize WebSocket connection for real-time updates
  const initializeWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    // In a real app, you would connect to your WebSocket server
    // For demo purposes, we'll simulate real-time updates
    const simulateRealTimeUpdates = () => {
      const types: NotificationType[] = ['message', 'task_update', 'rating_received']
      const randomType = types[Math.floor(Math.random() * types.length)]
      
      const demoNotification = {
        userId: DEMO_USER_ID,
        type: randomType,
        title: 'Демо известие',
        message: 'Това е демо известие за тестване на реално време',
        isRead: false,
        isPinned: false,
        priority: 'normal' as NotificationPriority,
        category: 'system' as NotificationCategory,
        icon: '🔔'
      }

      addNotification(demoNotification)
    }

    // Simulate incoming notifications every 30 seconds
    const interval = setInterval(simulateRealTimeUpdates, 30000)
    
    return () => clearInterval(interval)
  }, [addNotification])

  // Initialize
  useEffect(() => {
    loadNotifications()
    loadPreferences()
    setIsLoading(false)

    // Initialize notification sound
    notificationSoundRef.current = new Audio('/notification.mp3')
    notificationSoundRef.current.volume = 0.5

    // Check push notification permission
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      setIsSubscribed(true)
    }

    // Initialize real-time updates
    const cleanup = initializeWebSocket()

    return () => {
      if (cleanup) cleanup()
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [loadNotifications, loadPreferences, initializeWebSocket])

  return {
    notifications,
    preferences,
    stats,
    isSubscribed,
    subscription,
    isLoading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    togglePin,
    updatePreferences,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  }
}
