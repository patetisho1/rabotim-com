'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface SPANavigationProps {
  children: React.ReactNode
}

export default function SPANavigation({ children }: SPANavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPath, setLoadingPath] = useState('')

  useEffect(() => {
    // Слушател за route промени
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleComplete = () => {
      setIsLoading(false)
      setLoadingPath('')
    }

    // Добавяме слушатели за навигация
    window.addEventListener('beforeunload', handleStart)
    window.addEventListener('load', handleComplete)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      window.removeEventListener('load', handleComplete)
    }
  }, [])

  // Плавни преходи между страници
  useEffect(() => {
    const handleRouteChange = () => {
      // Добавяме CSS клас за плавен преход
      document.body.classList.add('page-transitioning')
      
      setTimeout(() => {
        document.body.classList.remove('page-transitioning')
      }, 300)
    }

    // Слушаме за промени в pathname
    handleRouteChange()
  }, [pathname])

  return (
    <>
      {/* Loading индикатор */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-blue-600 animate-pulse">
            <div className="h-full bg-blue-400 animate-ping"></div>
          </div>
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Зареждане...
            </span>
          </div>
        </div>
      )}

      {/* Основно съдържание */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>

      {/* SPA Navigation Enhancement */}
      <style jsx global>{`
        .page-transitioning {
          transition: opacity 0.3s ease-in-out;
        }
        
        .page-transitioning * {
          pointer-events: none;
        }
        
        /* Плавни преходи за всички линкове */
        a {
          transition: all 0.2s ease-in-out;
        }
        
        /* Подобрени hover ефекти */
        button, .btn {
          transition: all 0.2s ease-in-out;
        }
        
        /* Loading анимации */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        /* SPA оптимизации */
        .spa-optimized {
          will-change: transform, opacity;
        }
        
        /* Подобрено скролиране */
        html {
          scroll-behavior: smooth;
        }
        
        /* Оптимизация за мобилни устройства */
        @media (max-width: 768px) {
          .page-transitioning {
            transition: opacity 0.2s ease-in-out;
          }
        }
      `}</style>
    </>
  )
}
