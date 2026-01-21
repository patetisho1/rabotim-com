import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// Popular search terms (fallback)
const popularSearches = [
  'почистване на апартамент',
  'ремонт на мебели',
  'разходка на куче',
  'преместване',
  'градинарство',
  'детегледачка',
  'готвене',
  'шофьор',
  'монтаж на мебели',
  'боядисване'
]

// Category suggestions
const categorySuggestions: Record<string, string[]> = {
  'cleaning': ['почистване на апартамент', 'почистване след ремонт', 'почистване на офис', 'пране на килими'],
  'repair': ['ремонт на мебели', 'ВиК ремонт', 'електричар', 'ремонт на уреди'],
  'care': ['детегледачка', 'гледане на възрастни', 'домашен помощник'],
  'delivery': ['куриер', 'доставка на храна', 'доставка от магазин'],
  'moving': ['преместване', 'хамалски услуги', 'транспорт на мебели'],
  'garden': ['косене на трева', 'подрязване на дървета', 'поливане', 'градинар'],
  'dog-care': ['разходка на куче', 'гледане на куче', 'тренировка на куче'],
  'other': ['готвене', 'шофьор', 'монтаж', 'сглобяване']
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase().trim() || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '8')

    // If no query, return popular/recent searches
    if (!query) {
      // Try to get popular from database
      const supabase = getServiceRoleClient()
      
      const { data: recentTasks } = await supabase
        .from('tasks')
        .select('title')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5)

      const dbSuggestions = recentTasks?.map(t => t.title) || []
      
      // Mix database results with popular (use Array.from for ES5 compatibility)
      const combined = [...dbSuggestions, ...popularSearches]
      const suggestions = Array.from(new Set(combined)).slice(0, limit)
      
      return NextResponse.json({
        suggestions,
        type: 'popular'
      })
    }

    // Search for matching suggestions
    let suggestions: string[] = []

    // 1. Check category-specific suggestions
    if (category && categorySuggestions[category]) {
      suggestions = categorySuggestions[category].filter(s => 
        s.toLowerCase().includes(query)
      )
    }

    // 2. Search in all category suggestions
    if (suggestions.length < limit) {
      const allCategorySuggestions = Object.values(categorySuggestions).flat()
      const moreSuggestions = allCategorySuggestions.filter(s => 
        s.toLowerCase().includes(query) && !suggestions.includes(s)
      )
      suggestions = [...suggestions, ...moreSuggestions].slice(0, limit)
    }

    // 3. Search in database for matching task titles
    if (suggestions.length < limit) {
      const supabase = getServiceRoleClient()
      
      const { data: matchingTasks } = await supabase
        .from('tasks')
        .select('title')
        .eq('status', 'open')
        .ilike('title', `%${query}%`)
        .limit(limit - suggestions.length)

      if (matchingTasks) {
        const dbSuggestions = matchingTasks.map(t => t.title)
        const combined = [...suggestions, ...dbSuggestions]
        suggestions = Array.from(new Set(combined)).slice(0, limit)
      }
    }

    // 4. Add query itself as suggestion if we found matches
    if (suggestions.length > 0 && !suggestions.includes(query)) {
      suggestions = [query, ...suggestions].slice(0, limit)
    }

    return NextResponse.json({
      suggestions,
      type: 'search',
      query
    })

  } catch (error) {
    logger.error('Search suggestions error', error as Error, { endpoint: 'GET /api/search/suggestions' })
    
    // Return popular searches on error
    return NextResponse.json({
      suggestions: popularSearches.slice(0, 8),
      type: 'fallback'
    })
  }
}

