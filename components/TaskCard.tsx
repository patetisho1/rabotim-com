'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Eye, 
  MessageCircle, 
  Calendar, 
  User, 
  Tag, 
  Heart,
  HeartOff,
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

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
  showActions?: boolean
  onFavoriteToggle?: (taskId: string, isFavorite: boolean) => void
}

export default function TaskCard({ task, showActions = true, onFavoriteToggle }: TaskCardProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    // Проверка дали задачата е в любими
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(task.id))
    
    // Проверка дали задачата е запазена
    const saved = JSON.parse(localStorage.getItem('savedTasks') || '[]')
    setIsSaved(saved.includes(task.id))
  }, [task.id])

  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (newFavoriteState) {
      if (!favorites.includes(task.id)) {
        favorites.push(task.id)
        toast.success('Задачата е добавена в любими')
      }
    } else {
      const index = favorites.indexOf(task.id)
      if (index > -1) {
        favorites.splice(index, 1)
        toast.success('Задачата е премахната от любими')
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites))
    
    if (onFavoriteToggle) {
      onFavoriteToggle(task.id, newFavoriteState)
    }
  }

  const handleSaveToggle = () => {
    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    
    const saved = JSON.parse(localStorage.getItem('savedTasks') || '[]')
    
    if (newSavedState) {
      if (!saved.includes(task.id)) {
        saved.push(task.id)
        toast.success('Задачата е запазена')
      }
    } else {
      const index = saved.indexOf(task.id)
      if (index > -1) {
        saved.splice(index, 1)
        toast.success('Задачата е премахната от запазените')
      }
    }
    
    localStorage.setItem('savedTasks', JSON.stringify(saved))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: task.description,
          url: `${window.location.origin}/task/${task.id}`
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback - копиране на линка
      navigator.clipboard.writeText(`${window.location.origin}/task/${task.id}`)
      toast.success('Линкът е копиран в клипборда')
    }
    setShowShareMenu(false)
  }

  const handleTaskClick = () => {
    router.push(`/task/${task.id}`)
  }

  const getCategoryLabel = (categoryValue: string) => {
    const categories = [
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
    const category = categories.find(cat => cat.value === categoryValue)
    return category ? category.label : categoryValue
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Днес'
    if (diffDays === 2) return 'Вчера'
    if (diffDays <= 7) return `преди ${diffDays - 1} дни`
    
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'short'
    })
  }

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'hourly') {
      return `${price} лв/час`
    }
    return `${price} лв`
  }

  return (
    <div className="card p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getCategoryLabel(task.category)}
            </span>
            {task.urgent && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                Спешно
              </span>
            )}
          </div>
          
          <h3 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
            onClick={handleTaskClick}
          >
            {task.title}
          </h3>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleFavoriteToggle()
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isFavorite ? 'Премахни от любими' : 'Добави в любими'}
            >
              {isFavorite ? (
                <Heart size={18} className="text-red-500 fill-current" />
              ) : (
                <Heart size={18} className="text-gray-400 hover:text-red-500" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSaveToggle()
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isSaved ? 'Премахни от запазени' : 'Запази задача'}
            >
              {isSaved ? (
                <BookmarkCheck size={18} className="text-blue-500 fill-current" />
              ) : (
                <Bookmark size={18} className="text-gray-400 hover:text-blue-500" />
              )}
            </button>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowShareMenu(!showShareMenu)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Сподели"
              >
                <Share2 size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[200px]">
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Сподели задача
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p 
        className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
        onClick={handleTaskClick}
      >
        {task.description}
      </p>

      {/* Attachments */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {task.attachments.slice(0, 3).map((attachment, index) => (
              <div key={index} className="flex-shrink-0">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            ))}
            {task.attachments.length > 3 && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                +{task.attachments.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location and Date */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDate(task.postedDate)}</span>
        </div>
      </div>

      {/* Price and Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(task.price, task.priceType)}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {task.rating}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({task.reviewCount})
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{task.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{task.applications} кандидати</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{task.postedBy}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTaskClick}
        className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
      >
        Преглед на задача
      </button>
    </div>
  )
} 