'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Filter, X, SlidersHorizontal, Star, Clock, Zap } from 'lucide-react'

interface SearchSectionProps {
  onSearch: (query: string, category: string, location: string, filters: any) => void
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    urgent: false,
    rating: '',
    datePosted: ''
  })

  // Зареждане на запазени филтри от localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('searchFilters')
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters)
      setQuery(parsed.query || '')
      setCategory(parsed.category || '')
      setLocation(parsed.location || '')
      setFilters(parsed.filters || {})
    }
  }, [])

  // Запазване на филтри в localStorage
  const saveFilters = () => {
    const filtersToSave = {
      query,
      category,
      location,
      filters
    }
    localStorage.setItem('searchFilters', JSON.stringify(filtersToSave))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveFilters()
    onSearch(query, category, location, filters)
  }

  const handleQuickFilter = (quickFilter: string) => {
    let newFilters = { ...filters }
    
    switch (quickFilter) {
      case 'urgent':
        newFilters.urgent = !filters.urgent
        break
      case 'today':
        newFilters.datePosted = 'today'
        break
      case 'week':
        newFilters.datePosted = 'week'
        break
      case 'highRating':
        newFilters.rating = '4'
        break
      case 'lowPrice':
        newFilters.priceMax = '50'
        break
    }
    
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setLocation('')
    setFilters({
      priceMin: '',
      priceMax: '',
      urgent: false,
      rating: '',
      datePosted: ''
    })
    localStorage.removeItem('searchFilters')
  }

  const categories = [
    { value: '', label: 'Всички категории' },
    { value: 'repair', label: 'Ремонт', icon: '🔧' },
    { value: 'cleaning', label: 'Почистване', icon: '🧹' },
    { value: 'care', label: 'Грижа', icon: '👥' },
    { value: 'delivery', label: 'Доставка', icon: '📦' },
    { value: 'moving', label: 'Преместване', icon: '🚚' },
    { value: 'garden', label: 'Градинарство', icon: '🌱' },
    { value: 'dog-care', label: 'Разходка/грижа за куче', icon: '🐕' },
    { value: 'packaging', label: 'Опаковане', icon: '📦' },
    { value: 'other', label: 'Друго', icon: '📋' },
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
  ]

  const quickFilters = [
    { key: 'urgent', label: 'Спешни', icon: Zap, active: filters.urgent },
    { key: 'today', label: 'Днес', icon: Clock, active: filters.datePosted === 'today' },
    { key: 'week', label: 'Тази седмица', icon: Clock, active: filters.datePosted === 'week' },
    { key: 'highRating', label: 'Висок рейтинг', icon: Star, active: filters.rating === '4' },
    { key: 'lowPrice', label: 'До 50лв', icon: MapPin, active: filters.priceMax === '50' },
  ]

  const hasActiveFilters = query || category || location || 
    filters.priceMin || filters.priceMax || filters.urgent || 
    filters.rating || filters.datePosted

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Какво търсите? (напр. почистване, ремонт, доставка)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input pl-10 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon ? `${cat.icon} ${cat.label}` : cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input pl-10 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {locations.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickFilters.map((filter) => {
            const IconComponent = filter.icon
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleQuickFilter(filter.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter.active
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <IconComponent size={16} />
                {filter.label}
              </button>
            )
          })}
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <SlidersHorizontal size={16} />
            {showAdvancedFilters ? 'Скрий' : 'Покажи'} разширени филтри
          </button>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X size={16} />
              Изчисти филтри
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Цена (лв)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    className="input text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    className="input text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Минимален рейтинг
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  className="input text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                  <option value="">Всички</option>
                  <option value="4">4+ звезди</option>
                  <option value="3">3+ звезди</option>
                  <option value="2">2+ звезди</option>
                </select>
              </div>

              {/* Date Posted */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Публикувана
                </label>
                <select
                  value={filters.datePosted}
                  onChange={(e) => setFilters({...filters, datePosted: e.target.value})}
                  className="input text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                  <option value="">Всички</option>
                  <option value="today">Днес</option>
                  <option value="week">Тази седмица</option>
                  <option value="month">Този месец</option>
                </select>
              </div>

              {/* Urgent Only */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.urgent}
                    onChange={(e) => setFilters({...filters, urgent: e.target.checked})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                  Само спешни
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full btn btn-primary text-lg py-3"
          >
            <Search size={20} className="inline mr-2" />
            Търси задачи
          </button>
        </div>
      </form>
    </div>
  )
} 