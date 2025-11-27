'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseSearchSuggestionsOptions {
  debounceMs?: number
  minChars?: number
  maxSuggestions?: number
  category?: string
}

interface UseSearchSuggestionsReturn {
  suggestions: string[]
  isLoading: boolean
  error: string | null
  fetchSuggestions: (query: string) => void
  clearSuggestions: () => void
  recentSearches: string[]
  addToRecent: (query: string) => void
  clearRecent: () => void
}

export function useSearchSuggestions(options: UseSearchSuggestionsOptions = {}): UseSearchSuggestionsReturn {
  const {
    debounceMs = 300,
    minChars = 2,
    maxSuggestions = 8,
    category = ''
  } = options

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Error loading recent searches:', e)
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: string[]) => {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(searches))
    } catch (e) {
      console.error('Error saving recent searches:', e)
    }
  }, [])

  const addToRecent = useCallback((query: string) => {
    if (!query.trim()) return
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase())
      const updated = [query, ...filtered].slice(0, 10) // Keep max 10
      saveRecentSearches(updated)
      return updated
    })
  }, [saveRecentSearches])

  const clearRecent = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  const fetchSuggestions = useCallback((query: string) => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // If query is too short, show recent searches
    if (query.length < minChars) {
      setSuggestions(recentSearches.slice(0, maxSuggestions))
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    // Debounce the API call
    debounceRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController()
        
        const params = new URLSearchParams({
          q: query,
          limit: maxSuggestions.toString()
        })
        
        if (category) {
          params.set('category', category)
        }

        const response = await fetch(`/api/search/suggestions?${params}`, {
          signal: abortControllerRef.current.signal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions')
        }

        const data = await response.json()
        setSuggestions(data.suggestions || [])

      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Suggestions fetch error:', err)
          setError('Грешка при зареждане на предложения')
          // Fallback to recent searches
          setSuggestions(recentSearches.filter(s => 
            s.toLowerCase().includes(query.toLowerCase())
          ).slice(0, maxSuggestions))
        }
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

  }, [debounceMs, minChars, maxSuggestions, category, recentSearches])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    clearSuggestions,
    recentSearches,
    addToRecent,
    clearRecent
  }
}

