'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Bell, ChevronDown } from 'lucide-react'
export default function Header() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'tasker' | 'poster'>('poster')
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
          {/* Logo and Main Actions */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-blue-600"
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
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                Категории
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {/* Dropdown Menu */}
              {isCategoriesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white border border-gray-200 rounded-lg shadow-xl z-50 categories-dropdown"
                  onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      setIsCategoriesDropdownOpen(false)
                    }, 150)
                  }}
                >
                  <div className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                      {/* Left Section - Role Selection */}
                      <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Какво търсите?</h3>
                        <p className="text-sm text-gray-600 mb-4">Изберете тип задача.</p>
                        
                        <div className="space-y-3">
                          <button 
                            onClick={() => setSelectedRole('tasker')}
                            className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                              selectedRole === 'tasker' 
                                ? 'bg-blue-50 border-l-4 border-blue-500' 
                                : 'bg-gray-50 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500'
                            }`}
                          >
                            <div className="font-semibold text-gray-900">КАТО ИЗПЪЛНИТЕЛ</div>
                            <div className="text-sm text-gray-600">Търся работа в...</div>
                          </button>
                          
                          <button 
                            onClick={() => setSelectedRole('poster')}
                            className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                              selectedRole === 'poster' 
                                ? 'bg-blue-50 border-l-4 border-blue-500' 
                                : 'bg-gray-50 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500'
                            }`}
                          >
                            <div className="font-semibold text-gray-900">КАТО ВЪЗЛОЖИТЕЛ</div>
                            <div className="text-sm text-gray-600">Търся да наема някого за...</div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Right Section - Categories Grid */}
                      <div className="lg:col-span-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                          {[
                            'Счетоводство', 'Администрация', 'Промени и поправки на дрехи', 'Електроуреди', 'Архитекти',
                            'Сглобяване', 'Аудио-визуални услуги', 'Автоелектротехник', 'Пекари', 'Доставка на балони',
                            'Фризьори за мъже / бръснари', 'Ремонт на баня', 'Козметици', 'Сервиз за велосипеди', 'Зидар',
                            'Строителство', 'Бизнес услуги', 'Доставка на торти', 'Автобояджия', 'Детайлно почистване на автомобили',
                            'Преглед на автомобил', 'Ремонт на автомобил', 'Автосервиз', 'Автомивка', 'Дърводелство',
                            'Пране на килими', 'Грижа за котки', 'Кетъринг', 'Готвач', 'Грижи и безопасност за деца',
                            'Облицовки', 'Почистване', 'Услуги по разчистване', 'Коучинг / личен треньор', 'Доставка на кафе',
                            'Професионално почистване', 'Компютри и IT услуги', 'Бетонни работи', 'Готвене', 'Консултиране и терапия',
                            'Куриерски услуги', 'Уроци по танци', 'Дървена тераса / декинг', 'Доставка', 'Дизайн',
                            'Доставка на десерти', 'Грижа за кучета', 'Технически чертожник', 'Шофьорски услуги', 'Електротехници',
                            'Ремонт на електроника', 'Гравиране', 'Забавления', 'Събития', 'Ограждане и огради',
                            'Фитнес', 'Подови настилки', 'Цветар', 'Доставка на цветя', 'Доставка на храна'
                          ].map((category, index) => (
                            <button 
                              key={index}
                              onClick={() => {
                                const route = selectedRole === 'tasker' ? '/tasks' : '/post-task'
                                router.push(`${route}?category=${encodeURIComponent(category)}&role=${selectedRole}`)
                                setIsCategoriesDropdownOpen(false)
                              }}
                              className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-0 py-0 transition-colors"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                        
                        {/* View All Link */}
                        <div className="mt-4 text-right">
                          <button 
                            onClick={() => {
                              router.push(`/categories?role=${selectedRole}`)
                              setIsCategoriesDropdownOpen(false)
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Виж всички →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
                  className="px-4 py-2 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-full font-medium transition-colors duration-200"
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
              className="p-2 rounded text-gray-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Prominent mobile find executor button */}
            <div className="px-4 mb-4">
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
                    Стани изпълнител
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