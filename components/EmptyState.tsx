'use client'

import { 
  Search, 
  FileQuestion, 
  Inbox, 
  MessageSquare, 
  Heart, 
  Bell, 
  Users, 
  Briefcase,
  Plus,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { haptics } from '@/lib/haptics'

type EmptyStateType = 
  | 'search'
  | 'tasks'
  | 'messages'
  | 'favorites'
  | 'notifications'
  | 'applications'
  | 'reviews'
  | 'users'
  | 'generic'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  showRetry?: boolean
  onRetry?: () => void
  className?: string
}

const emptyStateConfig: Record<EmptyStateType, { 
  icon: React.ElementType
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  bgColor: string
}> = {
  search: {
    icon: Search,
    title: 'Няма резултати',
    description: 'Опитай с различни ключови думи или премахни някои филтри',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  tasks: {
    icon: Briefcase,
    title: 'Няма задачи',
    description: 'Все още няма публикувани задачи. Бъди първият!',
    actionLabel: 'Публикувай задача',
    actionHref: '/post-task',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  messages: {
    icon: MessageSquare,
    title: 'Няма съобщения',
    description: 'Когато започнеш разговор, той ще се появи тук',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  favorites: {
    icon: Heart,
    title: 'Няма любими',
    description: 'Добави задачи в любими за бърз достъп',
    actionLabel: 'Разгледай задачи',
    actionHref: '/tasks',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  },
  notifications: {
    icon: Bell,
    title: 'Няма известия',
    description: 'Ще получиш известие когато има нова активност',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  applications: {
    icon: Inbox,
    title: 'Няма кандидатури',
    description: 'Все още няма кандидати за тази задача',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
  },
  reviews: {
    icon: Users,
    title: 'Няма отзиви',
    description: 'Този потребител все още няма отзиви',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  },
  users: {
    icon: Users,
    title: 'Няма потребители',
    description: 'Не са намерени потребители с тези критерии',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30'
  },
  generic: {
    icon: FileQuestion,
    title: 'Няма данни',
    description: 'Няма налична информация за показване',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  }
}

export default function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  showRetry = false,
  onRetry,
  className = ''
}: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = config.icon

  const displayTitle = title || config.title
  const displayDescription = description || config.description
  const displayActionLabel = actionLabel || config.actionLabel
  const displayActionHref = actionHref || config.actionHref

  const handleAction = () => {
    haptics.light()
    onAction?.()
  }

  const handleRetry = () => {
    haptics.medium()
    onRetry?.()
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}>
        <Icon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        {displayDescription}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {displayActionLabel && (displayActionHref || onAction) && (
          displayActionHref ? (
            <Link
              href={displayActionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              {displayActionLabel}
            </Link>
          ) : (
            <button
              onClick={handleAction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              {displayActionLabel}
            </button>
          )
        )}

        {showRetry && onRetry && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          >
            <RefreshCw className="h-4 w-4" />
            Опитай отново
          </button>
        )}
      </div>
    </div>
  )
}

