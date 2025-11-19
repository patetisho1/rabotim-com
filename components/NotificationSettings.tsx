import React, { useState } from 'react'
import { NotificationPreferences, NotificationCategory } from '@/types/notification'
import { Bell, BellOff, Mail, Smartphone, Clock, Settings, Volume2, VolumeX } from 'lucide-react'

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onUpdatePreferences: (preferences: Partial<NotificationPreferences>) => void
  isSubscribed: boolean
  onSubscribe: () => Promise<boolean>
  onUnsubscribe: () => Promise<boolean>
  error?: string | null
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onUpdatePreferences,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  error
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const categoryLabels: Record<NotificationCategory, string> = {
    communication: 'Комуникация',
    tasks: 'Задачи',
    payments: 'Плащания',
    system: 'Система',
    security: 'Сигурност',
    achievements: 'Постижения'
  }

  const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
    communication: '💬',
    tasks: '✅',
    payments: '💰',
    system: '🔧',
    security: '🔒',
    achievements: '🏆'
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      await onSubscribe()
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)
    try {
      await onUnsubscribe()
    } finally {
      setIsLoading(false)
    }
  }

  const updateCategoryPreference = (category: NotificationCategory, channel: 'email' | 'push' | 'inApp', value: boolean) => {
    onUpdatePreferences({
      categories: {
        ...preferences.categories,
        [category]: {
          ...preferences.categories[category],
          [channel]: value
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Push Notifications Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Push известия
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Разреши push известия
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Получавайте известия в реално време дори когато не сте на сайта
              </p>
            </div>
            <button
              onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isSubscribed
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isSubscribed ? 'Отписване...' : 'Абониране...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isSubscribed ? <BellOff size={16} /> : <Bell size={16} />}
                  {isSubscribed ? 'Отпиши се' : 'Абонирай се'}
                </div>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Smartphone size={12} />
            <span>Работи на всички устройства</span>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-gray-600 dark:text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Общи настройки
          </h3>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-600 dark:text-gray-400" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Email известия
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Получавайте известия на имейл
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={(e) => onUpdatePreferences({ email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-600 dark:text-gray-400" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  В приложението
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Показване на известия в сайта
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.inApp}
                onChange={(e) => onUpdatePreferences({ inApp: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Notification Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preferences.soundEnabled ? (
                <Volume2 className="text-gray-600 dark:text-gray-400" size={16} />
              ) : (
                <VolumeX className="text-gray-600 dark:text-gray-400" size={16} />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Звук при известия
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Възпроизвеждане на звук при нови известия
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.soundEnabled}
                onChange={(e) => onUpdatePreferences({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-gray-600 dark:text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Тихи часове
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Активирай тихи часове
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Не получавайте известия в определено време
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours.enabled}
                onChange={(e) => onUpdatePreferences({
                  quietHours: { ...preferences.quietHours, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  От
                </label>
                <input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) => onUpdatePreferences({
                    quietHours: { ...preferences.quietHours, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  До
                </label>
                <input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) => onUpdatePreferences({
                    quietHours: { ...preferences.quietHours, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Настройки по категории
        </h3>

        <div className="space-y-4">
          {(Object.keys(preferences.categories) as NotificationCategory[]).map((category) => (
            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">{categoryIcons[category]}</span>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {categoryLabels[category]}
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.categories[category].email}
                      onChange={(e) => updateCategoryPreference(category, 'email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Push</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.categories[category].push}
                      onChange={(e) => updateCategoryPreference(category, 'push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">В приложението</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.categories[category].inApp}
                      onChange={(e) => updateCategoryPreference(category, 'inApp', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
