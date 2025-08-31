'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, ArrowLeft, ArrowRight, Home, Search, Heart, User } from 'lucide-react'

interface TouchGesturesProps {
  children: React.ReactNode
  onRefresh?: () => void
  currentPath?: string
}

export default function TouchGestures({ children, onRefresh, currentPath = '/' }: TouchGesturesProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false)

  // Minimum swipe distance
  const minSwipeDistance = 50

  // Navigation paths for swipe gestures
  const navigationPaths = {
    '/': { left: '/tasks', right: '/favorites' },
    '/tasks': { left: '/favorites', right: '/' },
    '/favorites': { left: '/', right: '/tasks' },
    '/profile': { left: '/favorites', right: '/tasks' }
  }

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
    
    // Pull to refresh logic
    if (e.targetTouches[0].clientY > touchStart.y && window.scrollY === 0) {
      const distance = e.targetTouches[0].clientY - touchStart.y
      setPullDistance(Math.min(distance * 0.5, 100))
      
      if (distance > 80) {
        setShowRefreshIndicator(true)
      }
    }
  }

  const handleTouchEnd = () => {
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      // Horizontal swipe navigation
      const currentPaths = navigationPaths[currentPath as keyof typeof navigationPaths]
      if (currentPaths) {
        if (distanceX > 0) {
          // Swipe left - go to right path
          router.push(currentPaths.right)
        } else {
          // Swipe right - go to left path
          router.push(currentPaths.left)
        }
      }
    } else if (distanceY > 80 && window.scrollY === 0 && showRefreshIndicator) {
      // Pull to refresh
      handleRefresh()
    }
    
    // Reset states
    setPullDistance(0)
    setShowRefreshIndicator(false)
    setTouchStart({ x: 0, y: 0 })
    setTouchEnd({ x: 0, y: 0 })
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Don't handle navigation when typing
      }
      
      const currentPaths = navigationPaths[currentPath as keyof typeof navigationPaths]
      if (!currentPaths) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          router.push(currentPaths.left)
          break
        case 'ArrowRight':
          e.preventDefault()
          router.push(currentPaths.right)
          break
        case 'Home':
          e.preventDefault()
          router.push('/')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPath, router])

  // Touch event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart, touchEnd, showRefreshIndicator])

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 transition-all duration-200"
          style={{ height: `${pullDistance}px` }}
        >
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <RefreshCw 
              size={20} 
              className={`transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className="text-sm font-medium">
              {showRefreshIndicator ? 'Пусни за обновяване' : 'Дръпни за обновяване'}
            </span>
          </div>
        </div>
      )}

      {/* Swipe Navigation Hints */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <ArrowLeft size={12} />
          <span>Свайп за навигация</span>
          <ArrowRight size={12} />
        </div>
      </div>

      {/* Navigation Dots Indicator */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            currentPath === '/' ? 'bg-blue-600' : 'bg-gray-300'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${
            currentPath === '/tasks' ? 'bg-blue-600' : 'bg-gray-300'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${
            currentPath === '/favorites' ? 'bg-blue-600' : 'bg-gray-300'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${
            currentPath === '/profile' ? 'bg-blue-600' : 'bg-gray-300'
          }`} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {children}
      </div>

      {/* Swipe Gesture Overlay for Visual Feedback */}
      <div className="fixed inset-0 pointer-events-none z-30 md:hidden">
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity duration-200" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-500/10 to-transparent opacity-0 transition-opacity duration-200" />
      </div>
    </div>
  )
} 