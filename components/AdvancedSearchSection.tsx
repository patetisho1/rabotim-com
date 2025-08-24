'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, MapPin, ChevronDown, X, Clock, History, Zap, Star } from 'lucide-react'
import { SearchSuggestion } from '@/types/search'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import AdvancedFilters from './AdvancedFilters'
import SavedSearches from './SavedSearches'

interface AdvancedSearchSectionProps {
  onSearch: (results: any) => void
  className?: string
}

export default function AdvancedSearchSection({ onSearch, className = '' }: AdvancedSearchSectionProps) {
  const {
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
  } = useAdvancedSearch()

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: '', label: 'Всички категории' },
    { value: 'cleaning', label: 'Почистване', icon: '🧹' },
    { value: 'repair', label: 'Ремонт', icon: '🔧' },
    { value: 'garden', label: 'Градинарство', icon: '🌱' },
    { value: 'delivery', label: 'Доставка', icon: '📦' },
    { value: 'moving', label: 'Преместване', icon: '🚚' },
    { value: 'care', label: 'Грижа', icon: '👥' },
    { value: 'dog-care', label: 'Разходка/грижа за куче', icon: '🐕' },
    { value: 'packaging', label: 'Опаковане', icon: '📦' },
    { value: 'other', label: 'Друго', icon: '📋' }
  ]

  const locations = [
    { value: '', label: 'Всички локации' },
    { value: 'sofia', label: 'София' },
    { value: 'plovdiv', label: 'Пловдив' },
    { value: 'varna', label: 'Варна' },
    { value: 'burgas', label: 'Бургас' },
    { value: 'ruse', label: 'Русе' },
    { value: 'stara-zagora', label: 'Стара Загора' },
    { value: 'pleven', label: 'Плевен' },
    { value: 'sliven', label: 'Сливен' },
    { value: 'dobrich', label: 'Добрич' },
    { value: 'shumen', label: 'Шумен' },
    { value: 'pernik', label: 'Перник' },
    { value: 'haskovo', label: 'Хасково' },
    { value: 'yambol', label: 'Ямбол' },
    { value: 'pazardzhik', label: 'Пазарджик' },
    { value: 'blagoevgrad', label: 'Благоевград' },
    { value: 'veliko-tarnovo', label: 'Велико Търново' },
    { value: 'vratsa', label: 'Враца' },
    { value: 'gabrovo', label: 'Габрово' },
    { value: 'vidin', label: 'Видин' },
    { value: 'kardzhali', label: 'Кърджали' },
    { value: 'kyustendil', label: 'Кюстендил' },
    { value: 'montana', label: 'Монтана' },
    { value: 'lovech', label: 'Ловеч' },
    { value: 'razgrad', label: 'Разград' },
    { value: 'silistra', label: 'Силистра' },
    { value: 'targovishte', label: 'Търговище' },
    { value: 'smolyan', label: 'Смолян' }
  ]

  const quickFilters = [
    { key: 'urgentOnly', label: 'Спешни', icon: Zap, color: 'text-red-500' },
    { key: 'today', label: 'Днес', icon: Clock, color: 'text-blue-500' },
    { key: 'highRating', label: '4+ звезди', icon: Star, color: 'text-yellow-500' },
    { key: 'lowPrice', label: 'До 50 лв', icon: MapPin, color: 'text-green-500' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
    setShowSuggestions(false)
    setShowHistory(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'category':
        setFilters(prev => ({ ...prev, category: suggestion.text.toLowerCase() }))
        break
      case 'location':
        setFilters(prev => ({ ...prev, location: suggestion.text.toLowerCase() }))
        break
      case 'keyword':
      case 'tag':
        setFilters(prev => ({ ...prev, query: suggestion.text }))
        break
    }
    setShowSuggestions(false)
    performSearch()
  }

  const handleHistoryClick = (historyItem: any) => {
    setFilters(historyItem.filters)
    setShowHistory(false)
    performSearch()
  }

  const handleQuickFilter = (filterKey: string) => {
    let newFilters = { ...filters }
    
    switch (filterKey) {
      case 'urgentOnly':
        newFilters.urgentOnly = !filters.urgentOnly
        break
      case 'today':
        newFilters.datePosted = 'today'
        break
      case 'highRating':
        newFilters.minRating = 4
        break
      case 'lowPrice':
        newFilters.maxPrice = 50
        break
    }
    
    setFilters(newFilters)
    performSearch(newFilters)
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'category':
        return '🏷️'
      case 'location':
        return '📍'
      case 'keyword':
        return '🔍'
      case 'tag':
        return '🏷️'
      default:
        return '💡'
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Search Input with Suggestions */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Какво търсите? (напр. почистване, ремонт, доставка)"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              onFocus={() => {
                if (filters.query.length >= 2) setShowSuggestions(true)
                setShowHistory(true)
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false)
                  setShowHistory(false)
                }, 200)
              }}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {suggestion.text}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.type === 'category' && `${suggestion.count} задачи`}
                      {suggestion.type === 'location' && `${suggestion.count} задачи`}
                      {suggestion.type === 'keyword' && 'Ключова дума'}
                      {suggestion.type === 'tag' && 'Таг'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* History Dropdown */}
          {showHistory && searchHistory.length > 0 && !showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <History size={14} />
                  <span>Последни търсения</span>
                </div>
              </div>
              {searchHistory.map((historyItem) => (
                <button
                  key={historyItem.id}
                  type="button"
                  onClick={() => handleHistoryClick(historyItem)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <Clock size={16} className="text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {historyItem.query || 'Търсене без заявка'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {historyItem.resultCount} резултата • {historyItem.timestamp.toLocaleDateString('bg-BG')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon ? `${cat.icon} ${cat.label}` : cat.label}
              </option>
            ))}
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {locations.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map((filter) => {
            const Icon = filter.icon
            const isActive = 
              (filter.key === 'urgentOnly' && filters.urgentOnly) ||
              (filter.key === 'today' && filters.datePosted === 'today') ||
              (filter.key === 'highRating' && filters.minRating === 4) ||
              (filter.key === 'lowPrice' && filters.maxPrice === 50)

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleQuickFilter(filter.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <Icon size={14} className={filter.color} />
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Търсене...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Търси</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter size={18} />
            <span>Разширени филтри</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Запазени</span>
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      )}

      {/* Saved Searches */}
      {showSavedSearches && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <SavedSearches />
        </div>
      )}

      {/* Results Summary */}
      {results && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Намерени {results.totalCount} резултата
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Изчисти филтрите
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

