'use client'

import { useState } from 'react'
import { Star, X, CheckCircle, MessageCircle, Clock } from 'lucide-react'

interface AddRatingProps {
  taskId: string
  reviewedUserId: string
  onClose: () => void
  onSubmit: (rating: {
    taskId: string
    reviewedUserId: string
    rating: number
    comment: string
    category: 'quality' | 'communication' | 'punctuality' | 'overall'
  }) => void
}

export default function AddRating({ taskId, reviewedUserId, onClose, onSubmit }: AddRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState<'quality' | 'communication' | 'punctuality' | 'overall'>('overall')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Моля, изберете рейтинг')
      return
    }

    if (!comment.trim()) {
      alert('Моля, напишете коментар')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit({
        taskId,
        reviewedUserId,
        rating,
        comment: comment.trim(),
        category
      })
      
      onClose()
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || rating)
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0 && !hoverRating
      
      stars.push(
        <button
          key={i}
          type="button"
          className={`transition-colors ${
            interactive ? 'hover:scale-110' : ''
          }`}
          onClick={interactive ? () => setRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          <Star
            size={24}
            className={`${
              isFilled
                ? 'text-yellow-500 fill-current'
                : isHalf
                ? 'text-yellow-500 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        </button>
      )
    }
    return stars
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Много лошо'
      case 2: return 'Лошо'
      case 3: return 'Средно'
      case 4: return 'Добре'
      case 5: return 'Отлично'
      default: return 'Изберете рейтинг'
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'quality':
        return <CheckCircle size={16} className="text-green-500" />
      case 'communication':
        return <MessageCircle size={16} className="text-blue-500" />
      case 'punctuality':
        return <Clock size={16} className="text-purple-500" />
      default:
        return <Star size={16} className="text-yellow-500" />
    }
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'quality':
        return 'Качество на работата'
      case 'communication':
        return 'Комуникация'
      case 'punctuality':
        return 'Пунктуалност'
      default:
        return 'Общо впечатление'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Оценете изпълнителя
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Рейтинг */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Вашият рейтинг
            </label>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-1">
                {renderStars(rating, true)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getRatingText(rating)}
              </p>
            </div>
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Категория
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['quality', 'communication', 'punctuality', 'overall'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg border transition-colors ${
                    category === cat
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(cat)}
                    <span className="text-sm font-medium">{getCategoryLabel(cat)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Коментар */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Коментар
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Споделете вашето мнение за работата..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Минимум 10 символа
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.length < 10}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Изпращане...' : 'Изпрати рейтинг'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 