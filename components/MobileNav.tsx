'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  User, 
  MapPin, 
  Bell, 
  Settings,
  Bookmark,
  MessageCircle,
  TrendingUp,
  Filter
} from 'lucide-react'

interface MobileNavProps {
  currentPath: string
  notificationsCount?: number
  favoritesCount?: number
}

export default function MobileNav({ currentPath, notificationsCount = 0, favoritesCount = 0 }: MobileNavProps) {
  const router = useRouter()
  const [showQuickActions, setShowQuickActions] = useState(false)

  const navItems = [
    {
      icon: Home,
      label: 'Начало',
      path: '/',
      active: currentPath === '/'
    },
    {
      icon: Search,
      label: 'Търси',
      path: '/tasks',
      active: currentPath === '/tasks' || currentPath === '/browse-tasks'
    },
    {
      icon: Plus,
      label: 'Пусни',
      path: '/post-task',
      active: currentPath === '/post-task',
      isAction: true
    },
    {
      icon: Heart,
      label: 'Любими',
      path: '/favorites',
      active: currentPath === '/favorites',
      badge: favoritesCount
    },
    {
      icon: User,
      label: 'Профил',
      path: '/profile',
      active: currentPath === '/profile' || currentPath === '/my-tasks'
    }
  ]

  const quickActions = [
    {
      icon: MapPin,
      label: 'Наблизо',
      action: () => router.push('/tasks?location=nearby')
    },
    {
      icon: TrendingUp,
      label: 'Трендове',
      action: () => router.push('/tasks?sort=trending')
    },
    {
      icon: Filter,
      label: 'Филтри',
      action: () => {
        // Trigger filter modal or scroll to filters
        const filterSection = document.querySelector('[data-filter-section]')
        if (filterSection) {
          filterSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    {
      icon: MessageCircle,
      label: 'Съобщения',
      action: () => router.push('/messages')
    }
  ]

  const handleNavClick = (item: any) => {
    if (item.isAction) {
      setShowQuickActions(!showQuickActions)
    } else {
      router.push(item.path)
    }
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-h-[56px] min-w-[56px] touch-manipulation ${
                  item.active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <div className="relative">
                  <IconComponent size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Quick Actions Modal */}
      {showQuickActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Бързи действия
              </h3>
              <button
                onClick={() => setShowQuickActions(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <button
                    key={index}
                    onClick={() => {
                      action.action()
                      setShowQuickActions(false)
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-h-[80px] touch-manipulation"
                  >
                    <IconComponent size={24} className="text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {action.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => router.push('/post-task')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Bottom Spacing for Mobile */}
      <div className="h-20 md:hidden"></div>
    </>
  )
} 