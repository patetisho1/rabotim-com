import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// Required tables for the application
const requiredTables = [
  'users',
  'tasks',
  'applications',
  'messages',
  'notifications',
  'ratings',
  'reviews',
  'reports',
  'user_blocks',
  'fcm_tokens',
  'favorites'
]

// GET - Check database health and missing tables
export async function GET() {
  try {
    const supabase = getServiceRoleClient()
    const results: Record<string, { exists: boolean; error?: string; rowCount?: number }> = {}

    // Check each table
    for (const table of requiredTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          // Table doesn't exist or other error
          results[table] = { 
            exists: false, 
            error: error.code === '42P01' ? 'Table not found' : error.message 
          }
        } else {
          results[table] = { exists: true, rowCount: count || 0 }
        }
      } catch (err) {
        results[table] = { exists: false, error: 'Check failed' }
      }
    }

    const existingTables = Object.entries(results).filter(([, v]) => v.exists).map(([k]) => k)
    const missingTables = Object.entries(results).filter(([, v]) => !v.exists).map(([k]) => k)

    return NextResponse.json({
      success: true,
      summary: {
        total: requiredTables.length,
        existing: existingTables.length,
        missing: missingTables.length
      },
      tables: results,
      missingTables,
      existingTables
    })

  } catch (error) {
    logger.error('Database health check error', error as Error, { endpoint: 'GET /api/health/database' })
    return NextResponse.json({
      success: false,
      error: 'Failed to check database health'
    }, { status: 500 })
  }
}

