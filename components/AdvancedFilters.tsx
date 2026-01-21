'use client'

import { useState, useEffect } from 'react'
import { 
  Filter, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Tag,
  X,
  SlidersHorizontal
} from 'lucide-react'

interface FilterOptions {
  search: string
  category: string
  location: string
  priceRange: {
    min: number
    max: number
  }
  priceType: 'all' | 'hourly' | 'fixed'
  urgency: 'all' | 'low' | 'medium' | 'high'
  datePosted: 'all' | 'today' | 'week' | 'month'
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'urgent'
  isRemote: boolean
  hasImages: boolean
  verifiedOnly: boolean
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  isOpen: boolean
  onToggle: () => void
}

const categories = [
  { id: 'all', name: 'Всички категории' },
  { id: 'repair', name: 'Ремонт и поддръжка' },
  { id: 'cleaning', name: 'Почистване' },
  { id: 'care', name: 'Грижа и помощ' },
  { id: 'delivery', name: 'Доставка' },
  { id: 'garden', name: 'Градинарство' },
  { id: 'transport', name: 'Транспорт' },
  { id: 'education', name: 'Обучение' },
  { id: 'other', name: 'Други' }
]

const locations = [
  { id: 'all', name: 'Всички градове' },
  { id: 'sofia', name: 'София' },
  { id: 'plovdiv', name: 'Пловдив' },
  { id: 'varna', name: 'Варна' },
  { id: 'burgas', name: 'Бургас' },
  { id: 'ruse', name: 'Русе' },
  { id: 'stara-zagora', name: 'Стара Загора' },
  { id: 'pleven', name: 'Плевен' },
  { id: 'sliven', name: 'Сливен' },
  { id: 'dobrich', name: 'Добрич' },
  { id: 'shumen', name: 'Шумен' }
]

const sortOptions = [
  { id: 'newest', name: 'Най-нови' },
  { id: 'oldest', name: 'Най-стари' },
  { id: 'price-low', name: 'Цена (ниска → висока)' },
  { id: 'price-high', name: 'Цена (висока → ниска)' },
  { id: 'urgent', name: 'Спешни първи' }
]

const dateOptions = [
  { id: 'all', name: 'Всички дати' },
  { id: 'today', name: 'Днес' },
  { id: 'week', name: 'Последната седмица' },
  { id: 'month', name: 'Последния месец' }
]

export default function AdvancedFilters({ onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    location: 'all',
    priceRange: {
      min: 0,
      max: 10000
    },
    priceType: 'all',
    urgency: 'all',
    datePosted: 'all',
    sortBy: 'newest',
    isRemote: false,
    hasImages: false,
    verifiedOnly: false
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    onFiltersChange(filters)
    
    // Обновяваме активните филтри
    const active: string[] = []
    if (filters.search) active.push(`Търсене: "${filters.search}"`)
    if (filters.category !== 'all') {
      const cat = categories.find(c => c.id === filters.category)
      if (cat) active.push(cat.name)
    }
    if (filters.location !== 'all') {
      const loc = locations.find(l => l.id === filters.location)
      if (loc) active.push(loc.name)
    }
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) {
      active.push(`Цена: ${filters.priceRange.min}-${filters.priceRange.max} €`)
    }
    if (filters.priceType !== 'all') {
      active.push(filters.priceType === 'hourly' ? 'На час' : 'Фиксирана')
    }
    if (filters.urgency !== 'all') {
      const urgencyMap = { low: 'Не е спешно', medium: 'Средна спешност', high: 'Много спешно' }
      active.push(urgencyMap[filters.urgency])
    }
    if (filters.datePosted !== 'all') {
      const dateMap = { today: 'Днес', week: 'Седмица', month: 'Месец' }
      active.push(dateMap[filters.datePosted])
    }
    if (filters.isRemote) active.push('От разстояние')
    if (filters.hasImages) active.push('Със снимки')
    if (filters.verifiedOnly) active.push('Верифицирани')
    
    setActiveFilters(active)
  }, [filters, onFiltersChange])

  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value
      }
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
      priceRange: {
        min: 0,
        max: 10000
      },
      priceType: 'all',
      urgency: 'all',
      datePosted: 'all',
      sortBy: 'newest',
      isRemote: false,
      hasImages: false,
      verifiedOnly: false
    })
  }

  const removeFilter = (filterText: string) => {
    // Намираме и премахваме филтъра
    if (filterText.includes('Търсене:')) {
      handleFilterChange('search', '')
    } else if (filterText.includes('Цена:')) {
      handleFilterChange('priceRange', { min: 0, max: 10000 })
    } else if (filterText === 'На час' || filterText === 'Фиксирана') {
      handleFilterChange('priceType', 'all')
    } else if (filterText === 'От разстояние') {
      handleFilterChange('isRemote', false)
    } else if (filterText === 'Със снимки') {
      handleFilterChange('hasImages', false)
    } else if (filterText === 'Верифицирани') {
      handleFilterChange('verifiedOnly', false)
    } else {
      // За категория и локация
      const category = categories.find(c => c.name === filterText)
      if (category) {
        handleFilterChange('category', 'all')
      } else {
        const location = locations.find(l => l.name === filterText)
        if (location) {
          handleFilterChange('location', 'all')
        }
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Разширени филтри
            </h3>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Активни филтри:
            </span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              Изчисти всички
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters Content */}
      <div className="p-4 space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Търсене
          </label>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Търси в заглавия и описания..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Категория
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Локация
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ценови диапазон (€)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                placeholder="От"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                placeholder="До"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Price Type and Urgency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тип на заплащането
            </label>
            <select
              value={filters.priceType}
              onChange={(e) => handleFilterChange('priceType', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Всички</option>
              <option value="hourly">На час</option>
              <option value="fixed">Фиксирана сума</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Спешност
            </label>
            <select
              value={filters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Всички</option>
              <option value="low">Не е спешно</option>
              <option value="medium">Средна спешност</option>
              <option value="high">Много спешно</option>
            </select>
          </div>
        </div>

        {/* Date Posted and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Публикувана
            </label>
            <select
              value={filters.datePosted}
              onChange={(e) => handleFilterChange('datePosted', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {dateOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Подреди по
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Допълнителни филтри
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isRemote}
                onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Може да се извърши от разстояние
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasImages}
                onChange={(e) => handleFilterChange('hasImages', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Само задачи със снимки
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Само от верифицирани потребители
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

