'use client'

import { useState } from 'react'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

interface Rating {
  id: string
  taskId: string
  taskTitle: string
  fromUserId: string
  fromUserName: string
  fromUserAvatar: string
  toUserId: string
  toUserName: string
  toUserAvatar: string
  rating: number
  comment: string
  categories: {
    quality: number
    communication: number
    punctuality: number
    value: number
  }
  isRecommended: boolean
  createdAt: string
  taskCompletedAt: string
  taskAmount: number
}

interface RatingSystemProps {
  taskId: string
  taskTitle: string
  taskAmount: number
  taskCompletedAt: string
  otherUser: {
    id: string
    name: string
    avatar: string
  }
  onRatingSubmit: (rating: Omit<Rating, 'id' | 'createdAt'>) => void
  onClose: () => void
  isOpen: boolean
}

export default function RatingSystem({
  taskId,
  taskTitle,
  taskAmount,
  taskCompletedAt,
  otherUser,
  onRatingSubmit,
  onClose,
  isOpen
}: RatingSystemProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [categories, setCategories] = useState({
    quality: 0,
    communication: 0,
    punctuality: 0,
    value: 0
  })
  const [isRecommended, setIsRecommended] = useState(true)
  const [loading, setLoading] = useState(false)

  const categoryLabels = {
    quality: 'Качество на работата',
    communication: 'Комуникация',
    punctuality: 'Пунктуалност',
    value: 'Съотношение цена-качество'
  }

  const renderStars = (value: number, hoverValue: number, onChange: (value: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => onChange(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className="p-1"
      >
        <Star
          size={24}
          className={`${
            i < (hoverValue || value)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          } transition-colors`}
        />
      </button>
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setLoading(true)

    try {
      const ratingData = {
        taskId,
        taskTitle,
        fromUserId: 'current-user',
        fromUserName: 'Вие',
        fromUserAvatar: '/api/placeholder/40/40',
        toUserId: otherUser.id,
        toUserName: otherUser.name,
        toUserAvatar: otherUser.avatar,
        rating,
        comment,
        categories,
        isRecommended,
        taskCompletedAt,
        taskAmount
      }

      onRatingSubmit(ratingData)
      
      // Reset form
      setRating(0)
      setComment('')
      setCategories({
        quality: 0,
        communication: 0,
        punctuality: 0,
        value: 0
      })
      setIsRecommended(true)
      
      onClose()
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Оцени изпълнителя
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-2xl text-gray-400">&times;</span>
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {otherUser.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {taskTitle}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {taskAmount} €
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(taskCompletedAt).toLocaleDateString('bg-BG')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Обща оценка *
            </label>
            <div className="flex items-center gap-2">
              {renderStars(rating, hoverRating, setRating)}
              <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                {rating}/5
              </span>
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {rating === 1 && 'Много лошо'}
                {rating === 2 && 'Лошо'}
                {rating === 3 && 'Средно'}
                {rating === 4 && 'Добре'}
                {rating === 5 && 'Отлично'}
              </p>
            )}
          </div>

          {/* Category Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Детайлни оценки
            </label>
            <div className="space-y-4">
              {Object.entries(categories).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {categoryLabels[key as keyof typeof categoryLabels]}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {value}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(
                      value,
                      0,
                      (newValue) => setCategories(prev => ({ ...prev, [key]: newValue }))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Препоръчвате ли този изпълнител?
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isRecommended}
                  onChange={() => setIsRecommended(true)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <ThumbsUp size={20} className="text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Да, препоръчвам</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!isRecommended}
                  onChange={() => setIsRecommended(false)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <ThumbsDown size={20} className="text-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Не, не препоръчвам</span>
              </label>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Коментар (по желание)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Споделете вашия опит с този изпълнител. Какво е било добре и какво може да се подобри?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Вашият коментар ще бъде публичен
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Откажи
            </button>
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Изпращане...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Изпрати оценка
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

