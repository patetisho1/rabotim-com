'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, X, Check } from 'lucide-react'
import { requestNotificationPermission, saveFCMToken, onForegroundMessage } from '@/lib/firebase'
import { haptics } from '@/lib/haptics'
import toast from 'react-hot-toast'

interface PushNotificationPromptProps {
  userId?: string
  showPrompt?: boolean
  onPermissionChange?: (granted: boolean) => void
}

export default function PushNotificationPrompt({
  userId,
  showPrompt = true,
  onPermissionChange
}: PushNotificationPromptProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [isLoading, setIsLoading] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported')
      return
    }

    setPermission(Notification.permission)

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pushPromptDismissed')
    if (dismissed) {
      setIsDismissed(true)
    }

    // Show banner after a delay if permission is default
    if (Notification.permission === 'default' && !dismissed && showPrompt) {
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }

    // Set up foreground message listener if granted
    if (Notification.permission === 'granted') {
      onForegroundMessage((payload) => {
        // Show toast for foreground notifications
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Bell className="h-10 w-10 text-blue-600" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payload.notification?.title || 'Известие'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {payload.notification?.body}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Затвори
              </button>
            </div>
          </div>
        ), { duration: 5000 })
      })
    }
  }, [showPrompt])

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    haptics.medium()

    try {
      const token = await requestNotificationPermission()
      
      if (token) {
        setPermission('granted')
        onPermissionChange?.(true)
        
        // Save token if userId is provided
        if (userId) {
          await saveFCMToken(userId, token)
        }

        toast.success('Известията са включени!')
        haptics.success()
        setShowBanner(false)
      } else {
        setPermission(Notification.permission)
        onPermissionChange?.(false)
        
        if (Notification.permission === 'denied') {
          toast.error('Известията са блокирани. Включете ги от настройките на браузъра.')
          haptics.error()
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
      toast.error('Грешка при включване на известията')
      haptics.error()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    haptics.light()
    localStorage.setItem('pushPromptDismissed', 'true')
    setIsDismissed(true)
    setShowBanner(false)
  }

  // Don't show anything if not supported, already granted, or dismissed
  if (permission === 'unsupported' || permission === 'granted' || isDismissed || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Включи известията
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Получавай известия за нови съобщения и кандидатури
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors touch-manipulation flex items-center justify-center gap-1"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Включи
                  </>
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
              >
                По-късно
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for using push notifications
export function usePushNotifications(userId?: string) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setIsSupported(false)
      return
    }

    setIsEnabled(Notification.permission === 'granted')
  }, [])

  const enable = async () => {
    const token = await requestNotificationPermission()
    if (token) {
      setIsEnabled(true)
      if (userId) {
        await saveFCMToken(userId, token)
      }
      return true
    }
    return false
  }

  const disable = async () => {
    if (userId) {
      await fetch(`/api/notifications/subscribe?userId=${userId}`, {
        method: 'DELETE'
      })
    }
    setIsEnabled(false)
  }

  return { isEnabled, isSupported, enable, disable }
}

