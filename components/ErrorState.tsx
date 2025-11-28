'use client'

import { 
  AlertTriangle, 
  WifiOff, 
  ServerCrash, 
  Ban, 
  Clock, 
  RefreshCw,
  Home,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { haptics } from '@/lib/haptics'

type ErrorType = 
  | 'generic'
  | 'network'
  | 'server'
  | 'notFound'
  | 'forbidden'
  | 'timeout'
  | 'maintenance'

interface ErrorStateProps {
  type?: ErrorType
  title?: string
  description?: string
  errorCode?: string | number
  showRetry?: boolean
  onRetry?: () => void
  showHome?: boolean
  showBack?: boolean
  onBack?: () => void
  className?: string
}

const errorConfig: Record<ErrorType, {
  icon: React.ElementType
  title: string
  description: string
  bgColor: string
  iconColor: string
}> = {
  generic: {
    icon: AlertTriangle,
    title: 'Нещо се обърка',
    description: 'Възникна неочаквана грешка. Моля, опитай отново.',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500'
  },
  network: {
    icon: WifiOff,
    title: 'Няма връзка',
    description: 'Провери интернет връзката си и опитай отново.',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-500'
  },
  server: {
    icon: ServerCrash,
    title: 'Сървърна грешка',
    description: 'Имаме временни технически затруднения. Опитай отново след малко.',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-500'
  },
  notFound: {
    icon: Ban,
    title: 'Страницата не е намерена',
    description: 'Страницата, която търсиш, не съществува или е премахната.',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500'
  },
  forbidden: {
    icon: Ban,
    title: 'Нямаш достъп',
    description: 'Нямаш права да видиш това съдържание.',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600'
  },
  timeout: {
    icon: Clock,
    title: 'Времето изтече',
    description: 'Заявката отне твърде много време. Опитай отново.',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500'
  },
  maintenance: {
    icon: ServerCrash,
    title: 'В процес на поддръжка',
    description: 'Извършваме планирана поддръжка. Ще се върнем скоро!',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-500'
  }
}

export default function ErrorState({
  type = 'generic',
  title,
  description,
  errorCode,
  showRetry = true,
  onRetry,
  showHome = true,
  showBack = false,
  onBack,
  className = ''
}: ErrorStateProps) {
  const config = errorConfig[type]
  const Icon = config.icon

  const displayTitle = title || config.title
  const displayDescription = description || config.description

  const handleRetry = () => {
    haptics.medium()
    onRetry?.()
  }

  const handleBack = () => {
    haptics.light()
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center min-h-[50vh] ${className}`}>
      {/* Icon */}
      <div className={`w-24 h-24 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}>
        <Icon className={`h-12 w-12 ${config.iconColor}`} />
      </div>

      {/* Error Code */}
      {errorCode && (
        <span className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">
          {errorCode}
        </span>
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        {displayTitle}
      </h2>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {displayDescription}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && onRetry && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors touch-manipulation min-h-[48px]"
          >
            <RefreshCw className="h-5 w-5" />
            Опитай отново
          </button>
        )}

        {showBack && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation min-h-[48px]"
          >
            <ArrowLeft className="h-5 w-5" />
            Назад
          </button>
        )}

        {showHome && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation min-h-[48px]"
          >
            <Home className="h-5 w-5" />
            Начало
          </Link>
        )}
      </div>

      {/* Technical details for developers */}
      {process.env.NODE_ENV === 'development' && errorCode && (
        <p className="mt-8 text-xs text-gray-400">
          Error Code: {errorCode} | Type: {type}
        </p>
      )}
    </div>
  )
}

