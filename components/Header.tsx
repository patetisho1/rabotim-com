'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Bell, ChevronDown, ArrowRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'tasker' | 'poster'>('poster')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [notificationsCount, setNotificationsCount] = useState(3)

  useEffect(() => {
    // Проверка дали потребителят е влязъл с NextAuth или localStorage
    if (session) {
      setIsLoggedIn(true)
      setUser(session.user)
    } else if (typeof window !== 'undefined') {
      const loginStatus = localStorage.getItem('isLoggedIn')
      const userData = localStorage.getItem('user')
      
      if (loginStatus === 'true' && userData) {
        try {
          setIsLoggedIn(true)
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }

    // Зареждане на броя любими задачи
    const loadFavoritesCount = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavoritesCount(favorites.length)
      } catch (error) {
        console.error('Error loading favorites count:', error)
      }
    }

    loadFavoritesCount()
    
    // Слушател за промени в localStorage
    const handleStorageChange = () => {
      loadFavoritesCount()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favoritesUpdated', loadFavoritesCount)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favoritesUpdated', loadFavoritesCount)
    }
  }, [session])

  const handleLogout = async () => {
    if (session) {
      // NextAuth logout
      await signOut({ callbackUrl: '/' })
    } else {
      // localStorage logout (demo users)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('user')
      }
      setIsLoggedIn(false)
      setUser(null)
      router.push('/')
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Actions */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              Rabotim.com
            </button>
            
            {/* Намери изпълнител бутон */}
            <button
              onClick={() => router.push('/post-task')}
              className="hidden sm:flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Намери изпълнител
            </button>
            
            {/* Категории бутон */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (!document.querySelector('.categories-dropdown:hover')) {
                      setIsCategoriesDropdownOpen(false)
                    }
                  }, 100)
                }}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Категории
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {/* Dropdown Menu */}
              {isCategoriesDropdownOpen && (
                <div 
                  className="categories-dropdown absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                  onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                >
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          router.push('/categories?role=tasker')
                          setIsCategoriesDropdownOpen(false)
                        }}
                        className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Ремонт</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Домашен ремонт</div>
                      </button>
                      <button
                        onClick={() => {
                          router.push('/categories?role=tasker')
                          setIsCategoriesDropdownOpen(false)
                        }}
                        className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Почистване</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Домашно почистване</div>
                      </button>
                      <button
                        onClick={() => {
                          router.push('/categories?role=tasker')
                          setIsCategoriesDropdownOpen(false)
                        }}
                        className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Грижа</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Грижа за деца</div>
                      </button>
                      <button
                        onClick={() => {
                          router.push('/categories?role=tasker')
                          setIsCategoriesDropdownOpen(false)
                        }}
                        className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">Доставка</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Куриерски услуги</div>
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          router.push('/categories')
                          setIsCategoriesDropdownOpen(false)
                        }}
                        className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Виж всички категории
                        <ArrowRight size={16} className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Разгледай задачи линк */}
            <button
              onClick={() => router.push('/browse-tasks')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Разгледай задачи
            </button>

            {/* Как работи линк */}
            <button
              onClick={() => router.push('/how-it-works')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Как работи
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/notifications')}
                  className="p-2 rounded relative"
                >
                  <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationsCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => router.push('/favorites')}
                  className="p-2 rounded relative"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </button>
                
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={16} />
                  Излез
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Вход
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full font-medium transition-colors duration-200"
                >
                  Стани изпълнител
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Prominent mobile find executor button */}
            <div className="px-4 mb-6">
              <button
                onClick={() => {
                  router.push('/post-task')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-200 shadow-sm"
              >
                Намери изпълнител
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="px-4 space-y-1 mb-6">
              <button
                onClick={() => {
                  setIsCategoriesDropdownOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="font-medium">Категории</span>
                <ChevronDown size={16} />
              </button>
              <button
                onClick={() => {
                  router.push('/browse-tasks')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="font-medium">Разгледай задачи</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  router.push('/how-it-works')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="font-medium">Как работи</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  router.push('/favorites')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="font-medium">Любими задачи</span>
                {favoritesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </nav>
            
            {/* Mobile User Menu */}
            {isLoggedIn ? (
              <div className="px-4 space-y-2">
                <div className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <User size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    router.push('/profile')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Профил
                </button>
                <button
                  onClick={() => {
                    router.push('/notifications')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Уведомления
                  {notificationsCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {notificationsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Излез
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <button
                  onClick={() => {
                    handleLogin()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Вход
                </button>
                <button
                  onClick={() => {
                    handleRegister()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Стани изпълнител
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 