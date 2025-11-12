/**
 * Environment Variables Initialization
 * Validates environment variables at application startup
 * Should be imported early in the application lifecycle
 */

import { validateEnv } from './env-validation'
import { logger } from './logger'

// Validate environment variables on module load
let validationResult: ReturnType<typeof validateEnv> | null = null

try {
  validationResult = validateEnv()
  
  if (!validationResult.valid) {
    const errorMessage = [
      '❌ Environment validation failed:',
      ...validationResult.errors.map(e => `  - ${e}`),
      '',
      'Please check your .env.local or environment variables in Vercel.'
    ].join('\n')

    if (process.env.NODE_ENV === 'production') {
      // In production, log error but don't crash
      console.error(errorMessage)
    } else {
      // In development, throw error to catch issues early
      console.error(errorMessage)
      // Don't throw in development to allow graceful degradation
    }
  }

  if (validationResult.warnings.length > 0) {
    console.warn('⚠️ Environment warnings:')
    validationResult.warnings.forEach(w => console.warn(`  - ${w}`))
  }
} catch (error) {
  console.error('Error during environment validation:', error)
}

export { validationResult }

