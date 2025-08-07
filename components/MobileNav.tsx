'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  Plus, 
  MessageCircle, 
  User,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Heart,
  FileText,
  Star
} from 'lucide-react'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', icon: Home, label: 'Начало' },
    { href: '/tasks', icon: Search, label: 'Обяви' },
    { href: '/post-task', icon: Plus, label: 'Публикувай' },
    { href: '/messages', icon: MessageCircle, label: 'Съобщения' },
    { href: '/profile', icon: User, label: 'Профил' }
  ]

  const menuItems = [
    { href: '/notifications', icon: Bell, label: 'Известия' },
    { href: '/favorites', icon: Heart, label: 'Любими' },
    { href: '/my-tasks', icon: FileText, label: 'Моите обяви' },
    { href: '/reviews', icon: Star, label: 'Отзиви' },
    { href: '/settings', icon: Settings, label: 'Настройки' },
    { href: '/logout', icon: LogOut, label: 'Изход' }
  ]

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
                )}
              </Link>
            )
          })}
          
          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
              isOpen 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {isOpen ? <X size={20} className="mb-1" /> : <Menu size={20} className="mb-1" />}
            <span className="text-xs font-medium">Меню</span>
          </button>
        </div>
      </nav>

      {/* Slide-up Menu */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute bottom-16 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          
          {/* Menu Items */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-2 gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={24} className="text-gray-600 dark:text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </>
  )
} 