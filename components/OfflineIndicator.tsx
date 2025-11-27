'use client'

import { useState, useEffect } from 'react'
import { WifiOff, Wifi, X } from 'lucide-react'
import { haptics } from '@/lib/haptics'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnected, setShowReconnected] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowReconnected(true)
      haptics.success()
      
      // Hide "reconnected" message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false)
      }, 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setIsDismissed(false)
      haptics.warning()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Don't show anything if online and no reconnection message
  if (isOnline && !showReconnected) return null

  // Don't show offline banner if dismissed
  if (!isOnline && isDismissed) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-slide-up">
      {!isOnline ? (
        // Offline banner
        <div className="bg-red-600 text-white rounded-xl shadow-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <WifiOff className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Няма интернет връзка</p>
            <p className="text-sm text-red-200">Някои функции може да не работят</p>
          </div>
          <button
            onClick={() => { haptics.light(); setIsDismissed(true) }}
            className="p-2 hover:bg-red-500 rounded-full transition-colors touch-manipulation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : showReconnected ? (
        // Reconnected banner
        <div className="bg-green-600 text-white rounded-xl shadow-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Wifi className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Връзката е възстановена</p>
            <p className="text-sm text-green-200">Всичко работи нормално</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

