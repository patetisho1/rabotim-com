'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign, Star, Eye, MessageCircle, Calendar, User, Tag, Grid, List, SlidersHorizontal } from 'lucide-react'
import TaskCard from '@/components/TaskCard'
import SearchSection from '@/components/SearchSection'
import TouchGestures, { useDeviceCapabilities, useOrientation } from '@/components/TouchGestures'

interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  priceType: 'hourly' | 'fixed'
  urgent: boolean
  rating: number
  reviewCount: number
  postedBy: string
  postedDate: string
  views: number
  applications: number
  attachments?: Attachment[]
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [ratingFilter, setRatingFilter] = useState(0)
  
  const capabilities = useDeviceCapabilities()
  const orientation = useOrientation()

  // Auto-switch to list view on mobile
  useEffect(() => {
    if (capabilities.isMobile) {
      setViewMode('list')
    }
  }, [capabilities.isMobile])

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, sortBy, selectedCategory, priceRange, urgentOnly, ratingFilter])

  const loadTasks = () => {
    setLoading(true)
    
    // Simulate loading
    setTimeout(() => {
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Почистване на апартамент',
          description: 'Търся надежден човек за почистване на 3-стаен апартамент. Работата включва почистване на всички стаи, баня и кухня. Имам домашни любимци.',
          category: 'cleaning',
          location: 'София, Лозенец',
          price: 25,
          priceType: 'hourly',
          urgent: true,
          rating: 4.8,
          reviewCount: 127,
          postedBy: 'Мария Петрова',
          postedDate: '2024-01-15T10:30:00Z',
          views: 45,
          applications: 8,
          attachments: [
            {
              name: 'apartment1.jpg',
              size: 1024000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
            },
            {
              name: 'apartment2.jpg',
              size: 980000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '2',
          title: 'Разходка с кучето ми',
          description: 'Търся човек за ежедневна разходка с моя лабрадор. Кучето е спокойно и добре възпитано. Разходката трябва да е около 30-45 минути.',
          category: 'dog-care',
          location: 'София, Младост',
          price: 15,
          priceType: 'hourly',
          urgent: false,
          rating: 4.9,
          reviewCount: 89,
          postedBy: 'Иван Георгиев',
          postedDate: '2024-01-14T15:20:00Z',
          views: 32,
          applications: 5,
          attachments: [
            {
              name: 'dog1.jpg',
              size: 850000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '3',
          title: 'Ремонт на компютър',
          description: 'Компютърът ми не се стартира правилно. Търся специалист за диагностика и поправка. Имам нужда от спешна помощ.',
          category: 'handyman',
          location: 'София, Център',
          price: 50,
          priceType: 'fixed',
          urgent: true,
          rating: 4.7,
          reviewCount: 203,
          postedBy: 'Петър Димитров',
          postedDate: '2024-01-13T09:15:00Z',
          views: 67,
          applications: 12,
          attachments: [
            {
              name: 'computer1.jpg',
              size: 1200000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
            },
            {
              name: 'computer2.jpg',
              size: 1100000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '4',
          title: 'Уроци по математика',
          description: 'Търся преподавател по математика за ученик в 8-ми клас. Уроците трябва да са 2 пъти седмично по 90 минути.',
          category: 'tutoring',
          location: 'София, Изток',
          price: 30,
          priceType: 'hourly',
          urgent: false,
          rating: 4.6,
          reviewCount: 156,
          postedBy: 'Елена Стоянова',
          postedDate: '2024-01-12T14:45:00Z',
          views: 28,
          applications: 6,
          attachments: [
            {
              name: 'math1.jpg',
              size: 750000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '5',
          title: 'Преместване на мебели',
          description: 'Трябва да преместя няколко мебела в новата си къща. Имам нужда от помощ за преместване на диван, маса и гардероб.',
          category: 'moving',
          location: 'София, Надежда',
          price: 80,
          priceType: 'fixed',
          urgent: false,
          rating: 4.5,
          reviewCount: 94,
          postedBy: 'Стефан Тодоров',
          postedDate: '2024-01-11T11:30:00Z',
          views: 41,
          applications: 7,
          attachments: [
            {
              name: 'furniture1.jpg',
              size: 950000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop'
            },
            {
              name: 'furniture2.jpg',
              size: 880000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
            }
          ]
        }
      ]
      
      setTasks(sampleTasks)
      setLoading(false)
    }, 1000)
  }

  const applyFilters = () => {
    let filtered = [...tasks]

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory)
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(task => {
        const price = task.price
        const min = priceRange.min ? parseFloat(priceRange.min) : 0
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity
        return price >= min && price <= max
      })
    }

    // Urgent filter
    if (urgentOnly) {
      filtered = filtered.filter(task => task.urgent)
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(task => task.rating >= ratingFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredTasks(filtered)
  }

  const handleSearch = (query: string, filters: any) => {
    // Apply search filters
    setSelectedCategory(filters.category || '')
    setPriceRange(filters.priceRange || { min: '', max: '' })
    setUrgentOnly(filters.urgent || false)
    setRatingFilter(filters.rating || 0)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setUrgentOnly(false)
    setRatingFilter(0)
    setSortBy('newest')
  }

  const categories = [
    { id: 'cleaning', label: 'Почистване', icon: '🧹' },
    { id: 'gardening', label: 'Градинарство', icon: '🌱' },
    { id: 'moving', label: 'Преместване', icon: '📦' },
    { id: 'handyman', label: 'Ремонт', icon: '🔧' },
    { id: 'tutoring', label: 'Обучение', icon: '📚' },
    { id: 'pet-care', label: 'Грижа за животни', icon: '🐾' },
    { id: 'cooking', label: 'Готвене', icon: '👨‍🍳' },
    { id: 'delivery', label: 'Доставка', icon: '🚚' },
    { id: 'dog-care', label: 'Разходка/грижа за куче', icon: '🐕' },
    { id: 'other', label: 'Друго', icon: '📋' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Най-нови' },
    { value: 'oldest', label: 'Най-стари' },
    { value: 'price-low', label: 'Цена (ниска)' },
    { value: 'price-high', label: 'Цена (висока)' },
    { value: 'rating', label: 'Рейтинг' },
    { value: 'popular', label: 'Популярни' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Обяви за работа
            </h1>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <SearchSection onSearch={handleSearch} />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 animate-slide-down">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категории
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ценови диапазон
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Мин. цена"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Макс. цена"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 input text-sm"
                  />
                </div>
              </div>

              {/* Other Filters */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={urgentOnly}
                    onChange={(e) => setUrgentOnly(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Само спешни</span>
                </label>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Мин. рейтинг:</span>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                    className="input text-sm py-1"
                  >
                    <option value={0}>Всички</option>
                    <option value={4}>4+ звезди</option>
                    <option value={4.5}>4.5+ звезди</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Подреди по:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-sm py-1"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Изчисти филтрите
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Намерени {filteredTasks.length} обяви
          </p>
          
          {filteredTasks.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Показване на {filteredTasks.length} от {tasks.length} обяви
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="skeleton h-48 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="skeleton-text w-3/4"></div>
                  <div className="skeleton-text w-full"></div>
                  <div className="skeleton-text w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tasks Grid/List */}
        {!loading && filteredTasks.length > 0 && (
          <TouchGestures
            onSwipeLeft={() => setViewMode('list')}
            onSwipeRight={() => setViewMode('grid')}
            className="w-full"
          >
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          </TouchGestures>
        )}

        {/* Empty State */}
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Няма намерени обяви
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Опитайте да промените филтрите или да потърсите нещо друго
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Изчисти филтрите
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 