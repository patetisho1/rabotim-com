'use client'

import { useState, useEffect } from 'react'
import { Loader2, RefreshCw, Clock, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'skeleton'
  text?: string
  showProgress?: boolean
  progress?: number
  timeout?: number
  onTimeout?: () => void
  showRetry?: boolean
  onRetry?: () => void
  isOnline?: boolean
  className?: string
}

export default function LoadingSpinner({
  size = 'medium',
  variant = 'spinner',
  text,
  showProgress = false,
  progress = 0,
  timeout = 30000,
  onTimeout,
  showRetry = false,
  onRetry,
  isOnline = navigator.onLine,
  className = ''
}: LoadingSpinnerProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setHasTimedOut(true)
        onTimeout?.()
      }, timeout)

      return () => clearTimeout(timer)
    }
  }, [timeout, onTimeout])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setHasTimedOut(false)
    onRetry?.()
  }

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xl: 'text-lg'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} animate-spin`}>
            <Loader2 className="w-full h-full text-blue-600 dark:text-blue-400" />
          </div>
        )
      
      case 'dots':
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'small' ? 'w-1 h-1' : size === 'large' ? 'w-2 h-2' : 'w-1.5 h-1.5'} bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse`} />
        )
      
      case 'bars':
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${size === 'small' ? 'w-1 h-3' : size === 'large' ? 'w-2 h-6' : 'w-1.5 h-4'} bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case 'skeleton':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`} />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '60%' }} />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className={`${sizeClasses[size]} animate-spin`}>
            <Loader2 className="w-full h-full text-blue-600 dark:text-blue-400" />
          </div>
        )
    }
  }

  if (hasTimedOut) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
        <div className="text-yellow-500 dark:text-yellow-400 mb-4">
          <Clock size={size === 'xl' ? 48 : size === 'large' ? 32 : 24} />
        </div>
        <h3 className={`font-medium text-gray-900 dark:text-gray-100 mb-2 ${textSizes[size]}`}>
          Зареждането отнема повече време
        </h3>
        <p className={`text-gray-600 dark:text-gray-400 mb-4 ${textSizes[size]}`}>
          Моля, проверете интернет връзката си
        </p>
        
        {!isOnline && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
            <WifiOff size={16} />
            <span className="text-sm">Няма интернет връзка</span>
          </div>
        )}
        
        {showRetry && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Опитай отново
          </button>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Опит {retryCount + 1}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {renderSpinner()}
      
      {text && (
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${textSizes[size]}`}>
          {text}
        </p>
      )}
      
      {showProgress && (
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Зареждане...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Full screen loading overlay
interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  variant?: LoadingSpinnerProps['variant']
  size?: LoadingSpinnerProps['size']
  showProgress?: boolean
  progress?: number
  onCancel?: () => void
  className?: string
}

export function LoadingOverlay({
  isVisible,
  text,
  variant = 'spinner',
  size = 'large',
  showProgress = false,
  progress = 0,
  onCancel,
  className = ''
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full">
        <LoadingSpinner
          variant={variant}
          size={size}
          text={text}
          showProgress={showProgress}
          progress={progress}
        />
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Отказ
          </button>
        )}
      </div>
    </div>
  )
}

// Inline loading component
interface InlineLoadingProps {
  text?: string
  size?: LoadingSpinnerProps['size']
  variant?: LoadingSpinnerProps['variant']
  className?: string
}

export function InlineLoading({
  text,
  size = 'small',
  variant = 'spinner',
  className = ''
}: InlineLoadingProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <LoadingSpinner variant={variant} size={size} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {text}
        </span>
      )}
    </div>
  )
}

// Button loading state
interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export function ButtonLoading({
  isLoading,
  children,
  loadingText = 'Зареждане...',
  disabled = false,
  className = '',
  onClick
}: ButtonLoadingProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors ${className}`}
    >
      {isLoading && (
        <Loader2 size={16} className="animate-spin" />
      )}
      {isLoading ? loadingText : children}
    </button>
  )
}

// Page loading component
interface PageLoadingProps {
  text?: string
  showProgress?: boolean
  progress?: number
  className?: string
}

export function PageLoading({
  text = 'Зареждане на страницата...',
  showProgress = false,
  progress = 0,
  className = ''
}: PageLoadingProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="text-center">
        <LoadingSpinner
          variant="spinner"
          size="xl"
          text={text}
          showProgress={showProgress}
          progress={progress}
        />
      </div>
    </div>
  )
}

// Skeleton loading components
interface SkeletonProps {
  className?: string
  lines?: number
  variant?: 'text' | 'card' | 'avatar' | 'button'
}

export function Skeleton({ className = '', lines = 1, variant = 'text' }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: `${i === lines - 1 ? '60%' : '100%'}` }}
              />
            ))}
          </div>
        )
      
      case 'card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '60%' }} />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '40%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '80%' }} />
            </div>
          </div>
        )
      
      case 'avatar':
        return (
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        )
      
      case 'button':
        return (
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" style={{ width: '120px' }} />
        )
      
      default:
        return null
    }
  }

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  )
}

