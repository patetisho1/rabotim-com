'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Globe, CheckCircle, Info } from 'lucide-react'

interface PWAInstallProps {
  onInstall?: () => void
  onDismiss?: () => void
}

export default function PWAInstall({ onInstall, onDismiss }: PWAInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showBenefits, setShowBenefits] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return true
      }
      return false
    }

    // Check if previously dismissed
    const dismissedTime = localStorage.getItem('pwa-dismissed')
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
      setDismissed(true)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a delay if not dismissed
      if (!dismissed && !checkIfInstalled()) {
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 3000)
      }
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      onInstall?.()
    }

    // Check if running in standalone mode
    if (checkIfInstalled()) {
      return
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [dismissed, onInstall])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowInstallPrompt(false)
        onInstall?.()
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-dismissed', Date.now().toString())
    onDismiss?.()
  }

  const handleShowBenefits = () => {
    setShowBenefits(true)
  }

  if (isInstalled || dismissed || !showInstallPrompt) {
    return null
  }

  return (
    <>
      {/* Main Install Prompt */}
      <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Smartphone size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Инсталирай Rabotim
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Бърз достъп от началния екран
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                <span>Бърз достъп без браузър</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                <span>Работи офлайн</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                <span>По-бързо зареждане</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Инсталиране...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Инсталирай
                  </>
                )}
              </button>
              
              <button
                onClick={handleShowBenefits}
                className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors min-h-[48px] touch-manipulation"
              >
                <Info size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Modal */}
      {showBenefits && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Защо да инсталираш?
                </h3>
                <button
                  onClick={() => setShowBenefits(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Smartphone size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Като нативно приложение
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Достъп от началния екран на телефона, точно като всички други приложения
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Работи офлайн
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Основни функции работят дори без интернет връзка
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Download size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      По-бързо зареждане
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Кеширани ресурси за мигновено отваряне
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={16} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Автоматични обновления
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Винаги имаш най-новата версия с най-новите функции
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Инсталиране...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Инсталирай сега
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowBenefits(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors min-h-[48px] touch-manipulation"
                >
                  По-късно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
