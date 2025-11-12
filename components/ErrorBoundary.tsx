'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug, Smartphone, Wifi, WifiOff, Server, User, Settings } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  isOnline: boolean
  retryCount: number
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOnline: navigator.onLine,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Send error to analytics/monitoring service
    this.logErrorToService(error, errorInfo)
  }

  componentDidMount() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }

  handleOnline = () => {
    this.setState({ isOnline: true })
  }

  handleOffline = () => {
    this.setState({ isOnline: false })
  }

  logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    // Implement error logging to your preferred service
    // Example: Sentry, LogRocket, etc.
    try {
      // Import logger dynamically to avoid SSR issues
      const { logger } = await import('@/lib/logger')
      
      // Log error to centralized logging system
      logger.error('ErrorBoundary caught an error', error, {
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : false,
        errorName: error.name,
        errorMessage: error.message
      })
      
      // Optionally send to API endpoint for error tracking
      if (process.env.NODE_ENV === 'production') {
        try {
          await fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: error.message,
              stack: error.stack,
              componentStack: errorInfo.componentStack,
              timestamp: new Date().toISOString(),
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
              url: typeof window !== 'undefined' ? window.location.href : 'unknown',
              isOnline: typeof navigator !== 'undefined' ? navigator.onLine : false,
              errorName: error.name
            })
          })
        } catch (apiError) {
          // Silently fail if API endpoint doesn't exist or fails
          logger.warn('Failed to send error to API', apiError as Error)
        }
      }
    } catch (loggingError) {
      // Fallback to console if logger fails
      console.error('Failed to log error:', loggingError)
      console.error('Original error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleGoBack = () => {
    window.history.back()
  }

  handleRefresh = () => {
    window.location.reload()
  }

  getErrorType = (error: Error): 'network' | 'runtime' | 'unknown' => {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'network'
    }
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'runtime'
    }
    return 'unknown'
  }

  getErrorMessage = (error: Error): string => {
    const errorType = this.getErrorType(error)
    
    switch (errorType) {
      case 'network':
        return 'Проблем с мрежата. Моля, проверете интернет връзката си.'
      case 'runtime':
        return 'Възникна грешка в приложението. Моля, опитайте отново.'
      default:
        return 'Неочаквана грешка. Моля, опитайте отново.'
    }
  }

  getErrorIcon = (error: Error) => {
    const errorType = this.getErrorType(error)
    
    switch (errorType) {
      case 'network':
        return this.state.isOnline ? <Wifi size={48} /> : <WifiOff size={48} />
      case 'runtime':
        return <Bug size={48} />
      default:
        return <AlertTriangle size={48} />
    }
  }

  getErrorActions = (error: Error) => {
    const errorType = this.getErrorType(error)
    
    switch (errorType) {
      case 'network':
        return [
          {
            label: 'Провери връзката',
            icon: <Wifi size={16} />,
            action: this.handleRefresh,
            primary: true
          },
          {
            label: 'Опитай отново',
            icon: <RefreshCw size={16} />,
            action: this.handleRetry,
            primary: false
          }
        ]
      case 'runtime':
        return [
          {
            label: 'Опитай отново',
            icon: <RefreshCw size={16} />,
            action: this.handleRetry,
            primary: true
          },
          {
            label: 'Начало',
            icon: <Home size={16} />,
            action: this.handleGoHome,
            primary: false
          }
        ]
      default:
        return [
          {
            label: 'Опитай отново',
            icon: <RefreshCw size={16} />,
            action: this.handleRetry,
            primary: true
          },
          {
            label: 'Назад',
            icon: <ArrowLeft size={16} />,
            action: this.handleGoBack,
            primary: false
          }
        ]
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, retryCount } = this.state
      
      if (!error) {
        return this.props.fallback || this.renderDefaultFallback()
      }

      const errorMessage = this.getErrorMessage(error)
      const errorIcon = this.getErrorIcon(error)
      const errorActions = this.getErrorActions(error)

      return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 ${this.props.className || ''}`}>
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
                {errorIcon}
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Възникна грешка
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {errorMessage}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Детайли за разработчици:
                  </h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div><strong>Грешка:</strong> {error.message}</div>
                    <div><strong>Тип:</strong> {error.name}</div>
                    <div><strong>Опити:</strong> {retryCount}</div>
                    <div><strong>Онлайн:</strong> {this.state.isOnline ? 'Да' : 'Не'}</div>
                  </div>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap overflow-x-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {errorActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      action.primary
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Additional Help */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Ако проблемът продължава, моля свържете се с поддръжката
                </p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <button
                    onClick={this.handleRefresh}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <RefreshCw size={12} />
                    Обнови
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Home size={12} />
                    Начало
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Server size={12} />
                  <span>Rabotim.com</span>
                </div>
                <div className="flex items-center gap-1">
                  {this.state.isOnline ? (
                    <>
                      <Wifi size={12} />
                      <span>Онлайн</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={12} />
                      <span>Офлайн</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }

  renderDefaultFallback() {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <AlertTriangle size={48} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Възникна грешка
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Неочаквана грешка. Моля, опитайте отново.
          </p>
          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Опитай отново
            </button>
            <button
              onClick={this.handleGoHome}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Home size={16} />
              Начало
            </button>
          </div>
        </div>
      </div>
    )
  }
}

// Hook for functional components
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by useErrorHandler:', error, errorInfo)
    }

    // Send error to analytics/monitoring service
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        isOnline: navigator.onLine
      }
      
      console.log('Error logged:', errorData)
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }

  return { handleError }
}

