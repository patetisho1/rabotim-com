'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Rocket, 
  TrendingUp, 
  X, 
  Eye, 
  Users,
  Zap,
  ChevronRight
} from 'lucide-react'

interface PromoteTaskBannerProps {
  taskId: string
  viewCount?: number
  applicationCount?: number
  daysOld?: number
  isOwner: boolean
  isPromoted?: boolean
  variant?: 'full' | 'compact' | 'inline'
}

export default function PromoteTaskBanner({
  taskId,
  viewCount = 0,
  applicationCount = 0,
  daysOld = 0,
  isOwner,
  isPromoted = false,
  variant = 'full'
}: PromoteTaskBannerProps) {
  const router = useRouter()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isOwner || isPromoted || isDismissed) return null

  // Show promotion suggestion if task has low engagement
  const shouldShowPromotion = viewCount < 50 || applicationCount < 3 || daysOld >= 2

  if (!shouldShowPromotion) return null

  const handlePromote = () => {
    router.push(`/task/${taskId}/promote`)
  }

  // Compact inline variant (for task cards in listings)
  if (variant === 'inline') {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          handlePromote()
        }}
        className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full hover:opacity-90 transition-opacity"
      >
        <Rocket size={12} />
        Промотирай
      </button>
    )
  }

  // Compact variant (for sidebar)
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Rocket size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Получи повече кандидати
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              от 2.99€
            </p>
          </div>
          <button
            onClick={handlePromote}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // Full variant (for task page)
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Затвори"
      >
        <X size={16} />
      </button>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold">
              Искаш повече кандидати?
            </h3>
          </div>

          <p className="text-white/90 text-sm mb-3">
            Промотираната обява се показва <strong>на първо място</strong> и получава до <strong>5x повече прегледи</strong>!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="text-white/70" />
              <span>{viewCount} прегледа</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-white/70" />
              <span>{applicationCount} кандидата</span>
            </div>
            {daysOld >= 2 && (
              <div className="flex items-center gap-1.5 text-yellow-300">
                <Zap size={16} />
                <span>Обявата е от {daysOld} дни</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handlePromote}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
        >
          <Rocket size={18} />
          Промотирай от 2.99€
        </button>
      </div>
    </div>
  )
}

