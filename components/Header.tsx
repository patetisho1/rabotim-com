'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Bell } from 'lucide-react'
export default function Header() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-blue-600"
            >
              Rabotim.com
            </button>
            {/* Публикувай бутон до логото */}
            <button
              onClick={() => router.push('/post-task')}
              className="hidden sm:flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Публикувай
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-600"
            >
              Профил
            </button>
            <button
              onClick={() => router.push('/ratings')}
              className="text-gray-600"
            >
              Рейтинги
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/notifications')}
                  className="p-2 rounded relative"
                >
                  <Bell size={20} className="text-gray-600" />
                </button>
                {/* <ThemeToggle /> */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm border border-gray-300 rounded flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Излез
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-gray-600"
                >
                  Вход
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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
              className="p-2 rounded text-gray-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Prominent mobile publish button */}
            <div className="px-4 mb-4">
              <button
                onClick={() => {
                  router.push('/post-task')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-200 shadow-sm"
              >
                Публикувай задача
              </button>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => {
                  router.push('/profile')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-600"
              >
                Профил
              </button>
              <button
                onClick={() => {
                  router.push('/notifications')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 relative"
              >
                <div className="flex items-center justify-between">
                  <span>Известия</span>
                </div>
              </button>
            </nav>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={12} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName || 'User'} {user?.lastName || ''}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded flex items-center justify-center gap-2"
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
                    className="w-full text-left px-4 py-2 text-gray-600"
                  >
                    Вход
                  </button>
                  <button
                    onClick={() => {
                      handleRegister()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded"
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