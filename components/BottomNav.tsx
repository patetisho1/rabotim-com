'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const navItems = [
    {
      name: 'Начало',
      icon: Home,
      path: '/',
      requiresAuth: false
    },
    {
      name: 'Задачи',
      icon: Search,
      path: '/tasks',
      requiresAuth: false
    },
    {
      name: 'Публикувай',
      icon: PlusCircle,
      path: '/post-task',
      requiresAuth: true,
      highlight: true
    },
    {
      name: 'Съобщения',
      icon: MessageCircle,
      path: '/messages',
      requiresAuth: true
    },
    {
      name: 'Профил',
      icon: User,
      path: user ? '/profile' : '/login',
      requiresAuth: false
    }
  ]

  const handleNavClick = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !user) {
      router.push('/login')
      return
    }
    router.push(path)
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation - Only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path, item.requiresAuth)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors touch-manipulation ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                } ${
                  item.highlight && !active
                    ? 'hover:text-blue-500'
                    : 'hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className={`relative ${item.highlight ? 'transform scale-110' : ''}`}>
                  <Icon 
                    size={24} 
                    className={active ? 'stroke-[2.5]' : 'stroke-2'}
                  />
                  {item.highlight && (
                    <div className="absolute -inset-2 bg-blue-100 dark:bg-blue-900/30 rounded-full -z-10" />
                  )}
                </div>
                <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}




