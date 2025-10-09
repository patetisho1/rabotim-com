'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ArrowLeft, Trash2, Filter, Grid, List } from 'lucide-react'
import TaskCard from '@/components/TaskCard'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Task } from '@/hooks/useTasksAPI'

export default function FavoritesPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadFavorites()
  }, [authUser, authLoading, router])

  const loadFavorites = () => {
    setLoading(true)
    
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      
      const favoriteTasks = allTasks.filter((task: Task) => favoriteIds.includes(task.id))
      setFavorites(favoriteTasks)
    } catch (error) {
      console.error('Грешка при зареждането на любимите:', error)
      toast.error('Грешка при зареждането на любимите задачи')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = (taskId: string) => {
    const newFavorites = favorites.filter(task => task.id !== taskId)
    setFavorites(newFavorites)
    
    // Обновяване на localStorage
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')
    const updatedFavorites = favoriteIds.filter((id: string) => id !== taskId)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    
    toast.success('Задачата е премахната от любими')
  }

  const handleFavoriteToggle = (taskId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      handleRemoveFromFavorites(taskId)
    }
  }

  const clearAllFavorites = () => {
    if (favorites.length === 0) return
    
    if (confirm('Сигурни ли сте, че искате да премахнете всички любими задачи?')) {
      setFavorites([])
      localStorage.setItem('favorites', JSON.stringify([]))
      toast.success('Всички любими задачи са премахнати')
    }
  }

  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites

    // Филтриране по категория
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory)
    }

    // Сортиране
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
    }

    return filtered
  }

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

  const sortOptions = [
    { value: 'newest', label: 'Най-нови' },
    { value: 'oldest', label: 'Най-стари' },
    { value: 'price-low', label: 'Цена (ниска → висока)' },
    { value: 'price-high', label: 'Цена (висока → ниска)' },
    { value: 'rating', label: 'Рейтинг' },
  ]

  const filteredFavorites = getFilteredAndSortedFavorites()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Heart size={24} className="text-red-500 fill-current" />
                Любими задачи
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length} задача{favorites.length !== 1 ? 'и' : ''} в любими
              </p>
            </div>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Изчисти всички
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Нямате любими задачи
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Запазете задачи, които ви интересуват, за да ги намерите по-лесно по-късно
            </p>
            <button
              onClick={() => router.push('/tasks')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Разгледай задачи
            </button>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Category Filter */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Категория
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Сортиране
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Показани {filteredFavorites.length} от {favorites.length} любими задачи
              </p>
            </div>

            {/* Tasks Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredFavorites.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showActions={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            {filteredFavorites.length === 0 && favorites.length > 0 && (
              <div className="text-center py-16">
                <Filter size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Няма намерени задачи
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Опитайте да промените филтрите
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

