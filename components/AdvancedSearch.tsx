'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Calendar, DollarSign, X } from 'lucide-react'

interface SearchFilters {
  query: string
  category: string
  location: string
  priceMin: string
  priceMax: string
  date: string
  urgent: boolean
  rating: string
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
}

export default function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
    date: '',
    urgent: false,
    rating: ''
  })

  const categories = [
    { value: '', label: 'Всички категории' },
    { value: 'repair', label: 'Ремонт' },
    { value: 'cleaning', label: 'Почистване' },
    { value: 'care', label: 'Грижа' },
    { value: 'delivery', label: 'Доставка' },
    { value: 'moving', label: 'Преместване' },
    { value: 'garden', label: 'Градинарство' },
    { value: 'dog-care', label: 'Разходка/грижа за куче' },
    { value: 'packaging', label: 'Опаковане' },
    { value: 'other', label: 'Друго' },
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

  const ratings = [
    { value: '', label: 'Всички рейтинги' },
    { value: '4.5', label: '4.5+ звезди' },
    { value: '4.0', label: '4.0+ звезди' },
    { value: '3.5', label: '3.5+ звезди' },
  ]

  const handleInputChange = (field: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      priceMin: '',
      priceMax: '',
      date: '',
      urgent: false,
      rating: ''
    })
    onClear()
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  )

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Basic Search */}
                 <div className="flex gap-4 mb-4">
                      <div className="flex-1">
              <input
                type="text"
                placeholder="Търси задачи..."
                value={filters.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Filter size={16} />
            Филтри
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
            )}
          </button>
          
          <button
            onClick={handleSearch}
            className="btn btn-primary"
          >
            Търси
          </button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                             {/* Category */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Категория
                 </label>
                 <select
                   value={filters.category}
                   onChange={(e) => handleInputChange('category', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                 >
                   {categories.map((cat) => (
                     <option key={cat.value} value={cat.value}>
                       {cat.label}
                     </option>
                   ))}
                 </select>
               </div>

               {/* Location */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Локация
                 </label>
                 <select
                   value={filters.location}
                   onChange={(e) => handleInputChange('location', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                 >
                   {locations.map((loc) => (
                     <option key={loc.value} value={loc.value}>
                       {loc.label}
                     </option>
                   ))}
                 </select>
               </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (лв/час)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.priceMin}
                    onChange={(e) => handleInputChange('priceMin', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.priceMax}
                    onChange={(e) => handleInputChange('priceMax', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

                             {/* Rating */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Минимален рейтинг
                 </label>
                 <select
                   value={filters.rating}
                   onChange={(e) => handleInputChange('rating', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                 >
                   {ratings.map((rating) => (
                     <option key={rating.value} value={rating.value}>
                       {rating.label}
                     </option>
                   ))}
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Urgent */}
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.urgent}
                    onChange={(e) => handleInputChange('urgent', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Само спешни задачи
                  </span>
                </label>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {hasActiveFilters ? 'Активни филтри' : 'Няма активни филтри'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="btn btn-outline text-sm flex items-center gap-2"
                >
                  <X size={14} />
                  Изчисти всички
                </button>
                <button
                  onClick={handleSearch}
                  className="btn btn-primary text-sm"
                >
                  Приложи филтри
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 