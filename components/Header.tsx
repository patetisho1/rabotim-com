'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Bell, Shield } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Проверка дали потребителят е влязъл
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loginStatus === 'true' && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    router.push('/')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Rabotim.com
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/tasks')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Задачи
            </button>
            <button
              onClick={() => router.push('/post-task')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Публикувай
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Профил
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/notifications')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full"></span>
                </button>
                <button
                  onClick={() => router.push('/admin')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Админ панел"
                >
                  <Shield size={20} className="text-gray-600" />
                </button>
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Излез
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Вход
                </button>
                <button
                  onClick={handleRegister}
                  className="btn btn-primary"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  router.push('/tasks')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Задачи
              </button>
              <button
                onClick={() => {
                  router.push('/post-task')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Публикувай
              </button>
              <button
                onClick={() => {
                  router.push('/profile')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Профил
              </button>
            </nav>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={12} className="text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full btn btn-outline text-sm flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Излез
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Вход
                  </button>
                  <button
                    onClick={() => {
                      handleRegister()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full btn btn-primary"
                  >
                    Регистрация
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 