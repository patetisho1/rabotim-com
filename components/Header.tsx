'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Bell, ChevronDown, ArrowRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const router = useRouter()
  const { user: authUser, loading: authLoading, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'tasker' | 'poster'>('poster')
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [notificationsCount, setNotificationsCount] = useState(3)

  useEffect(() => {
    // Автентикацията се управлява от useAuth hook

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
  }, [authUser])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
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
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={() => router.push('/')}
              className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Rabotim.com
            </button>
            
            {/* Desktop Navigation - скрито на mobile */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Пусни обява бутон */}
              <button
                onClick={() => router.push('/post-task')}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Пусни обява
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
                onClick={() => router.push('/tasks')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Разгледай задачи
              </button>
              
              {/* Моите задачи линк - само за влезли потребители */}
              {authUser && (
                <button
                  onClick={() => router.push('/my-tasks')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Моите задачи
                </button>
              )}

              {/* Как работи линк */}
              <button
                onClick={() => router.push('/how-it-works')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Как работи
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {authUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/notifications')}
                  className="p-2 rounded relative min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                  className="p-2 rounded relative min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {authUser?.user_metadata?.full_name || 'Потребител'}
                  </span>
                </button>
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

          {/* Mobile Menu Button - Enhanced */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded text-gray-600 dark:text-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Prominent mobile post task button */}
            <div className="px-4 mb-6">
              <button
                onClick={() => {
                  router.push('/post-task')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full font-medium transition-colors duration-200 shadow-sm min-h-[56px] touch-manipulation"
              >
                Пусни обява
              </button>
            </div>
            
            {/* Mobile Navigation - Enhanced */}
            <nav className="px-4 space-y-2 mb-6">
              <button
                onClick={() => {
                  setIsCategoriesDropdownOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
              >
                <span className="font-medium">Категории</span>
                <ChevronDown size={16} />
              </button>
              
              <button
                onClick={() => {
                  router.push('/tasks')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
              >
                <span className="font-medium">Разгледай задачи</span>
                <ArrowRight size={16} />
              </button>
              
              {authUser && (
                <button
                  onClick={() => {
                    router.push('/my-tasks')
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-between w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
                >
                  <span className="font-medium">Моите задачи</span>
                  <ArrowRight size={16} />
                </button>
              )}
              
              <button
                onClick={() => {
                  router.push('/how-it-works')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
              >
                <span className="font-medium">Как работи</span>
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => {
                  router.push('/favorites')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
              >
                <span className="font-medium">Любими задачи</span>
                {favoritesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </nav>
            
            {/* Mobile User Menu - Enhanced */}
            {authUser ? (
              <div className="px-4 space-y-2">
                <div className="flex items-center px-4 py-4 text-gray-700 dark:text-gray-300">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">
                    {authUser?.user_metadata?.full_name || 'Потребител'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    router.push('/profile')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
                >
                  Профил
                </button>
                <button
                  onClick={() => {
                    router.push('/notifications')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
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
                  className="w-full text-left px-4 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[56px] touch-manipulation"
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
                  className="w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[56px] touch-manipulation"
                >
                  Вход
                </button>
                <button
                  onClick={() => {
                    handleRegister()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors min-h-[56px] touch-manipulation"
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