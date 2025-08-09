'use client'

import { useState } from 'react'
import { SavedSearch } from '@/types/search'
import { 
  Bookmark, 
  Search, 
  Clock, 
  Bell, 
  Trash2, 
  Plus,
  X
} from 'lucide-react'

interface SavedSearchesProps {
  savedSearches: SavedSearch[]
  onLoadSearch: (search: SavedSearch) => void
  onDeleteSearch: (id: string) => void
  onSaveSearch: (name: string, filters: any) => void
  currentFilters: any
}

export default function SavedSearches({ 
  savedSearches, 
  onLoadSearch, 
  onDeleteSearch, 
  onSaveSearch,
  currentFilters 
}: SavedSearchesProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [searchName, setSearchName] = useState('')

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      onSaveSearch(searchName.trim(), currentFilters)
      setSearchName('')
      setShowSaveModal(false)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'днес'
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `${diffDays} дни назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} седмици назад`
    return date.toLocaleDateString('bg-BG')
  }

  const getFilterSummary = (filters: any) => {
    const parts = []
    
    if (filters.query) parts.push(`"${filters.query}"`)
    if (filters.category) parts.push(filters.category)
    if (filters.location) parts.push(filters.location)
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = []
      if (filters.minPrice) priceRange.push(`от ${filters.minPrice} лв`)
      if (filters.maxPrice) priceRange.push(`до ${filters.maxPrice} лв`)
      parts.push(priceRange.join(' '))
    }
    if (filters.urgentOnly) parts.push('спешни')
    if (filters.minRating) parts.push(`${filters.minRating}+ звезди`)
    
    return parts.length > 0 ? parts.join(', ') : 'Всички задачи'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Запазени търсения
            </h3>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              {savedSearches.length}
            </span>
          </div>
          
          <button
            onClick={() => setShowSaveModal(true)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center space-x-1"
          >
            <Plus size={14} />
            <span>Запази</span>
          </button>
        </div>
      </div>

      {/* Saved Searches List */}
      <div className="p-4">
        {savedSearches.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Нямате запазени търсения
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Запазете често използваните филтри за бърз достъп
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {search.name}
                      </h4>
                      {search.notificationEnabled && (
                        <Bell size={14} className="text-yellow-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {getFilterSummary(search.filters)}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDate(search.createdAt)}</span>
                      </div>
                      {search.isActive && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                          Активно
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-3">
                    <button
                      onClick={() => onLoadSearch(search)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title="Зареди търсене"
                    >
                      <Search size={16} />
                    </button>
                    
                    <button
                      onClick={() => onDeleteSearch(search.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Изтрий търсене"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Запази търсене
                </h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Име на търсене
                  </label>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Напр. Спешни задачи в София"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Текущи филтри:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {getFilterSummary(currentFilters)}
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Отказ
                  </button>
                  <button
                    onClick={handleSaveSearch}
                    disabled={!searchName.trim()}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Запази
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

