/**
 * Environment Variables Validation
 * Validates required environment variables at startup
 * Provides fallback values where appropriate
 */

import { logger } from './logger'

interface EnvConfig {
  // Supabase (Required)
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string

  // App Configuration
  NEXT_PUBLIC_APP_URL?: string
  NEXT_PUBLIC_APP_NAME?: string
  NEXT_PUBLIC_SITE_URL?: string

  // NextAuth (Optional for now)
  NEXTAUTH_URL?: string
  NEXTAUTH_SECRET?: string

  // OAuth (Optional)
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  FACEBOOK_CLIENT_ID?: string
  FACEBOOK_CLIENT_SECRET?: string

  // Email (Optional)
  RESEND_API_KEY?: string

  // Analytics (Optional)
  NEXT_PUBLIC_GA_ID?: string

  // Stripe (Optional)
  STRIPE_SECRET_KEY?: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string

  // PWA (Optional)
  NEXT_PUBLIC_PWA_ENABLED?: string

  // Other (Optional)
  NEXT_PUBLIC_HOTJAR_ID?: string
  NEXT_PUBLIC_CRISP_ID?: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  config: Partial<EnvConfig>
}

/**
 * Required environment variables
 */
const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
] as const

/**
 * Recommended environment variables (warnings if missing)
 */
const RECOMMENDED_VARS = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
] as const

/**
 * Validate environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const config: Partial<EnvConfig> = {}

  // Check required variables
  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      errors.push(`Missing required environment variable: ${varName}`)
    } else {
      config[varName as keyof EnvConfig] = value
    }
  }

  // Check recommended variables
  for (const varName of RECOMMENDED_VARS) {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      warnings.push(`Missing recommended environment variable: ${varName}`)
    } else {
      config[varName as keyof EnvConfig] = value
    }
  }

  // Validate Supabase URL format
  if (config.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      new URL(config.NEXT_PUBLIC_SUPABASE_URL)
    } catch {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is not a valid URL')
    }
  }

  // Validate Supabase Anon Key format (should be a JWT)
  if (config.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const parts = config.NEXT_PUBLIC_SUPABASE_ANON_KEY.split('.')
    if (parts.length !== 3) {
      warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY does not appear to be a valid JWT')
    }
  }

  // Set fallback values for optional variables
  config.NEXT_PUBLIC_APP_URL = config.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  
  config.NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Rabotim.com'
  config.NEXT_PUBLIC_SITE_URL = config.NEXT_PUBLIC_SITE_URL || config.NEXT_PUBLIC_APP_URL

  // Collect optional variables
  const optionalVars: (keyof EnvConfig)[] = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'FACEBOOK_CLIENT_ID',
    'FACEBOOK_CLIENT_SECRET',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_GA_ID',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_PWA_ENABLED',
    'NEXT_PUBLIC_HOTJAR_ID',
    'NEXT_PUBLIC_CRISP_ID',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  for (const varName of optionalVars) {
    const value = process.env[varName]
    if (value && value.trim() !== '') {
      config[varName] = value
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config
  }
}

/**
 * Get validated environment config
 * Throws error if required variables are missing
 */
export function getEnvConfig(): EnvConfig {
  const result = validateEnv()

  if (!result.valid) {
    const errorMessage = [
      '❌ Environment validation failed:',
      ...result.errors.map(e => `  - ${e}`),
      '',
      'Please check your .env.local or environment variables in Vercel.'
    ].join('\n')

    // In production, log error but don't crash
    if (process.env.NODE_ENV === 'production') {
      logger.error('Environment validation failed', new Error(errorMessage))
      // Use fallback values
      return {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://rabotim.com',
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Rabotim.com',
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'
      } as EnvConfig
    }

    // In development, log but allow graceful degradation
    logger.error('Environment validation failed', new Error(errorMessage))
    // Don't throw in development to allow graceful degradation with fallbacks
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Rabotim.com',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    } as EnvConfig
  }

  // Log warnings
  if (result.warnings.length > 0) {
    result.warnings.forEach(w => logger.warn('Environment warning', undefined, { warning: w }))
  }

  return result.config as EnvConfig
}

/**
 * Get a specific environment variable with fallback
 */
export function getEnv(key: keyof EnvConfig, fallback?: string): string {
  const value = process.env[key]
  if (value && value.trim() !== '') {
    return value
  }
  if (fallback) {
    return fallback
  }
  throw new Error(`Environment variable ${key} is not set and no fallback provided`)
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

