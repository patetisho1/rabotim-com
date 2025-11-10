'use client'

import { useState } from 'react'
import { Search, MapPin, Filter } from 'lucide-react'

interface SearchSectionProps {
  onSearch: (query: string, category: string, location: string) => void
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  const categories = [
    'Всички категории',
    'Почистване',
    'Ремонт',
    'Преместване',
    'Градинарство',
    'Обучение',
    'IT услуги',
    'Сглобяване',
    'Друго'
  ]

  const locations = [
    'Всички локации',
    'София',
    'Пловдив',
    'Варна',
    'Бургас',
    'Русе',
    'Стара Загора',
    'Плевен',
    'Други'
  ]

  const handleSearch = () => {
    onSearch(query, category, location)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Намерете перфектната услуга
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Свържете се с надеждни изпълнители за всички ваши нужди
        </p>
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Какво търсите? (например: почистване, ремонт, градинарство...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'Всички категории' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc === 'Всички локации' ? '' : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Search className="h-5 w-5" />
          Търси услуги
        </button>
      </div>
    </div>
  )
}