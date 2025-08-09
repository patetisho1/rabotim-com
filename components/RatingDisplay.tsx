'use client'

import { useState } from 'react'
import { UserRating } from '@/types/rating'
import { Star, Award, TrendingUp, Clock, MessageCircle, CheckCircle } from 'lucide-react'

interface RatingDisplayProps {
  userRating: UserRating
  showDetails?: boolean
  className?: string
}

export default function RatingDisplay({ userRating, showDetails = false, className = '' }: RatingDisplayProps) {
  const [showDistribution, setShowDistribution] = useState(false)

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Топ изпълнител':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 'Надежден':
        return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
      case 'Пунктуален':
        return 'bg-gradient-to-r from-green-500 to-green-700 text-white'
      case 'Комуникативен':
        return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
            className="text-yellow-500 fill-current"
          />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star
              size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
              className="text-gray-300"
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star
                size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
                className="text-yellow-500 fill-current"
              />
            </div>
          </div>
        )
      } else {
        stars.push(
          <Star
            key={i}
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
            className="text-gray-300"
          />
        )
      }
    }
    return stars
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Основен рейтинг */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getRatingColor(userRating.averageRating)}`}>
              {userRating.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center mt-1">
              {renderStars(userRating.averageRating, 'sm')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {userRating.totalReviews} отзива
            </div>
          </div>
        </div>

        {/* Награди */}
        {userRating.badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {userRating.badges.map((badge, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getBadgeColor(badge)}`}
              >
                <Award size={12} />
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Разпределение на рейтингите */}
      {showDetails && (
        <div className="mb-4">
          <button
            onClick={() => setShowDistribution(!showDistribution)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
          >
            <TrendingUp size={14} />
            Разпределение на рейтингите
          </button>
          
          {showDistribution && (
            <div className="mt-2 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = userRating.ratingDistribution[rating as keyof typeof userRating.ratingDistribution]
                const percentage = userRating.totalReviews > 0 ? (count / userRating.totalReviews) * 100 : 0
                
                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 w-8">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{rating}</span>
                      <Star size={10} className="text-yellow-500 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Рейтинги по категории */}
      {showDetails && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Рейтинги по категории
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center space-x-1">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Качество</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">{userRating.categoryRatings.quality}</span>
                <Star size={10} className="text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center space-x-1">
                <MessageCircle size={14} className="text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Комуникация</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">{userRating.categoryRatings.communication}</span>
                <Star size={10} className="text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center space-x-1">
                <Clock size={14} className="text-purple-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Пунктуалност</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">{userRating.categoryRatings.punctuality}</span>
                <Star size={10} className="text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Общо</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">{userRating.categoryRatings.overall}</span>
                <Star size={10} className="text-yellow-500 fill-current" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Последни отзиви */}
      {showDetails && userRating.recentReviews.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Последни отзиви
          </h4>
          <div className="space-y-2">
            {userRating.recentReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating, 'sm')}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {review.createdAt.toLocaleDateString('bg-BG')}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {review.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 