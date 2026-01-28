'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Settings, Check } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  functional: true,
  analytics: false,
  marketing: false
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      try {
        const savedPrefs = JSON.parse(consent)
        setPreferences(savedPrefs)
      } catch {
        // Invalid data, show banner again
        setIsVisible(true)
      }
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setPreferences(prefs)
    setIsVisible(false)
    setShowSettings(false)
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }))
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    })
  }

  const acceptSelected = () => {
    saveConsent(preferences)
  }

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    })
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop - only show when settings are open */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden pointer-events-auto">
            {/* Main Banner */}
            {!showSettings ? (
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0">
                    <Cookie size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      🍪 Използваме бисквитки
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Използваме бисквитки, за да подобрим вашето преживяване, да персонализираме съдържанието 
                      и да анализираме трафика. Можете да изберете кои бисквитки да приемете.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Check size={18} />
                        Приемам всички
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Settings size={18} />
                        Настройки
                      </button>
                      <button
                        onClick={rejectAll}
                        className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
                      >
                        Само необходими
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                      Вижте нашата{' '}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                        Политика за поверителност
                      </Link>
                      {' '}за повече информация.
                    </p>
                  </div>
                  <button
                    onClick={rejectAll}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                    aria-label="Затвори"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              /* Settings Panel */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Настройки на бисквитките
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Необходими</h4>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                          Винаги активни
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Необходими за работата на сайта - вход, сесии, сигурност.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-not-allowed opacity-50"
                    />
                  </div>

                  {/* Functional */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Функционални</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Запомнят вашите предпочитания - тема, език, настройки.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Аналитични</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Помагат ни да разберем как използвате сайта и да го подобрим.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Маркетингови</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Използват се за персонализирани реклами в сайта и извън него.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={acceptSelected}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Запази избора
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Приемам всички
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

