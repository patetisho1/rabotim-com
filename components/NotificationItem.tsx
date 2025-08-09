import React from 'react'
import { Notification } from '@/types/notification'
import { Bell, Check, Pin, Trash2, ExternalLink, Clock } from 'lucide-react'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  onAction?: (notification: Notification) => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onTogglePin,
  onDelete,
  onAction
}) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'сега'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}м`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}ч`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}д`
    return `${Math.floor(diffInSeconds / 2592000)}м`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'normal': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'low': return 'border-gray-300 bg-gray-50 dark:bg-gray-800'
      default: return 'border-gray-300 bg-white dark:bg-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return '💬'
      case 'tasks': return '✅'
      case 'payments': return '💰'
      case 'system': return '🔧'
      case 'security': return '🔒'
      case 'achievements': return '🏆'
      default: return '🔔'
    }
  }

  const handleAction = () => {
    if (onAction) {
      onAction(notification)
    } else if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank')
    }
  }

  return (
    <div className={`
      relative p-4 border-l-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md
      ${getPriorityColor(notification.priority)}
      ${notification.isRead ? 'opacity-75' : 'opacity-100'}
      ${notification.isPinned ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
    `}>
      {/* Pin indicator */}
      {notification.isPinned && (
        <div className="absolute top-2 right-2">
          <Pin size={12} className="text-blue-500" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{notification.icon || getCategoryIcon(notification.category)}</span>
          <h4 className={`font-medium text-sm ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {notification.title}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock size={10} />
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Message */}
      <p className={`text-sm mb-3 ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {notification.message}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
            >
              <Check size={12} />
              Прочетено
            </button>
          )}
          
          {notification.actionText && (
            <button
              onClick={handleAction}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              <ExternalLink size={12} />
              {notification.actionText}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onTogglePin(notification.id)}
            className={`p-1 rounded transition-colors ${
              notification.isPinned 
                ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            title={notification.isPinned ? 'Откачи' : 'Закачи'}
          >
            <Pin size={14} />
          </button>
          
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Изтрий"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Priority badge */}
      {notification.priority !== 'normal' && (
        <div className="absolute top-2 left-2">
          <span className={`
            px-1 py-0.5 text-xs rounded-full text-white
            ${notification.priority === 'urgent' ? 'bg-red-500' : ''}
            ${notification.priority === 'high' ? 'bg-orange-500' : ''}
            ${notification.priority === 'low' ? 'bg-gray-500' : ''}
          `}>
            {notification.priority === 'urgent' ? 'Спешно' : ''}
            {notification.priority === 'high' ? 'Важно' : ''}
            {notification.priority === 'low' ? 'Ниско' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

export default NotificationItem
