'use client'

import { useState, useEffect } from 'react'
import { X, User, Camera, FileText, Star, ChevronRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { haptics } from '@/lib/haptics'

interface ProfileCompletionBannerProps {
  user: {
    id: string
    full_name?: string
    avatar_url?: string
    bio?: string
    skills?: string[]
    phone?: string
    location?: string
  }
  className?: string
}

interface CompletionStep {
  id: string
  label: string
  icon: React.ElementType
  isComplete: boolean
  href: string
}

export default function ProfileCompletionBanner({ user, className = '' }: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(`profileBanner_${user.id}`)
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [user.id])

  const steps: CompletionStep[] = [
    {
      id: 'avatar',
      label: 'Добави снимка',
      icon: Camera,
      isComplete: !!user.avatar_url,
      href: '/profile/edit'
    },
    {
      id: 'bio',
      label: 'Напиши описание',
      icon: FileText,
      isComplete: !!user.bio && user.bio.length > 20,
      href: '/profile/edit'
    },
    {
      id: 'skills',
      label: 'Добави умения',
      icon: Star,
      isComplete: !!user.skills && user.skills.length > 0,
      href: '/profile/edit'
    },
    {
      id: 'location',
      label: 'Посочи локация',
      icon: User,
      isComplete: !!user.location,
      href: '/profile/edit'
    }
  ]

  const completedSteps = steps.filter(s => s.isComplete).length
  const percentage = Math.round((completedSteps / steps.length) * 100)
  const incompleteSteps = steps.filter(s => !s.isComplete)

  // Don't show if profile is complete or dismissed
  if (percentage === 100 || isDismissed) return null

  const handleDismiss = () => {
    haptics.light()
    localStorage.setItem(`profileBanner_${user.id}`, 'true')
    setIsDismissed(true)
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => { haptics.light(); setIsExpanded(!isExpanded) }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {/* Progress ring */}
            <svg className="absolute -inset-1 w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(percentage / 100) * 126} 126`}
                className="text-blue-600"
              />
            </svg>
          </div>
          
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Профилът ти е {percentage}% завършен
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {incompleteSteps.length} {incompleteSteps.length === 1 ? 'стъпка остава' : 'стъпки остават'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          <button
            onClick={(e) => { e.stopPropagation(); handleDismiss() }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Link
                key={step.id}
                href={step.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors touch-manipulation ${
                  step.isComplete
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.isComplete
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {step.isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Icon className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <span className={`flex-1 ${
                  step.isComplete
                    ? 'text-green-700 dark:text-green-400 line-through'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {step.label}
                </span>
                {!step.isComplete && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

