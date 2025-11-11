'use client'

import React, { useState } from 'react'
import { Review } from '@/types/rating'
import { Star, Send, X, Plus, Minus } from 'lucide-react'

interface AddReviewProps {
  taskId: string
  taskTitle: string
  reviewerId: string
  reviewedUserId: string
  onReviewSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'reportedCount'>) => void
  onClose: () => void
  isOpen: boolean
}

export default function AddReview({
  taskId,
  taskTitle,
  reviewerId,
  reviewedUserId,
  onReviewSubmit,
  onClose,
  isOpen
}: AddReviewProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [pros, setPros] = useState<string[]>([])
  const [cons, setCons] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newPro, setNewPro] = useState('')
  const [newCon, setNewCon] = useState('')
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)

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

  const addPro = () => {
    if (newPro.trim() && !pros.includes(newPro.trim())) {
      setPros([...pros, newPro.trim()])
      setNewPro('')
    }
  }

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index))
  }

  const addCon = () => {
    if (newCon.trim() && !cons.includes(newCon.trim())) {
      setCons([...cons, newCon.trim()])
      setNewCon('')
    }
  }

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !title.trim() || !comment.trim()) return

    setLoading(true)

    try {
      const reviewData = {
        taskId,
        reviewerId,
        reviewedUserId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        pros,
        cons,
        tags,
        isVerified: false
      }

      await onReviewSubmit(reviewData)
      
      // Reset form
      setRating(0)
      setTitle('')
      setComment('')
      setPros([])
      setCons([])
      setTags([])
      setNewPro('')
      setNewCon('')
      setNewTag('')
      
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
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
              Напиши отзив
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {taskTitle}
            </h3>
          </div>
        </div>

        {/* Review Form */}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Заглавие на отзива *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Отлично качество на работата!"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              maxLength={200}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Кратко описание на вашия опит
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Подробен отзив *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Споделете вашия опит с този изпълнител. Какво е било добре и какво може да се подобри?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              maxLength={1000}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Вашият отзив ще бъде публичен
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.length}/1000
              </span>
            </div>
          </div>

          {/* Pros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Предимства
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                placeholder="Добави предимство"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
              />
              <button
                type="button"
                onClick={addPro}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {pros.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pros.map((pro, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm rounded-full flex items-center gap-2"
                  >
                    {pro}
                    <button
                      type="button"
                      onClick={() => removePro(index)}
                      className="hover:text-green-600 dark:hover:text-green-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Недостатъци
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                placeholder="Добави недостатък"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
              />
              <button
                type="button"
                onClick={addCon}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {cons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cons.map((con, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm rounded-full flex items-center gap-2"
                  >
                    {con}
                    <button
                      type="button"
                      onClick={() => removeCon(index)}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тагове
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Добави таг"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-full flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              disabled={rating === 0 || !title.trim() || !comment.trim() || loading}
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
                  Изпрати отзив
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


