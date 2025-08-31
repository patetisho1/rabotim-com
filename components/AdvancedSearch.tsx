'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, MapPin, DollarSign, Star, Clock, Calendar, SlidersHorizontal, Save, Loader2 } from 'lucide-react'

interface SearchFilters {
  query: string
  category: string
  location: string
  priceMin: number | ''
  priceMax: number | ''
  rating: number | ''
  datePosted: string
  urgent: boolean
  hasImages: boolean
  verifiedUsers: boolean
  sortBy: string
  radius: number
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onSaveSearch?: (name: string, filters: SearchFilters) => void
  onLoadSearch?: (filters: SearchFilters) => void
  className?: string
}

export default function AdvancedSearch({
  onSearch,
  onSaveSearch,
  onLoadSearch,
  className = ''
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
    rating: '',
    datePosted: '',
    urgent: false,
    hasImages: false,
    verifiedUsers: false,
    sortBy: 'relevance',
    radius: 10
  })
  
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; filters: SearchFilters }>>([])

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    setSavedSearches(saved)
  }, [])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      await onSearch(filters)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSearch = () => {
    if (!searchName.trim()) return
    
    const newSavedSearch = { name: searchName.trim(), filters }
    const updated = [newSavedSearch, ...savedSearches.filter(s => s.name !== searchName.trim())]
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
    
    onSaveSearch?.(searchName.trim(), filters)
    setSearchName('')
    setShowSaveModal(false)
  }

  const handleLoadSearch = (savedSearch: { name: string; filters: SearchFilters }) => {
    setFilters(savedSearch.filters)
    onLoadSearch?.(savedSearch.filters)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      priceMin: '',
      priceMax: '',
      rating: '',
      datePosted: '',
      urgent: false,
      hasImages: false,
      verifiedUsers: false,
      sortBy: 'relevance',
      radius: 10
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false && value !== 'relevance' && value !== 10
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Търси задачи, услуги, умения..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
        />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('urgent', !filters.urgent)}
          className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
            filters.urgent
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Clock size={14} />
          Спешно
        </button>
        
        <button
          onClick={() => handleFilterChange('hasImages', !filters.hasImages)}
          className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
            filters.hasImages
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Star size={14} />
          Със снимки
        </button>
        
        <button
          onClick={() => handleFilterChange('verifiedUsers', !filters.verifiedUsers)}
          className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
            filters.verifiedUsers
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Star size={14} />
          Верифицирани
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Разширени филтри
            </h3>
            <button
              onClick={() => setShowAdvanced(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Категория
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
              >
                <option value="">Всички категории</option>
                <option value="cleaning">Почистване</option>
                <option value="handyman">Майсторски услуги</option>
                <option value="transport">Транспорт</option>
                <option value="design">Дизайн</option>
                <option value="education">Обучение</option>
                <option value="it">IT услуги</option>
                <option value="gardening">Градинарство</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Локация
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
              >
                <option value="">Всички локации</option>
                <option value="sofia">София</option>
                <option value="plovdiv">Пловдив</option>
                <option value="varna">Варна</option>
                <option value="burgas">Бургас</option>
                <option value="ruse">Русе</option>
              </select>
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Радиус (км)
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.radius}
                onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filters.radius} км
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Цена (лв)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : '')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : '')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Минимален рейтинг
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
              >
                <option value="">Всички</option>
                <option value="4">4+ звезди</option>
                <option value="4.5">4.5+ звезди</option>
                <option value="5">5 звезди</option>
              </select>
            </div>

            {/* Date Posted */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Публикувана
              </label>
              <select
                value={filters.datePosted}
                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
              >
                <option value="">Всички</option>
                <option value="today">Днес</option>
                <option value="week">Тази седмица</option>
                <option value="month">Този месец</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Подреди по
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
              >
                <option value="relevance">Релевантност</option>
                <option value="date">Дата</option>
                <option value="price_low">Цена (ниска)</option>
                <option value="price_high">Цена (висока)</option>
                <option value="rating">Рейтинг</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Търсене...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Търси
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg font-medium transition-colors min-h-[48px] touch-manipulation"
            >
              <Save size={18} />
            </button>
            
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg font-medium transition-colors min-h-[48px] touch-manipulation"
            >
              Изчисти
            </button>
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Запазени търсения
          </h4>
          <div className="flex flex-wrap gap-2">
            {savedSearches.slice(0, 5).map((saved, index) => (
              <button
                key={index}
                onClick={() => handleLoadSearch(saved)}
                className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors min-h-[40px] touch-manipulation"
              >
                <Filter size={14} />
                {saved.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Запази търсене</h3>
            <input
              type="text"
              placeholder="Име на търсенето"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Запази
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Отказ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 