export interface SearchFilters {
  // Основни филтри
  query: string
  category: string
  location: string
  
  // Цена и бюджет
  minPrice?: number
  maxPrice?: number
  priceType?: 'hourly' | 'fixed' | 'all'
  
  // Дата и време
  datePosted?: 'today' | 'week' | 'month' | 'all'
  urgentOnly?: boolean
  
  // Рейтинг и верификация
  minRating?: number
  verifiedOnly?: boolean
  
  // Разстояние и локация
  radius?: number // в км
  exactLocation?: boolean
  
  // Допълнителни филтри
  hasAttachments?: boolean
  hasApplications?: boolean
  sortBy?: 'date' | 'price' | 'rating' | 'distance' | 'relevance'
  sortOrder?: 'asc' | 'desc'
  
  // Запазени търсения
  savedSearchId?: string
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: Date
  isActive: boolean
  notificationEnabled: boolean
}

export interface SearchSuggestion {
  id: string
  text: string
  type: 'category' | 'location' | 'keyword' | 'tag'
  count?: number
  relevance: number
}

export interface SearchResult {
  tasks: any[]
  totalCount: number
  hasMore: boolean
  suggestions: SearchSuggestion[]
  filters: SearchFilters
}

export interface SearchHistory {
  id: string
  query: string
  filters: Partial<SearchFilters>
  timestamp: Date
  resultCount: number
}

export interface PopularSearches {
  category: string
  searches: {
    query: string
    count: number
  }[]
}

