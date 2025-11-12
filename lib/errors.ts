/**
 * Centralized error handling system
 * Provides user-friendly error messages and proper error types
 * 
 * Usage:
 *   import { AppError, handleApiError } from '@/lib/errors'
 *   throw new AppError('User not found', 404, 'Потребителят не е намерен')
 *   return handleApiError(error)
 */

import { NextResponse } from 'next/server'
import { logger } from './logger'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public userMessage?: string,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, AppError)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, userMessage?: string, context?: Record<string, any>) {
    super(message, 400, userMessage || 'Невалидни данни', context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized', userMessage: string = 'Не сте авторизирани') {
    super(message, 401, userMessage)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden', userMessage: string = 'Нямате права за това действие') {
    super(message, 403, userMessage)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 404, userMessage || 'Ресурсът не е намерен')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 409, userMessage || 'Конфликт с текущото състояние')
    this.name = 'ConflictError'
  }
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown, context?: Record<string, any>): NextResponse {
  // Log the error
  if (error instanceof AppError) {
    logger.error(
      `API Error: ${error.message}`,
      error,
      {
        statusCode: error.statusCode,
        userMessage: error.userMessage,
        ...error.context,
        ...context
      }
    )

    return NextResponse.json(
      {
        error: error.userMessage || error.message,
        code: error.statusCode
      },
      { status: error.statusCode }
    )
  }

  // Handle unknown errors
  if (error instanceof Error) {
    logger.error(
      'Unexpected API Error',
      error,
      context
    )

    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    const message = isDevelopment
      ? error.message
      : 'Възникна грешка. Моля опитайте отново.'

    return NextResponse.json(
      {
        error: message,
        code: 500
      },
      { status: 500 }
    )
  }

  // Handle non-Error objects
  logger.error(
    'Unknown API Error',
    new Error(String(error)),
    context
  )

  return NextResponse.json(
    {
      error: 'Възникна неочаквана грешка. Моля опитайте отново.',
      code: 500
    },
    { status: 500 }
  )
}

/**
 * User-friendly error messages in Bulgarian
 */
export const ErrorMessages = {
  // Authentication
  UNAUTHORIZED: 'Не сте авторизирани. Моля влезте в акаунта си.',
  FORBIDDEN: 'Нямате права за това действие.',
  INVALID_CREDENTIALS: 'Невалидни имейл или парола.',
  
  // Validation
  MISSING_FIELDS: 'Липсват задължителни полета.',
  INVALID_DATA: 'Невалидни данни.',
  INVALID_EMAIL: 'Невалиден имейл адрес.',
  INVALID_PHONE: 'Невалиден телефонен номер.',
  
  // Resources
  NOT_FOUND: 'Ресурсът не е намерен.',
  TASK_NOT_FOUND: 'Задачата не е намерена.',
  USER_NOT_FOUND: 'Потребителят не е намерен.',
  APPLICATION_NOT_FOUND: 'Кандидатурата не е намерена.',
  
  // Business logic
  TASK_ALREADY_ASSIGNED: 'Задачата вече е назначена.',
  ALREADY_APPLIED: 'Вече сте кандидатствали за тази задача.',
  CANNOT_APPLY_OWN_TASK: 'Не можете да кандидатствате за собствената си задача.',
  TASK_NOT_COMPLETED: 'Задачата трябва да бъде завършена преди да оставите отзив.',
  ALREADY_RATED: 'Вече сте оставили отзив за тази задача.',
  
  // Server
  INTERNAL_ERROR: 'Възникна вътрешна грешка. Моля опитайте отново.',
  DATABASE_ERROR: 'Грешка при достъп до базата данни. Моля опитайте по-късно.',
  NETWORK_ERROR: 'Грешка при мрежовата връзка. Моля проверете интернет връзката си.',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Твърде много заявки. Моля опитайте по-късно.',
  
  // Moderation
  TASK_PENDING_MODERATION: 'Задачата е изпратена за преглед и ще бъде активна след одобрение.',
  TASK_REJECTED: 'Задачата е отхвърлена от модератор.',
}

/**
 * Get user-friendly error message for an error
 */
export function getUserErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage || error.message
  }
  
  if (error instanceof Error) {
    // Map common error messages to user-friendly messages
    const message = error.message.toLowerCase()
    
    if (message.includes('unauthorized') || message.includes('auth')) {
      return ErrorMessages.UNAUTHORIZED
    }
    
    if (message.includes('forbidden') || message.includes('permission')) {
      return ErrorMessages.FORBIDDEN
    }
    
    if (message.includes('not found')) {
      return ErrorMessages.NOT_FOUND
    }
    
    if (message.includes('already') || message.includes('duplicate')) {
      return ErrorMessages.ALREADY_APPLIED
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorMessages.NETWORK_ERROR
    }
  }
  
  return ErrorMessages.INTERNAL_ERROR
}

