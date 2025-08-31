'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setShowMenu(false)
  }

  const getCurrentThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} className="text-yellow-500" />
    if (theme === 'dark') return <Moon size={20} className="text-blue-400" />
    return <Monitor size={20} className="text-gray-600 dark:text-gray-400" />
  }

  const getCurrentThemeLabel = () => {
    if (theme === 'light') return 'Светла тема'
    if (theme === 'dark') return 'Тъмна тема'
    return 'Системна тема'
  }

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    )
  }

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
        aria-label="Превключи тема"
      >
        {getCurrentThemeIcon()}
        
        {/* Active indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 animate-pulse" />
      </button>

      {/* Theme Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                Избери тема
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors min-h-[48px] touch-manipulation ${
                    theme === 'light'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Sun size={18} className="text-yellow-500" />
                  <span className="font-medium">Светла</span>
                  {theme === 'light' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors min-h-[48px] touch-manipulation ${
                    theme === 'dark'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Moon size={18} className="text-blue-400" />
                  <span className="font-medium">Тъмна</span>
                  {theme === 'dark' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors min-h-[48px] touch-manipulation ${
                    theme === 'system'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Monitor size={18} className="text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Системна</span>
                  {theme === 'system' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Quick Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => {
            const newTheme = theme === 'light' ? 'dark' : 'light'
            handleThemeChange(newTheme)
          }}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-200 hover:shadow-xl touch-manipulation"
          aria-label="Бързо превключване на тема"
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-600" />
          ) : (
            <Sun size={20} className="text-yellow-500" />
          )}
        </button>
      </div>

      {/* Theme Indicator for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
          {getCurrentThemeLabel()}
        </div>
      </div>
    </div>
  )
} 