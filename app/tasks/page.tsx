'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasksAPI, Task } from '@/hooks/useTasksAPI'
import TaskCard from '@/components/TaskCard'
import { 
  Search, 
  MapPin, 
  Filter, 
  SortAsc, 
  Calendar, 
  DollarSign,
  Clock,
  User,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Briefcase,
  Wrench,
  Home,
  Car,
  Palette,
  BookOpen,
  Smartphone,
  Leaf
} from 'lucide-react'
import toast from 'react-hot-toast'
import TasksMap from '@/components/TasksMap'
import MobileFiltersSheet from '@/components/MobileFiltersSheet'
import SkeletonCard from '@/components/SkeletonCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import PopularCategories from '@/components/PopularCategories'
import { useAuth } from '@/hooks/useAuth'

// Task interface is imported from useTasksAPI

const categories = [
  { name: 'Всички категории', icon: Briefcase, value: '' },
  { name: 'Почистване', icon: Home, value: 'Почистване' },
  { name: 'Ремонт', icon: Wrench, value: 'Ремонт' },
  { name: 'Доставка', icon: Car, value: 'Доставка' },
  { name: 'Градинарство', icon: Leaf, value: 'Градинарство' },
  { name: 'Обучение', icon: BookOpen, value: 'Обучение' }
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
  'Сливен',
  'Добрич',
  'Шумен'
]

const priceRanges = [
  'Всяка цена',
  'До 50 лв',
  '50-100 лв',
  '100-200 лв',
  '200-500 лв',
  'Над 500 лв'
]

const sortOptions = [
  'Най-нови',
  'Локални първи',
  'Най-висока цена',
  'Най-ниска цена',
  'Най-близки',
  'Най-популярни'
]


export default function TasksPage() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const { tasks, loading, fetchTasks } = useTasksAPI()
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedSort, setSelectedSort] = useState('Най-нови')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Get user's location from auth metadata
  const userCity = authUser?.user_metadata?.city || ''
  const userNeighborhood = authUser?.user_metadata?.neighborhood || ''

  // Функция за получаване на икона според категорията
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Почистване':
        return Home
      case 'Ремонт':
        return Wrench
      case 'Доставка':
        return Car
      case 'Градинарство':
        return Leaf
      case 'Обучение':
        return BookOpen
      default:
        return Briefcase
    }
  }

  useEffect(() => {
    // Зареждане на любими задачи от localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  // Обновяване на филтрираните задачи когато се променят задачите или филтрите
  useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  // Скролиране към конкретна обява, ако е подаден jobId в URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const jobId = urlParams.get('jobId')
      const category = urlParams.get('category')
      
      if (jobId) {
        // Задаваме категорията, ако е подадена
        if (category) {
          setSelectedCategory(category)
        }
        
        // Скролираме към обявата след кратко забавяне
        setTimeout(() => {
          const taskElement = document.getElementById(`task-${jobId}`)
          if (taskElement) {
            taskElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
            // Добавяме визуален ефект
            taskElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
            setTimeout(() => {
              taskElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
            }, 3000)
          }
        }, 1000) // Увеличаваме забавянето
      }
    }
  }, [tasks]) // Променяме зависимостта от filteredTasks на tasks

  useEffect(() => {
    filterTasks()
  }, [searchQuery, selectedCategory, selectedLocation, selectedPriceRange, selectedSort, tasks, userCity, userNeighborhood])

  const filterTasks = () => {
    let filtered = [...tasks]

    // Филтър по търсене
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Филтър по категория
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory)
    }

    // Филтър по локация
    if (selectedLocation && selectedLocation !== 'Всички локации') {
      filtered = filtered.filter(task => task.location.includes(selectedLocation))
    }

    // Филтър по цена
    if (selectedPriceRange && selectedPriceRange !== 'Всяка цена') {
      switch (selectedPriceRange) {
        case 'До 50 лв':
          filtered = filtered.filter(task => task.price <= 50)
          break
        case '50-100 лв':
          filtered = filtered.filter(task => task.price >= 50 && task.price <= 100)
          break
        case '100-200 лв':
          filtered = filtered.filter(task => task.price >= 100 && task.price <= 200)
          break
        case '200-500 лв':
          filtered = filtered.filter(task => task.price >= 200 && task.price <= 500)
          break
        case 'Над 500 лв':
          filtered = filtered.filter(task => task.price > 500)
          break
      }
    }

    // Сортиране
    switch (selectedSort) {
      case 'Най-нови':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'Локални първи':
        // Prioritize local tasks based on user's city and neighborhood
        if (userCity) {
          filtered.sort((a, b) => {
            const aIsLocal = a.location.includes(userCity)
            const bIsLocal = b.location.includes(userCity)
            const aIsNeighborhood = userNeighborhood ? a.location.includes(userNeighborhood) : false
            const bIsNeighborhood = userNeighborhood ? b.location.includes(userNeighborhood) : false
            
            // Priority: same neighborhood > same city > other
            if (aIsNeighborhood && !bIsNeighborhood) return -1
            if (bIsNeighborhood && !aIsNeighborhood) return 1
            if (aIsLocal && !bIsLocal) return -1
            if (bIsLocal && !aIsLocal) return 1
            
            // If same locality, sort by date
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
        } else {
          // If no user location set, just sort by date
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
        break
      case 'Най-висока цена':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Най-ниска цена':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Най-популярни':
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredTasks(filtered)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLocation('')
    setSelectedPriceRange('')
    setSelectedSort('Най-нови')
    toast.success('Филтрите са изчистени')
  }

  const handleFavoriteToggle = (taskId: string) => {
    const newFavorites = favorites.includes(taskId)
      ? favorites.filter(id => id !== taskId)
      : [...favorites, taskId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    
    if (favorites.includes(taskId)) {
      toast.success('Премахнато от любими')
    } else {
      toast.success('Добавено в любими')
    }
  }



  const formatPrice = (price: number, priceType: string) => {
    return priceType === 'hourly' ? `${price} лв/час` : `${price} лв`
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Няма краен срок'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Изтекъл срок'
    if (diffDays === 0) return 'Днес'
    if (diffDays === 1) return 'Утре'
    if (diffDays <= 7) return `След ${diffDays} дни`
    return date.toLocaleDateString('bg-BG')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Разгледайте активните обяви за работа
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Намерете задачата, която отговаря на вашите умения и започнете да печелите
            </p>
            
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.slice(1).map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    <IconComponent size={20} />
                    {category.name}
                  </button>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{tasks.length}+</div>
                <div className="text-blue-200">Активни обяви</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-blue-200">Категории</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-blue-200">Среден рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs 
            items={[
              { label: 'Задачи', href: '/tasks' },
              ...(selectedCategory ? [{ label: selectedCategory, href: `/tasks?category=${selectedCategory}` }] : [])
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">Разгледай задачи</h1>
            <p className="text-gray-600 mt-1">Намерете перфектната задача за вас</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Търси задачи..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters - Desktop */}
            <div className="hidden lg:flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters Button - Mobile */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 font-medium text-gray-700 dark:text-gray-300 min-h-[44px] touch-manipulation"
            >
              <Filter className="h-5 w-5" />
              Филтри
              {(selectedCategory || selectedLocation || selectedPriceRange || selectedSort !== 'Най-нови') && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  •
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                {[...Array(9)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Няма намерени задачи</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {tasks.length === 0 
                    ? 'В момента няма активни обяви. Бъдете първият който публикува задача!'
                    : 'Опитайте да промените филтрите или търсенето, за да намерите повече резултати.'}
                </p>
                {tasks.length === 0 && (
                  <button
                    onClick={() => router.push('/post-task')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Briefcase className="h-5 w-5" />
                    Публикувай първата задача
                  </button>
                )}
                {(selectedCategory || selectedLocation || selectedPriceRange || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    Изчисти филтрите
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <TasksMap 
                tasks={filteredTasks}
                selectedLocation={selectedLocation}
                height="600px"
                onTaskClick={(taskId) => {
                  // Скролиране към задачата в списъка
                  const taskElement = document.getElementById(`task-${taskId}`)
                  if (taskElement) {
                    taskElement.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <MobileFiltersSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        categories={categories}
        locations={locations}
        priceRanges={priceRanges}
        sortOptions={sortOptions}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        selectedPriceRange={selectedPriceRange}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
        onPriceRangeChange={setSelectedPriceRange}
        onSortChange={setSelectedSort}
        onReset={handleResetFilters}
      />
    </div>
  )
}
