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
  BookmarkCheck,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Task } from '@/hooks/useTasksAPI'

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
  const [isBoosted, setIsBoosted] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [userData, setUserData] = useState({
    name: 'Потребител',
    rating: 4.5,
    avatar: '/default-avatar.png',
    verified: false
  })

  // Функция за получаване на снимка според категорията
  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'Почистване':
        return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
      case 'Ремонт':
        return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop'
      case 'Доставка':
        return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=250&fit=crop'
      case 'Градинарство':
        return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop'
      case 'Обучение':
        return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop'
      default:
        return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop'
    }
  }

  useEffect(() => {
    // Проверка дали задачата е в любими
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(task.id))
    
    // Проверка дали задачата е запазена
    const saved = JSON.parse(localStorage.getItem('savedTasks') || '[]')
    setIsSaved(saved.includes(task.id))

    // Проверка дали задачата е boost-ната
    const boosted = JSON.parse(localStorage.getItem('boostedTasks') || '[]')
    setIsBoosted(boosted.includes(task.id))

    // Използваме данните от Supabase (task.profiles)
    if (task.profiles) {
      setUserData({
        name: task.profiles.full_name || 'Потребител',
        rating: task.rating || 4.5,
        avatar: task.profiles.avatar_url || '/default-avatar.png',
        verified: task.profiles.verified || false
      })
    }
  }, [task.id, task.profiles, task.rating])

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

  // Swipe gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      // Left swipe - add to favorites
      handleFavoriteToggle()
    } else if (isRightSwipe) {
      // Right swipe - share task
      handleShare()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: task.description,
          url: `${window.location.origin}/task/${task.id}`,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setShowShareMenu(!showShareMenu)
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

  const handleBoostClick = () => {
    // Проверка дали потребителят е логнат
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn !== 'true') {
      toast.error('Трябва да сте влезли в акаунта си за да boost-нете задача')
      router.push('/login')
      return
    }

    // Навигация към boost страницата
    router.push(`/admin?boostTask=${task.id}`)
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

  const formatPrice = (price: number, priceType: string) => {
    return priceType === 'hourly' ? `${price} лв/час` : `${price} лв`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Изтекъл срок'
    if (diffDays === 0) return 'Днес'
    if (diffDays === 1) return 'Утре'
    if (diffDays <= 7) return `След ${diffDays} дни`
    return date.toLocaleDateString('bg-BG')
  }

  const handleCardClick = () => {
    router.push(`/task/${task.id}`)
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
    >
      {/* Mobile-optimized Image - Better height for visibility */}
      <div className="relative h-40 sm:h-56 overflow-hidden">
        <img 
          src={getCategoryImage(task.category)} 
          alt={task.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category overlay - smaller on mobile */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-600 text-white shadow-lg">
            {task.category}
          </span>
        </div>
        {/* Urgent badge overlay - smaller on mobile */}
        {task.urgent && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white shadow-lg">
              Спешно
            </span>
          </div>
        )}
        {/* Heart icon overlay for mobile */}
        <div className="absolute bottom-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFavoriteToggle()
            }}
            className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            {isFavorite ? <Heart size={16} className="fill-current" /> : <HeartOff size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile-optimized card layout - Better padding */}
      <div className="p-4 sm:p-6">
        {/* Title - Better visibility */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 leading-tight">
          {task.title}
        </h3>
        
        {/* Price and location row - Mobile optimized */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(task.price, task.price_type)}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={12} />
            <span className="truncate max-w-[80px]">{task.location}</span>
          </div>
        </div>

        {/* Bottom row - Date and rating - Mobile compact */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(task.created_at)}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span>{task.rating}</span>
          </div>
        </div>

        {/* Action buttons - Hidden on mobile, shown on desktop */}
        {showActions && (
          <div className="hidden sm:flex gap-2 sm:gap-3 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleFavoriteToggle()
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 min-h-[48px] touch-manipulation ${
                isFavorite
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
              }`}
            >
              {isFavorite ? <Heart size={18} className="fill-current" /> : <HeartOff size={18} />}
              <span>Любима</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/submit-offer/${task.id}`)
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 min-h-[48px] touch-manipulation"
            >
              Подай оферта
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              className="p-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 border border-gray-200 rounded-lg transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            >
              <Share2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Share menu overlay */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Сподели задача</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/task/${task.id}`)
                  toast.success('Линкът е копиран!')
                  setShowShareMenu(false)
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Копирай линк
              </button>
              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/task/${task.id}`)}`, '_blank')
                  setShowShareMenu(false)
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Сподели във Facebook
              </button>
              <button
                onClick={() => setShowShareMenu(false)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 