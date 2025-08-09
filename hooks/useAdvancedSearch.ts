'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { SearchFilters, SavedSearch, SearchSuggestion, SearchResult, SearchHistory } from '@/types/search'

export function useAdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: ''
  })
  
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)

  // Зареждане на запазени търсения
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches')
    if (saved) {
      const parsed = JSON.parse(saved).map((search: any) => ({
        ...search,
        createdAt: new Date(search.createdAt)
      }))
      setSavedSearches(parsed)
    }

    const history = localStorage.getItem('searchHistory')
    if (history) {
      const parsed = JSON.parse(history).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
      setSearchHistory(parsed.slice(0, 10)) // Последните 10 търсения
    }
  }, [])

  // Генериране на предложения
  const generateSuggestions = useCallback((query: string): SearchSuggestion[] => {
    if (!query.trim()) return []

    const allSuggestions: SearchSuggestion[] = [
      // Категории
      { id: '1', text: 'Почистване', type: 'category', count: 45, relevance: 0.9 },
      { id: '2', text: 'Ремонт', type: 'category', count: 32, relevance: 0.8 },
      { id: '3', text: 'Градинарство', type: 'category', count: 28, relevance: 0.7 },
      { id: '4', text: 'Доставка', type: 'category', count: 23, relevance: 0.6 },
      
      // Локации
      { id: '5', text: 'София', type: 'location', count: 156, relevance: 0.9 },
      { id: '6', text: 'Пловдив', type: 'location', count: 89, relevance: 0.8 },
      { id: '7', text: 'Варна', type: 'location', count: 67, relevance: 0.7 },
      
      // Ключови думи
      { id: '8', text: 'спешно', type: 'keyword', count: 12, relevance: 0.6 },
      { id: '9', text: 'професионален', type: 'keyword', count: 8, relevance: 0.5 },
      { id: '10', text: 'опитен', type: 'keyword', count: 15, relevance: 0.5 },
      
      // Тагове
      { id: '11', text: 'къща', type: 'tag', count: 34, relevance: 0.4 },
      { id: '12', text: 'офис', type: 'tag', count: 21, relevance: 0.4 },
      { id: '13', text: 'апартамент', type: 'tag', count: 28, relevance: 0.4 }
    ]

    const filtered = allSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    )

    // Сортиране по релевантност и брой
    return filtered.sort((a, b) => {
      const relevanceDiff = b.relevance - a.relevance
      if (relevanceDiff !== 0) return relevanceDiff
      return (b.count || 0) - (a.count || 0)
    }).slice(0, 8)
  }, [])

  // Обновяване на предложенията при промяна на заявката
  useEffect(() => {
    if (filters.query.length >= 2) {
      const newSuggestions = generateSuggestions(filters.query)
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }, [filters.query, generateSuggestions])

  // Извършване на търсене
  const performSearch = useCallback(async (searchFilters: SearchFilters = filters) => {
    setIsLoading(true)
    
    try {
      // Симулация на забавяне
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Зареждане на задачи от localStorage
      const storedTasks = localStorage.getItem('tasks')
      let allTasks = storedTasks ? JSON.parse(storedTasks) : []
      
      // Прилагане на филтри
      let filteredTasks = allTasks.filter((task: any) => {
        // Филтър по заявка
        if (searchFilters.query && !task.title.toLowerCase().includes(searchFilters.query.toLowerCase()) &&
            !task.description.toLowerCase().includes(searchFilters.query.toLowerCase())) {
          return false
        }
        
        // Филтър по категория
        if (searchFilters.category && task.category !== searchFilters.category) {
          return false
        }
        
        // Филтър по локация
        if (searchFilters.location && task.location !== searchFilters.location) {
          return false
        }
        
        // Филтър по минимална цена
        if (searchFilters.minPrice && task.price < searchFilters.minPrice) {
          return false
        }
        
        // Филтър по максимална цена
        if (searchFilters.maxPrice && task.price > searchFilters.maxPrice) {
          return false
        }
        
        // Филтър по тип цена
        if (searchFilters.priceType && searchFilters.priceType !== 'all' && task.priceType !== searchFilters.priceType) {
          return false
        }
        
        // Филтър по спешност
        if (searchFilters.urgentOnly && !task.urgent) {
          return false
        }
        
        // Филтър по минимален рейтинг
        if (searchFilters.minRating && task.rating < searchFilters.minRating) {
          return false
        }
        
        // Филтър по дата на публикуване
        if (searchFilters.datePosted && searchFilters.datePosted !== 'all') {
          const taskDate = new Date(task.postedDate)
          const now = new Date()
          const diffTime = now.getTime() - taskDate.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          switch (searchFilters.datePosted) {
            case 'today':
              if (diffDays > 1) return false
              break
            case 'week':
              if (diffDays > 7) return false
              break
            case 'month':
              if (diffDays > 30) return false
              break
          }
        }
        
        return true
      })
      
      // Сортиране
      if (searchFilters.sortBy) {
        filteredTasks.sort((a: any, b: any) => {
          let comparison = 0
          
          switch (searchFilters.sortBy) {
            case 'date':
              comparison = new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
              break
            case 'price':
              comparison = b.price - a.price
              break
            case 'rating':
              comparison = b.rating - a.rating
              break
            case 'distance':
              // Тук бихме използвали реално разстояние
              comparison = 0
              break
            case 'relevance':
              // Тук бихме използвали алгоритъм за релевантност
              comparison = 0
              break
          }
          
          return searchFilters.sortOrder === 'asc' ? -comparison : comparison
        })
      }
      
      // Запазване в историята
      const searchHistoryItem: SearchHistory = {
        id: Date.now().toString(),
        query: searchFilters.query,
        filters: searchFilters,
        timestamp: new Date(),
        resultCount: filteredTasks.length
      }
      
      const updatedHistory = [searchHistoryItem, ...searchHistory.slice(0, 9)]
      setSearchHistory(updatedHistory)
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
      
      // Резултат
      const searchResult: SearchResult = {
        tasks: filteredTasks,
        totalCount: filteredTasks.length,
        hasMore: filteredTasks.length > 20,
        suggestions: suggestions,
        filters: searchFilters
      }
      
      setResults(searchResult)
      
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters, suggestions, searchHistory])

  // Запазване на търсене
  const saveSearch = useCallback((name: string, searchFilters: SearchFilters = filters) => {
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters: searchFilters,
      createdAt: new Date(),
      isActive: true,
      notificationEnabled: false
    }
    
    const updatedSearches = [...savedSearches, savedSearch]
    setSavedSearches(updatedSearches)
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches))
  }, [filters, savedSearches])

  // Изтриване на запазено търсене
  const deleteSavedSearch = useCallback((id: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id)
    setSavedSearches(updatedSearches)
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches))
  }, [savedSearches])

  // Зареждане на запазено търсене
  const loadSavedSearch = useCallback((savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters)
    performSearch(savedSearch.filters)
  }, [performSearch])

  // Изчистване на филтрите
  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      category: '',
      location: ''
    })
    setResults(null)
  }, [])

  // Проверка дали има активни филтри
  const hasActiveFilters = useMemo(() => {
    return Boolean(filters.query || 
           filters.category || 
           filters.location || 
           filters.minPrice || 
           filters.maxPrice || 
           filters.urgentOnly || 
           filters.minRating || 
           filters.datePosted !== 'all')
  }, [filters])

  return {
    filters,
    setFilters,
    savedSearches,
    searchHistory,
    suggestions,
    isLoading,
    results,
    performSearch,
    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,
    clearFilters,
    hasActiveFilters
  }
}

