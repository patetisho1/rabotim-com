'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRatings } from '@/hooks/useRatings'
import { useAuth } from '@/hooks/useAuth'
import RatingDisplay from '@/components/RatingDisplay'
import AddRating from '@/components/AddRating'
import { Star, Filter, Search, Award } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RatingsPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const {
    ratings,
    reviews,
    userRatings,
    isLoading,
    error,
    loadUserRatings,
    addRating,
    filterRatings
  } = useRatings()

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showAddRating, setShowAddRating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    minRating: 0,
    maxRating: 5,
    verifiedOnly: false,
    category: ''
  })

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    // Зареждане на демо рейтинги за няколко потребителя
    const demoUsers = ['user1', 'user2', 'user3', 'user4']
    demoUsers.forEach(userId => {
      loadUserRatings(userId)
    })
  }, [authUser, authLoading, router, loadUserRatings])

  const handleAddRating = async (ratingData: any) => {
    try {
      await addRating(ratingData)
      setShowAddRating(false)
    } catch (error) {
      console.error('Error adding rating:', error)
    }
  }

  const filteredUserRatings = Object.entries(userRatings).filter(([userId, userRating]) => {
    const matchesSearch = userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         userRating.badges.some(badge => badge.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRating = userRating.averageRating >= filters.minRating && 
                         userRating.averageRating <= filters.maxRating

    return matchesSearch && matchesRating
  })

  const getTopRatedUsers = () => {
    return Object.entries(userRatings)
      .sort(([, a], [, b]) => b.averageRating - a.averageRating)
      .slice(0, 5)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Възникна грешка
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Рейтинги и отзиви
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Вижте рейтингите на изпълнителите и споделете вашите отзиви
          </p>
        </div>

        {/* Top Rated Users */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" size={24} />
            Топ изпълнители
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTopRatedUsers().map(([userId, userRating]) => (
              <div
                key={userId}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedUserId(userId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {userId}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{userRating.averageRating}</span>
                        <span className="text-xs text-gray-500">({userRating.totalReviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {userRating.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {userRating.badges.slice(0, 2).map((badge, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Търси потребители или награди..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Рейтинг:</span>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value={0}>Всички</option>
                  <option value={4}>4+ звезди</option>
                  <option value={4.5}>4.5+ звезди</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddRating(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Star size={16} />
                Добави рейтинг
              </button>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredUserRatings.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Star size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Няма намерени рейтинги' : 'Няма рейтинги'}
              </p>
            </div>
          ) : (
            filteredUserRatings.map(([userId, userRating]) => (
              <div
                key={userId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedUserId(userId)}
              >
                <RatingDisplay userRating={userRating} showDetails={true} />
              </div>
            ))
          )}
        </div>

        {/* Selected User Rating Modal */}
        {selectedUserId && userRatings[selectedUserId] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Рейтинги за {selectedUserId}
                  </h2>
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <RatingDisplay userRating={userRatings[selectedUserId]} showDetails={true} />
              </div>
            </div>
          </div>
        )}

        {/* Add Rating Modal */}
        {showAddRating && (
          <AddRating
            taskId="demo-task"
            reviewedUserId="demo-user"
            onClose={() => setShowAddRating(false)}
            onSubmit={handleAddRating}
          />
        )}
      </div>
    </div>
  )
} 