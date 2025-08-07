'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface TouchGesturesProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onLongPress?: () => void
  onDoubleTap?: () => void
  threshold?: number
  longPressDelay?: number
  className?: string
}

export default function TouchGestures({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  onDoubleTap,
  threshold = 50,
  longPressDelay = 500,
  className = ''
}: TouchGesturesProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [lastTap, setLastTap] = useState<number>(0)
  const [isLongPressing, setIsLongPressing] = useState(false)
  
  const elementRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setTouchEnd(null)
    setIsLongPressing(false)

    // Start long press timer
    const timer = setTimeout(() => {
      setIsLongPressing(true)
      onLongPress?.()
    }, longPressDelay)
    
    setLongPressTimer(timer)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isLongPressing) return
    
    const touch = e.touches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
    
    // Cancel long press if user moves finger
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    if (!touchStart || !touchEnd) {
      // Handle tap/double tap
      const now = Date.now()
      const DOUBLE_TAP_DELAY = 300
      
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        onDoubleTap?.()
        setLastTap(0)
      } else {
        setLastTap(now)
      }
      return
    }

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    if (isHorizontalSwipe && Math.abs(distanceX) > threshold) {
      if (distanceX > 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    } else if (isVerticalSwipe && Math.abs(distanceY) > threshold) {
      if (distanceY > 0) {
        onSwipeUp?.()
      } else {
        onSwipeDown?.()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
    setIsLongPressing(false)
  }

  const handleTouchCancel = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    setTouchStart(null)
    setTouchEnd(null)
    setIsLongPressing(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [longPressTimer])

  return (
    <div
      ref={elementRef}
      className={`touch-feedback ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
      
      {/* Visual feedback for long press */}
      {isLongPressing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  )
}

// Hook for touch gestures
export function useTouchGestures() {
  const [gestures, setGestures] = useState({
    swipeLeft: false,
    swipeRight: false,
    swipeUp: false,
    swipeDown: false,
    longPress: false,
    doubleTap: false
  })

  const resetGestures = () => {
    setGestures({
      swipeLeft: false,
      swipeRight: false,
      swipeUp: false,
      swipeDown: false,
      longPress: false,
      doubleTap: false
    })
  }

  return { gestures, resetGestures }
}

// Hook for detecting device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isTouch: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasHover: false,
    hasPointer: false
  })

  useEffect(() => {
    const updateCapabilities = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isMobile = window.innerWidth <= 768
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024
      const isDesktop = window.innerWidth > 1024
      const hasHover = window.matchMedia('(hover: hover)').matches
      const hasPointer = window.matchMedia('(pointer: fine)').matches

      setCapabilities({
        isTouch,
        isMobile,
        isTablet,
        isDesktop,
        hasHover,
        hasPointer
      })
    }

    updateCapabilities()
    window.addEventListener('resize', updateCapabilities)
    
    return () => window.removeEventListener('resize', updateCapabilities)
  }, [])

  return capabilities
}

// Hook for detecting orientation changes
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)
    
    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

// Hook for detecting safe areas
export function useSafeAreas() {
  const [safeAreas, setSafeAreas] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  useEffect(() => {
    const updateSafeAreas = () => {
      const style = getComputedStyle(document.documentElement)
      setSafeAreas({
        top: parseInt(style.getPropertyValue('--sat') || '0'),
        right: parseInt(style.getPropertyValue('--sar') || '0'),
        bottom: parseInt(style.getPropertyValue('--sab') || '0'),
        left: parseInt(style.getPropertyValue('--sal') || '0')
      })
    }

    updateSafeAreas()
    window.addEventListener('resize', updateSafeAreas)
    
    return () => window.removeEventListener('resize', updateSafeAreas)
  }, [])

  return safeAreas
} 