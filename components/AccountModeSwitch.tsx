'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Briefcase, ChevronDown, Crown, Sparkles } from 'lucide-react'
import { useAccountMode } from '@/contexts/AccountModeContext'
import { useAuth } from '@/hooks/useAuth'

export default function AccountModeSwitch() {
  const router = useRouter()
  const { user } = useAuth()
  const { mode, setMode, professionalStatus, isLoadingStatus } = useAccountMode()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleModeChange = (newMode: 'normal' | 'professional') => {
    if (newMode === 'professional') {
      if (!professionalStatus.hasDraft) {
        // No professional profile yet - redirect to create one
        router.push('/profile/professional')
      } else if (!professionalStatus.isActive) {
        // Has draft but not paid - show upgrade prompt
        router.push('/premium')
      }
    }
    setMode(newMode)
    setIsOpen(false)
  }

  const getModeDisplay = () => {
    if (mode === 'professional') {
      if (professionalStatus.isActive) {
        return {
          icon: <Crown className="h-4 w-4 text-yellow-500" />,
          label: 'Professional',
          sublabel: professionalStatus.planType ? `(${professionalStatus.planType})` : '',
          color: 'text-yellow-600 dark:text-yellow-400'
        }
      } else if (professionalStatus.hasDraft) {
        return {
          icon: <Briefcase className="h-4 w-4 text-orange-500" />,
          label: 'Professional',
          sublabel: '(чернова)',
          color: 'text-orange-600 dark:text-orange-400'
        }
      }
    }
    return {
      icon: <User className="h-4 w-4 text-blue-500" />,
      label: 'Обикновен',
      sublabel: '',
      color: 'text-gray-700 dark:text-gray-300'
    }
  }

  const display = getModeDisplay()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${display.color}`}
      >
        {display.icon}
        <span className="text-sm font-medium hidden sm:inline">
          {display.label}
          {display.sublabel && <span className="text-xs ml-1 opacity-75">{display.sublabel}</span>}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2">
              {/* Normal Account Option */}
              <button
                onClick={() => handleModeChange('normal')}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  mode === 'normal' 
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`p-2 rounded-full ${mode === 'normal' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <User className={`h-5 w-5 ${mode === 'normal' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">Обикновен акаунт</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Пускай обяви и кандидатствай по задачи
                  </div>
                </div>
                {mode === 'normal' && (
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">✓</div>
                )}
              </button>

              {/* Professional Account Option */}
              <button
                onClick={() => handleModeChange('professional')}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors mt-1 ${
                  mode === 'professional' 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-800' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  mode === 'professional' 
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {professionalStatus.isActive ? (
                    <Crown className={`h-5 w-5 ${mode === 'professional' ? 'text-yellow-600' : 'text-gray-500'}`} />
                  ) : (
                    <Briefcase className={`h-5 w-5 ${mode === 'professional' ? 'text-orange-600' : 'text-gray-500'}`} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Professional акаунт</span>
                    {!professionalStatus.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400">
                        {professionalStatus.hasDraft ? 'Чернова' : 'Ново'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {professionalStatus.isActive 
                      ? 'Листван в каталога с професионалисти'
                      : professionalStatus.hasDraft
                        ? 'Активирай за да се появиш в каталога'
                        : 'Създай профил и се появи в каталога'
                    }
                  </div>
                </div>
                {mode === 'professional' && (
                  <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">✓</div>
                )}
              </button>
            </div>

            {/* Footer with CTA */}
            {!professionalStatus.isActive && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push(professionalStatus.hasDraft ? '/premium' : '/profile/professional')
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  {professionalStatus.hasDraft ? 'Активирай Professional' : 'Стани Professional'}
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  от 29€/месец • Листване в каталога • Повече видимост
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}


