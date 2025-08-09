'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AdvancedSearchSection from '@/components/AdvancedSearchSection'
import TaskGrid from '@/components/TaskGrid'
import { Search, Filter, TrendingUp, Clock, Star } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  // Зареждане на начални параметри от URL
  useEffect(() => {
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const location = searchParams.get('location') || ''
    
    if (query || category || location) {
      // Тук бихме извършили търсене с параметрите от URL
      console.log('Initial search params:', { query, category, location })
    }
  }, [searchParams])

  const handleSearch = (results: any) => {
    setSearchResults(results.tasks || [])
    setTotalResults(results.totalCount || 0)
  }

  const popularSearches = [
    { query: 'почистване', category: 'cleaning', count: 45 },
    { query: 'ремонт', category: 'repair', count: 32 },
    { query: 'доставка', category: 'delivery', count: 28 },
    { query: 'градинарство', category: 'garden', count: 23 },
    { query: 'преместване', category: 'moving', count: 19 },
    { query: 'грижа за куче', category: 'dog-care', count: 15 }
  ]

  const recentSearches = [
    { query: 'почистване в София', timestamp: '2 часа назад' },
    { query: 'ремонт на компютър', timestamp: 'вчера' },
    { query: 'доставка храни', timestamp: '3 дни назад' },
    { query: 'градинарски услуги', timestamp: '1 седмица назад' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Разширено търсене
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Намерете перфектната задача с нашите мощни филтри и предложения
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Advanced Search Section */}
            <AdvancedSearchSection onSearch={handleSearch} />

            {/* Search Results */}
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Търсене...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Резултати от търсенето
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalResults} намерени задачи
                  </p>
                </div>
                <TaskGrid tasks={searchResults} />
              </div>
            ) : totalResults === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                <Search size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Няма намерени резултати
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Опитайте да промените филтрите или ключовите думи
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Изчисти филтрите
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Searches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <TrendingUp size={16} className="text-blue-500" />
                <span>Популярни търсения</span>
              </h3>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {search.query}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {search.count} задачи
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <Clock size={16} className="text-green-500" />
                <span>Последни търсения</span>
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {search.query}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {search.timestamp}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <Star size={16} className="text-yellow-500" />
                <span>Съвети за търсене</span>
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Използвайте конкретни ключови думи</p>
                <p>• Филтрирайте по локация за по-точни резултати</p>
                <p>• Запазете често използваните търсения</p>
                <p>• Използвайте разширените филтри за по-добри резултати</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

