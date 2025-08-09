'use client'

import { useState } from 'react'
import { SearchFilters } from '@/types/search'
import { 
  Filter, 
  X, 
  DollarSign, 
  Calendar, 
  Star, 
  MapPin, 
  Clock,
  Zap,
  CheckCircle,
  SortAsc,
  SortDesc
} from 'lucide-react'

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export default function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  onClear, 
  hasActiveFilters 
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const priceRanges = [
    { label: 'Всички цени', min: undefined, max: undefined },
    { label: 'До 50 лв', min: undefined, max: 50 },
    { label: '50-100 лв', min: 50, max: 100 },
    { label: '100-200 лв', min: 100, max: 200 },
    { label: '200-500 лв', min: 200, max: 500 },
    { label: 'Над 500 лв', min: 500, max: undefined }
  ]

  const dateOptions = [
    { value: 'all', label: 'Всички дати' },
    { value: 'today', label: 'Днес' },
    { value: 'week', label: 'Последната седмица' },
    { value: 'month', label: 'Последния месец' }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Релевантност' },
    { value: 'date', label: 'Дата' },
    { value: 'price', label: 'Цена' },
    { value: 'rating', label: 'Рейтинг' },
    { value: 'distance', label: 'Разстояние' }
  ]

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.category) count++
    if (filters.location) count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.urgentOnly) count++
    if (filters.minRating) count++
    if (filters.datePosted && filters.datePosted !== 'all') count++
    if (filters.priceType && filters.priceType !== 'all') count++
    return count
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Филтри
            </h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
              >
                <X size={14} />
                <span>Изчисти</span>
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {isExpanded ? 'Скрий' : 'Покажи'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Цена */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <DollarSign size={16} className="text-green-500" />
              <span>Цена</span>
            </h4>
            
            <div className="space-y-3">
              {/* Тип цена */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Тип цена
                </label>
                <select
                  value={filters.priceType || 'all'}
                  onChange={(e) => handleFilterChange('priceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Всички типове</option>
                  <option value="hourly">На час</option>
                  <option value="fixed">Фиксирана цена</option>
                </select>
              </div>

              {/* Диапазон цена */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Диапазон цена
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Дата */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <Calendar size={16} className="text-blue-500" />
              <span>Дата на публикуване</span>
            </h4>
            
            <select
              value={filters.datePosted || 'all'}
              onChange={(e) => handleFilterChange('datePosted', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Спешност */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <Zap size={16} className="text-yellow-500" />
              <span>Спешност</span>
            </h4>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.urgentOnly || false}
                onChange={(e) => handleFilterChange('urgentOnly', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Само спешни задачи
              </span>
            </label>
          </div>

          {/* Рейтинг */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <Star size={16} className="text-yellow-500" />
              <span>Минимален рейтинг</span>
            </h4>
            
            <select
              value={filters.minRating || 0}
              onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={0}>Всички рейтинги</option>
              <option value={3}>3+ звезди</option>
              <option value={4}>4+ звезди</option>
              <option value={4.5}>4.5+ звезди</option>
            </select>
          </div>

          {/* Верификация */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Верификация</span>
            </h4>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.verifiedOnly || false}
                onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Само верифицирани изпълнители
              </span>
            </label>
          </div>

          {/* Сортиране */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <SortAsc size={16} className="text-purple-500" />
              <span>Сортиране</span>
            </h4>
            
            <div className="space-y-2">
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('sortOrder', 'asc')}
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    filters.sortOrder === 'asc'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <SortAsc size={14} className="inline mr-1" />
                  Възходящо
                </button>
                <button
                  onClick={() => handleFilterChange('sortOrder', 'desc')}
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    filters.sortOrder === 'desc'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <SortDesc size={14} className="inline mr-1" />
                  Низходящо
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

