'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Filter, X, SlidersHorizontal, Star, Clock, Zap, Bookmark, BookmarkCheck, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

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
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

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

    // Зареждане на последните търсения
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent.slice(0, 5)) // Показваме само последните 5
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
    
    // Запазване в последните търсения
    if (query.trim()) {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const newRecent = [query.trim(), ...recent.filter((q: string) => q !== query.trim())].slice(0, 10)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
      setRecentSearches(newRecent.slice(0, 5))
    }
    
    onSearch(query, category, location, filters)
  }

  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      toast.error('Моля, въведете име за търсенето')
      return
    }

    const searchData = {
      id: Date.now().toString(),
      name: searchName.trim(),
      query,
      category,
      location,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      urgent: filters.urgent,
      rating: filters.rating,
      datePosted: filters.datePosted,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      useCount: 1
    }

    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    savedSearches.push(searchData)
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))

    setSearchName('')
    setShowSaveSearchModal(false)
    toast.success('Търсенето е запазено успешно')
  }

  const handleQuickFilter = (quickFilter: string) => {
    let newFilters = { ...filters }
    
    switch (quickFilter) {
      case 'urgent':
        newFilters.urgent = !filters.urgent
        break
      case 'today':
        newFilters.datePosted = filters.datePosted === 'today' ? '' : 'today'
        break
      case 'week':
        newFilters.datePosted = filters.datePosted === 'week' ? '' : 'week'
        break
      case 'highRating':
        newFilters.rating = filters.rating === '4' ? '' : '4'
        break
      case 'clear':
        newFilters = {
          priceMin: '',
          priceMax: '',
          urgent: false,
          rating: '',
          datePosted: ''
        }
        break
    }
    
    setFilters(newFilters)
  }

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    onSearch(searchQuery, category, location, filters)
  }

  const clearSearch = () => {
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
    onSearch('', '', '', {})
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
    { value: 'smolyan', label: 'Смолян' },
    { value: 'petrich', label: 'Петрич' },
    { value: 'sandanski', label: 'Сандански' },
    { value: 'gotse-delchev', label: 'Гоце Делчев' },
    { value: 'razlog', label: 'Разлог' },
    { value: 'bansko', label: 'Банско' },
    { value: 'samokov', label: 'Самоков' },
    { value: 'svoge', label: 'Своге' },
    { value: 'radomir', label: 'Радомир' },
    { value: 'breznik', label: 'Брезник' },
    { value: 'tran', label: 'Трън' },
    { value: 'kostenets', label: 'Костенец' },
    { value: 'ikhtiman', label: 'Ихтиман' },
    { value: 'elhin', label: 'Елин Пелин' },
    { value: 'mirkovo', label: 'Мирково' },
    { value: 'dolna-banya', label: 'Долна баня' },
    { value: 'antony', label: 'Антон' },
    { value: 'zlatitsa', label: 'Златица' },
    { value: 'pirdop', label: 'Пирдоп' },
    { value: 'koprivshtitsa', label: 'Копривщица' },
    { value: 'panagyurishte', label: 'Панагюрище' },
    { value: 'strelcha', label: 'Стрелча' },
    { value: 'lesichovo', label: 'Лесичово' },
    { value: 'kaloyanovo', label: 'Калояново' },
    { value: 'saedinenie', label: 'Съединение' },
    { value: 'bratsigovo', label: 'Брацигово' },
    { value: 'krichim', label: 'Кричим' },
    { value: 'perushtitsa', label: 'Перущица' },
    { value: 'sadovo', label: 'Садово' },
    { value: 'parvomay', label: 'Първомай' },
    { value: 'kuklen', label: 'Куклен' },
    { value: 'rodopi', label: 'Родопи' },
    { value: 'maritsa', label: 'Марица' },
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
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Main Search Form - Mobile Optimized */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Input - Full Width Mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Търси задачи, услуги, умения..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-lg"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Filter Chips - Mobile Optimized */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFilter('urgent')}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
                filters.urgent
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Zap size={14} />
              Спешно
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickFilter('today')}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
                filters.datePosted === 'today'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Clock size={14} />
              Днес
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickFilter('week')}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
                filters.datePosted === 'week'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Calendar size={14} />
              Тази седмица
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickFilter('highRating')}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] touch-manipulation ${
                filters.rating === '4'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Star size={14} />
              4+ звезди
            </button>
            
            {(filters.urgent || filters.datePosted || filters.rating) && (
              <button
                type="button"
                onClick={() => handleQuickFilter('clear')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors min-h-[40px] touch-manipulation"
              >
                <X size={14} />
                Изчисти
              </button>
            )}
          </div>

          {/* Recent Searches - Mobile Optimized */}
          {recentSearches.length > 0 && !query && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Последни търсения:</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRecentSearchClick(search)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors min-h-[40px] touch-manipulation"
                  >
                    <Search size={14} />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filters Toggle - Mobile Optimized */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors min-h-[44px] touch-manipulation"
            >
              <SlidersHorizontal size={16} />
              Разширени филтри
            </button>
            
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors min-h-[44px] px-3 touch-manipulation"
            >
              Изчисти всичко
            </button>
          </div>

          {/* Advanced Filters - Mobile Optimized */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категория
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Локация
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Минимален рейтинг
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                >
                  <option value="">Всички</option>
                  <option value="4">4+ звезди</option>
                  <option value="4.5">4.5+ звезди</option>
                  <option value="5">5 звезди</option>
                </select>
              </div>
            </div>
          )}

          {/* Search Button - Mobile Optimized */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] touch-manipulation"
          >
            Търси задачи
          </button>
        </form>
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
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
                onClick={() => setShowSaveSearchModal(false)}
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