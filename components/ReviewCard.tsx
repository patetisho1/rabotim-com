'use client'

import React, { useState } from 'react'
import { Review } from '@/types/rating'
import { Star, ThumbsUp, Flag, MoreVertical, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { bg } from 'date-fns/locale'

interface ReviewCardProps {
  review: Review
  onHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
  showActions?: boolean
}

export default function ReviewCard({ review, onHelpful, onReport, showActions = true }: ReviewCardProps) {
  const [showFullComment, setShowFullComment] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ))
  }

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: bg })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              {review.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(review.createdAt)}</span>
              {review.isVerified && (
                <div className="flex items-center space-x-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Верифициран</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onHelpful?.(review.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <ThumbsUp size={14} />
                  <span>Полезно</span>
                </button>
                <button
                  onClick={() => {
                    onReport?.(review.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Flag size={14} />
                  <span>Докладвай</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment */}
      <div className="mb-3">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {showFullComment ? review.comment : review.comment.substring(0, 200)}
          {review.comment.length > 200 && !showFullComment && '...'}
        </p>
        {review.comment.length > 200 && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-600 dark:text-blue-400 text-xs hover:underline mt-1"
          >
            {showFullComment ? 'Покажи по-малко' : 'Покажи повече'}
          </button>
        )}
      </div>

      {/* Pros and Cons */}
      {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
        <div className="mb-3 space-y-2">
          {review.pros && review.pros.length > 0 && (
            <div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Предимства:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {review.pros.map((pro, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full"
                  >
                    {pro}
                  </span>
                ))}
              </div>
            </div>
          )}

          {review.cons && review.cons.length > 0 && (
            <div>
              <span className="text-xs font-medium text-red-600 dark:text-red-400">Недостатъци:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {review.cons.map((con, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full"
                  >
                    {con}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          {review.helpfulCount > 0 && (
            <span className="flex items-center space-x-1">
              <ThumbsUp size={12} />
              <span>{review.helpfulCount} полезни</span>
            </span>
          )}
          {review.reportedCount > 0 && (
            <span className="flex items-center space-x-1 text-red-500">
              <Flag size={12} />
              <span>{review.reportedCount} доклада</span>
            </span>
          )}
        </div>

        {showActions && (
          <button
            onClick={() => onHelpful?.(review.id)}
            className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ThumbsUp size={12} />
            <span>Полезно</span>
          </button>
        )}
      </div>
    </div>
  )
}
