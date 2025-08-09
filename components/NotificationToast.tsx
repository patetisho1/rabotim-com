import React, { useEffect, useState } from 'react'
import { Notification } from '@/types/notification'
import { Bell, X, Check, AlertCircle, Info, ExternalLink } from 'lucide-react'

interface NotificationToastProps {
  notification: Notification
  onClose: () => void
  onAction?: (notification: Notification) => void
  duration?: number
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleAction = () => {
    if (onAction) {
      onAction(notification)
    } else if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    handleClose()
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="text-red-500" size={16} />
      case 'high':
        return <AlertCircle className="text-orange-500" size={16} />
      case 'normal':
        return <Info className="text-blue-500" size={16} />
      case 'low':
        return <Check className="text-green-500" size={16} />
      default:
        return <Bell className="text-gray-500" size={16} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'normal':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800'
    }
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out
        ${isVisible && !isClosing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        relative p-4 rounded-lg shadow-lg border-l-4 ${getPriorityColor(notification.priority)}
        backdrop-blur-sm bg-white/95 dark:bg-gray-800/95
      `}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-6">
          <div className="flex items-center gap-2">
            {getPriorityIcon(notification.priority)}
            <span className="text-lg">{notification.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Actions */}
        {notification.actionText && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleAction}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={12} />
              {notification.actionText}
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-linear"
            style={{
              width: isVisible ? '0%' : '100%',
              transitionDuration: `${duration}ms`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationToast
