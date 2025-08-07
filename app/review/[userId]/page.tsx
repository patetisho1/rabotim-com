'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Star, User, ThumbsUp, ThumbsDown, Filter, Award, TrendingUp, Calendar, CheckCircle, Shield, Clock, MessageCircle, Heart, Flag } from 'lucide-react'
import toast from 'react-hot-toast'

interface Review {
  id: string
  reviewerId: string
  reviewerName: string
  rating: number
  comment: string
  createdAt: string
  taskTitle: string
  helpful: number
  verified: boolean
  response?: string
  responseDate?: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  rating: number
  totalReviews: number
  completedTasks: number
  joinDate: string
  avatar: string
  isVerified: boolean
  responseRate: number
  avgResponseTime: number
  categories: string[]
  badges: string[]
}

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    rating: '',
    verified: false,
    hasResponse: false,
    sortBy: 'newest'
  })
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    taskTitle: ''
  })

  useEffect(() => {
    checkLoginStatus()
    loadUserProfile()
    loadReviews()
  }, [userId])

  useEffect(() => {
    applyFilters()
  }, [reviews, filters])

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loginStatus === 'true' && userData) {
      setIsLoggedIn(true)
      const user = JSON.parse(userData)
      setCurrentUserId(user.id.toString())
    }
  }

  const loadUserProfile = () => {
    // Симулация на зареждане на потребителски профил
    const profile: UserProfile = {
      id: userId,
      name: 'Иван Петров',
      email: 'ivan@example.com',
      rating: 4.7,
      totalReviews: 15,
      completedTasks: 23,
      joinDate: '2023-06-15',
      avatar: '/api/placeholder/80/80',
      isVerified: true,
      responseRate: 85,
      avgResponseTime: 2.3,
      categories: ['Ремонт', 'Почистване', 'Преместване'],
      badges: ['Топ изпълнител', 'Бърз отговор', 'Верифициран']
    }
    setUserProfile(profile)
  }

  const loadReviews = () => {
    // Симулация на зареждане на отзиви
    const sampleReviews: Review[] = [
      {
        id: '1',
        reviewerId: '2',
        reviewerName: 'Мария Георгиева',
        rating: 5,
        comment: 'Отличен изпълнител! Работата беше свършена бързо и качествено. Препоръчвам горещо!',
        createdAt: '2024-01-10T14:30:00Z',
        taskTitle: 'Почистване на апартамент',
        helpful: 3,
        verified: true,
        response: 'Благодаря за доверието! Радвам се, че сте доволни от работата.',
        responseDate: '2024-01-10T16:45:00Z'
      },
      {
        id: '2',
        reviewerId: '3',
        reviewerName: 'Стоян Димитров',
        rating: 4,
        comment: 'Добър работник, но малко закъсня. Въпреки това работата беше добре свършена.',
        createdAt: '2024-01-08T09:15:00Z',
        taskTitle: 'Ремонт на водопровод',
        helpful: 1,
        verified: false
      },
      {
        id: '3',
        reviewerId: '4',
        reviewerName: 'Елена Василева',
        rating: 5,
        comment: 'Професионалист! Много доволна от работата. Ще го наема отново.',
        createdAt: '2024-01-05T16:45:00Z',
        taskTitle: 'Преместване на мебели',
        helpful: 5,
        verified: true
      },
      {
        id: '4',
        reviewerId: '5',
        reviewerName: 'Георги Тодоров',
        rating: 3,
        comment: 'Работата беше свършена, но не точно както исках. Комуникацията може да бъде по-добра.',
        createdAt: '2024-01-03T11:20:00Z',
        taskTitle: 'Ремонт на врата',
        helpful: 0,
        verified: true,
        response: 'Извинявам се за недоразумението. Ще се подобря в комуникацията.',
        responseDate: '2024-01-03T14:30:00Z'
      },
      {
        id: '5',
        reviewerId: '6',
        reviewerName: 'Анна Стоянова',
        rating: 5,
        comment: 'Фантастичен изпълнител! Работата беше свършена перфектно и навреме. Много професионален подход.',
        createdAt: '2024-01-01T10:00:00Z',
        taskTitle: 'Ремонт на кухня',
        helpful: 7,
        verified: true
      }
    ]
    setReviews(sampleReviews)
    setIsLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...reviews]

    // Филтър по рейтинг
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === parseInt(filters.rating))
    }

    // Филтър за верифицирани отзиви
    if (filters.verified) {
      filtered = filtered.filter(review => review.verified)
    }

    // Филтър за отзиви с отговор
    if (filters.hasResponse) {
      filtered = filtered.filter(review => review.response)
    }

    // Сортиране
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating)
        break
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful)
        break
    }

    setFilteredReviews(filtered)
  }

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim() || !newReview.taskTitle.trim()) {
      toast.error('Моля, попълнете всички полета')
      return
    }

    const review: Review = {
      id: Date.now().toString(),
      reviewerId: currentUserId,
      reviewerName: 'Вашето име', // В реалност ще се вземе от текущия потребител
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      createdAt: new Date().toISOString(),
      taskTitle: newReview.taskTitle.trim(),
      helpful: 0,
      verified: true
    }

    // Добавяне на нов отзив
    setReviews(prev => [review, ...prev])
    
    // Обновяване на рейтинга
    if (userProfile) {
      const newRating = (userProfile.rating * userProfile.totalReviews + newReview.rating) / (userProfile.totalReviews + 1)
      setUserProfile(prev => prev ? {
        ...prev,
        rating: Math.round(newRating * 10) / 10,
        totalReviews: prev.totalReviews + 1
      } : null)
    }

    setNewReview({ rating: 5, comment: '', taskTitle: '' })
    setShowReviewForm(false)
    toast.success('Отзивът е публикуван успешно!')
  }

  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Преди малко'
    if (diffInHours < 24) return `Преди ${diffInHours} часа`
    if (diffInHours < 48) return 'Вчера'
    return formatDate(dateString)
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Отличен'
    if (rating >= 4.0) return 'Много добър'
    if (rating >= 3.5) return 'Добър'
    if (rating >= 3.0) return 'Задоволителен'
    return 'Слаб'
  }

  const getRatingStats = () => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      stats[review.rating as keyof typeof stats]++
    })
    return stats
  }

  const ratingStats = getRatingStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Потребителят не е намерен</p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary mt-4"
          >
            Назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Профил на {userProfile.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto">
                    <User size={48} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  {userProfile.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {userProfile.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {userProfile.email}
                </p>
                
                {/* Rating */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(userProfile.rating, 20)}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {userProfile.rating}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getRatingText(userProfile.rating)}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {userProfile.totalReviews}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Отзива</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {userProfile.completedTasks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Задачи</div>
                  </div>
                </div>

                {/* Response Stats */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Отговаря на</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {userProfile.responseRate}% от отзивите
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Средно време</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {userProfile.avgResponseTime} дни
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Постижения</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {userProfile.badges.map((badge, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        <Award size={12} />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Специализации</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {userProfile.categories.map((category, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Join Date */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Член от {formatDate(userProfile.joinDate)}
                </div>

                {/* Write Review Button */}
                {isLoggedIn && currentUserId !== userId && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full btn btn-primary"
                  >
                    Напиши отзив
                  </button>
                )}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Разпределение на оценките
              </h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                      <Star size={12} className="text-yellow-500 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(ratingStats[rating as keyof typeof ratingStats] / userProfile.totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                      {ratingStats[rating as keyof typeof ratingStats]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Отзиви ({filteredReviews.length})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-outline text-sm flex items-center gap-2"
                  >
                    <Filter size={16} />
                    Филтри
                  </button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Рейтинг
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) => setFilters({...filters, rating: e.target.value})}
                        className="input text-sm"
                      >
                        <option value="">Всички</option>
                        <option value="5">5 звезди</option>
                        <option value="4">4 звезди</option>
                        <option value="3">3 звезди</option>
                        <option value="2">2 звезди</option>
                        <option value="1">1 звезда</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Сортиране
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        className="input text-sm"
                      >
                        <option value="newest">Най-нови</option>
                        <option value="oldest">Най-стари</option>
                        <option value="highest">Най-високи</option>
                        <option value="lowest">Най-ниски</option>
                        <option value="helpful">Най-полезни</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={filters.verified}
                          onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        Верифицирани
                      </label>
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={filters.hasResponse}
                          onChange={(e) => setFilters({...filters, hasResponse: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        С отговор
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    Няма отзиви, отговарящи на избраните филтри
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-600 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <User size={16} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {review.reviewerName}
                              </h4>
                              {review.verified && (
                                <CheckCircle size={14} className="text-success-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {review.taskTitle}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {review.comment}
                      </p>
                      
                      {/* Response */}
                      {review.response && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <User size={14} className="text-primary-600" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Отговор от {userProfile.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(review.responseDate!)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {review.response}
                          </p>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleHelpful(review.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            <ThumbsUp size={14} />
                            Полезно ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                            <MessageCircle size={14} />
                            Отговори
                          </button>
                        </div>
                        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                          <Flag size={14} />
                          Докладвай
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Напиши отзив за {userProfile.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Задача
                </label>
                <input
                  type="text"
                  value={newReview.taskTitle}
                  onChange={(e) => setNewReview(prev => ({ ...prev, taskTitle: e.target.value }))}
                  placeholder="За каква задача пишете отзив?"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Рейтинг
                </label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={`${i < newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Коментар
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Споделете вашето мнение..."
                  rows={4}
                  className="input w-full resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReviewForm(false)}
                className="flex-1 btn btn-outline"
              >
                Отказ
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 btn btn-primary"
              >
                Публикувай
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 