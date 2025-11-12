/**
 * Centralized logging system
 * Replaces console.log/warn/error with proper logging
 * 
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('Message')
 *   logger.warn('Warning')
 *   logger.error('Error', error)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  requestId?: string
  path?: string
  method?: string
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''
    const errorStr = error ? `\nError: ${error.message}\nStack: ${error.stack}` : ''
    
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr} ${errorStr}`
  }

  private shouldLog(level: LogLevel): boolean {
    // In development, log everything
    if (this.isDevelopment) {
      return true
    }
    
    // In production, only log warnings and errors
    if (this.isProduction) {
      return level === 'warn' || level === 'error'
    }
    
    // In other environments, log everything except debug
    return level !== 'debug'
  }

  private sendToErrorTracking(error: Error, context?: LogContext) {
    // In production, send to error tracking service (e.g., Sentry)
    if (this.isProduction && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // TODO: Integrate with Sentry or other error tracking service
      // Example:
      // Sentry.captureException(error, { extra: context })
    }
  }

  info(message: string, context?: LogContext) {
    if (!this.shouldLog('info')) return
    
    const formattedMessage = this.formatMessage('info', message, context)
    
    if (this.isDevelopment) {
      console.log(formattedMessage)
    }
    // In production, could send to logging service
  }

  warn(message: string, error?: Error, context?: LogContext) {
    if (!this.shouldLog('warn')) return
    
    const formattedMessage = this.formatMessage('warn', message, context, error)
    
    if (this.isDevelopment) {
      console.warn(formattedMessage)
    } else {
      // In production, always log warnings
      console.warn(formattedMessage)
    }
    
    if (error) {
      this.sendToErrorTracking(error, context)
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    if (!this.shouldLog('error')) return
    
    const formattedMessage = this.formatMessage('error', message, context, error)
    
    // Always log errors
    console.error(formattedMessage)
    
    if (error) {
      this.sendToErrorTracking(error, context)
    }
  }

  debug(message: string, context?: LogContext) {
    if (!this.shouldLog('debug')) return
    
    const formattedMessage = this.formatMessage('debug', message, context)
    
    if (this.isDevelopment) {
      console.debug(formattedMessage)
    }
  }
}

export const logger = new Logger()

// Export for use in API routes and components
export default logger

