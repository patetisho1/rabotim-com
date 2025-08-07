'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Проверка на текущото състояние
    setIsOnline(navigator.onLine)

    // Слушане за промени в мрежовата връзка
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (isOnline) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff size={32} className="text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Няма интернет връзка
        </h1>
        
        <p className="text-gray-600 mb-8">
          Изглежда, че нямате интернет връзка. Проверете вашата мрежова връзка и опитайте отново.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Опитай отново
          </button>
          
          <div className="text-sm text-gray-500">
            <p>Някои функции може да не работят без интернет връзка</p>
          </div>
        </div>

        {/* Offline Features */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            Доступни функции офлайн:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Преглед на кеширани задачи</li>
            <li>• Преглед на профила</li>
            <li>• Локални настройки</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 