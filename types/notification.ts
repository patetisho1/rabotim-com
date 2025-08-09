export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  isPinned: boolean
  createdAt: Date
  readAt?: Date
  expiresAt?: Date
  priority: NotificationPriority
  category: NotificationCategory
  actionUrl?: string
  actionText?: string
  icon?: string
  badge?: number
}

export type NotificationType = 
  | 'message'
  | 'task_update'
  | 'task_assigned'
  | 'task_completed'
  | 'rating_received'
  | 'payment_received'
  | 'system_alert'
  | 'reminder'
  | 'achievement'
  | 'security_alert'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export type NotificationCategory = 
  | 'communication'
  | 'tasks'
  | 'payments'
  | 'system'
  | 'security'
  | 'achievements'

export interface NotificationPreferences {
  userId: string
  email: boolean
  push: boolean
  inApp: boolean
  categories: {
    [key in NotificationCategory]: {
      email: boolean
      push: boolean
      inApp: boolean
    }
  }
  quietHours: {
    enabled: boolean
    start: string // HH:mm format
    end: string // HH:mm format
    timezone: string
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
}

export interface NotificationTemplate {
  id: string
  type: NotificationType
  title: string
  message: string
  variables: string[]
  defaultPriority: NotificationPriority
  defaultCategory: NotificationCategory
  isActive: boolean
}

export interface NotificationStats {
  total: number
  unread: number
  byCategory: Record<NotificationCategory, number>
  byPriority: Record<NotificationPriority, number>
  recentActivity: {
    last24h: number
    last7d: number
    last30d: number
  }
}

export interface PushSubscription {
  id: string
  userId: string
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  createdAt: Date
  lastUsed: Date
  isActive: boolean
  userAgent: string
  platform: 'web' | 'android' | 'ios'
}
