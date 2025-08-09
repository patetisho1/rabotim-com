'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Heart, 
  Eye,
  Share2,
  MessageCircle,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import ImageGallery from './ImageGallery'
import RatingDisplay from './RatingDisplay'
import AddRating from './AddRating'
import { useRatings } from '@/hooks/useRatings'

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

interface TaskCardProps {
  task: Task
  className?: string
}

export default function TaskCard({ task, className = '' }: TaskCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [showRating, setShowRating] = useState(false)
  
  const { userRatings, loadUserRatings } = useRatings()
  
  // Зареждане на рейтинги при първо рендериране
  React.useEffect(() => {
    if (task.postedBy) {
      loadUserRatings(task.postedBy)
    }
  }, [task.postedBy, loadUserRatings])

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'cleaning': 'Почистване',
      'gardening': 'Градинарство',
      'moving': 'Преместване',
      'handyman': 'Ремонт',
      'tutoring': 'Обучение',
      'pet-care': 'Грижа за животни',
      'cooking': 'Готвене',
      'delivery': 'Доставка',
      'dog-care': 'Разходка/грижа за куче',
      'other': 'Друго'
    }
    return categories[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'cleaning': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      'gardening': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      'moving': 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      'handyman': 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
      'tutoring': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
      'pet-care': 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300',
      'cooking': 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
      'delivery': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      'dog-care': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      'other': 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
    }
    return colors[category] || colors['other']
  }

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'hourly') {
      return `${price} лв/час`
    }
    return `${price} лв`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'днес'
    if (diffDays === 2) return 'вчера'
    if (diffDays <= 7) return `преди ${diffDays} дни`
    return date.toLocaleDateString('bg-BG')
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: task.title,
        text: task.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Навигация към съобщенията с предварително избран потребител
    window.location.href = `/messages?user=${task.postedBy}`
  }

  const handleRating = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowRating(true)
  }

  const handleLongPress = () => {
    setShowActions(true)
  }

  return (
    <Link 
      href={`/task/${task.id}`}
      className={`block group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => {
        const timer = setTimeout(handleLongPress, 500)
        return () => clearTimeout(timer)
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer">
        {/* Image Gallery */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="relative">
            <ImageGallery 
              attachments={task.attachments} 
              className="w-full"
            />
            
            {/* Quick Actions Overlay */}
            <div className={`absolute top-2 right-2 flex gap-1 transition-all duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLike(e)
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/50 text-white hover:bg-red-500'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleShare(e)
                }}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:bg-black/70"
              >
                <Share2 size={16} />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleMessage(e)
                }}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:bg-black/70"
              >
                <MessageCircle size={16} />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRating(e)
                }}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:bg-black/70"
              >
                <Star size={16} />
              </button>
            </div>

            {/* Urgent Badge */}
            {task.urgent && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                Спешно
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 mb-1">
                {task.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
              <Tag size={12} className="mr-1" />
              {getCategoryLabel(task.category)}
            </span>
          </div>

          {/* Location and Date */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span className="truncate">{task.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(task.postedDate)}</span>
            </div>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-lg font-semibold text-green-600 dark:text-green-400">
                <DollarSign size={16} />
                <span>{formatPrice(task.price, task.priceType)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {task.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({task.reviewCount})
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{task.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>{task.applications}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <User size={12} />
              <span>{task.postedBy}</span>
            </div>
          </div>
        </div>

        {/* Touch Feedback */}
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-active:opacity-10 transition-opacity duration-150 pointer-events-none rounded-xl" />
      </div>

      {/* Long Press Actions Modal */}
      {showActions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowActions(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl p-6 w-full max-w-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLike(e)
                  setShowActions(false)
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'} />
                <span className="font-medium">{isLiked ? 'Премахни от любими' : 'Добави в любими'}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleShare(e)
                  setShowActions(false)
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Сподели</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleMessage(e)
                  setShowActions(false)
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <MessageCircle size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Съобщение</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRating(e)
                  setShowActions(false)
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Star size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Оцени</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowActions(false)
                  // Navigate to task detail page
                  window.location.href = `/task/${task.id}`
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <MessageCircle size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Кандидатствай</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <AddRating
          taskId={task.id}
          reviewedUserId={task.postedBy}
          onClose={() => setShowRating(false)}
          onSubmit={async (ratingData) => {
            // Тук ще добавим логиката за запазване на рейтинга
            console.log('Rating submitted:', ratingData)
            setShowRating(false)
          }}
        />
      )}

      {/* Rating Display */}
      {userRatings[task.postedBy] && (
        <div className="mt-4">
          <RatingDisplay 
            userRating={userRatings[task.postedBy]} 
            showDetails={false}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          />
        </div>
      )}
    </Link>
  )
} 