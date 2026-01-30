/**
 * Rate limiting middleware for API routes
 * Prevents abuse and DDoS attacks
 * 
 * Usage:
 *   import { rateLimit } from '@/lib/rate-limit'
 *   export async function GET(request: NextRequest) {
 *     const rateLimitResult = await rateLimit(request)
 *     if (rateLimitResult.limited) {
 *       return rateLimitResult.response
 *     }
 *     // ... your handler code
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

interface RateLimitResult {
  limited: boolean
  remaining: number
  resetTime: number
  response?: NextResponse
}

// In-memory store for rate limiting (use Redis in production for distributed systems)
const store = new Map<string, { count: number; resetTime: number }>()

// Cleanup function - called on each request to avoid stale entries
function cleanupStore() {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  // Collect keys to delete
  store.forEach((value, key) => {
    if (value.resetTime < now) {
      keysToDelete.push(key)
    }
  })
  
  // Delete expired entries
  keysToDelete.forEach(key => store.delete(key))
  
  // Limit store size to prevent memory issues (keep max 1000 entries)
  if (store.size > 1000) {
    const entries: Array<[string, { count: number; resetTime: number }]> = []
    store.forEach((value, key) => {
      entries.push([key, value])
    })
    entries.sort((a, b) => a[1].resetTime - b[1].resetTime)
    const toDelete = entries.slice(0, store.size - 1000)
    toDelete.forEach(([key]) => store.delete(key))
  }
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get user ID from auth token
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    // Extract user ID from token (simplified - in production use proper JWT parsing)
    const token = authHeader.replace('Bearer ', '')
    if (token) {
      return `user:${token.slice(0, 10)}` // Use first 10 chars as identifier
    }
  }
  
  // Fallback to IP address
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  return `ip:${ip}`
}

/**
 * Rate limit check
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
    message: 'Твърде много заявки. Моля опитайте по-късно.',
  }
): Promise<RateLimitResult> {
  // Cleanup old entries on each request
  cleanupStore()
  
  const clientId = getClientId(request)
  const now = Date.now()
  const windowStart = Math.floor(now / config.windowMs)
  const key = `${clientId}:${windowStart}`
  
  const entry = store.get(key)
  
  if (!entry || entry.resetTime < now) {
    // Create new entry
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }
  
  // Increment count
  entry.count++
  store.set(key, entry)
  
  if (entry.count > config.maxRequests) {
    // Rate limit exceeded
    const error = new Error(`Rate limit exceeded: ${entry.count}/${config.maxRequests} requests`)
    logger.warn('Rate limit exceeded', error, {
      clientId,
      count: entry.count,
      maxRequests: config.maxRequests,
      path: request.nextUrl.pathname,
      method: request.method
    })
    
    const response = NextResponse.json(
      {
        error: config.message || 'Твърде много заявки. Моля опитайте по-късно.',
        code: 429,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000) // seconds
      },
      { status: 429 }
    )
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', '0')
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString())
    response.headers.set('Retry-After', Math.ceil((entry.resetTime - now) / 1000).toString())
    
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
      response
    }
  }
  
  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Different rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Default rate limit
  default: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  
  // Stricter rate limit for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 login attempts per 15 minutes
    message: 'Твърде много опити за вход. Моля опитайте след 15 минути.'
  },
  
  // Stricter rate limit for task creation
  taskCreation: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 tasks per hour
    message: 'Достигнахте лимита за публикуване на задачи. Моля опитайте след 1 час.'
  },
  
  // Stricter rate limit for applications
  applications: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50, // 50 applications per 15 minutes
    message: 'Твърде много кандидатури. Моля опитайте по-късно.'
  },
  
  // Very strict rate limit for password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 password reset attempts per hour
    message: 'Твърде много опити за възстановяване на парола. Моля опитайте след 1 час.'
  },
  
  // Moderate rate limit for API endpoints
  api: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Твърде много заявки. Моля опитайте след 1 минута.'
  },

  // Имейл изпращане – да не претоварваме доставчика (и да имаме ясно наше съобщение, не от Resend)
  sendEmail: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 20, // 20 emails per minute per client
    message: 'Твърде много имейли за кратко време. Моля изчакайте около минута и опитайте отново.'
  }
}

