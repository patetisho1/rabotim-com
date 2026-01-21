'use client'

import { useState, useEffect } from 'react'
import { Settings, User, Bell, Shield, Moon, Sun, Monitor, Palette, Smartphone, Globe, CheckCircle, AlertCircle, X, Save, Loader2, Eye, EyeOff, Lock, Key, Smartphone as Mobile, Monitor as Desktop, Tablet } from 'lucide-react'

interface UserSettings {
  profile: {
    name: string
    email: string
    phone: string
    avatar: string
    bio: string
    location: string
    languages: string[]
    skills: string[]
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    newTasks: boolean
    newOffers: boolean
    payments: boolean
    reminders: boolean
    marketing: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts'
    showLocation: boolean
    showPhone: boolean
    showEmail: boolean
    allowMessages: boolean
    allowCalls: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'system'
    fontSize: 'small' | 'medium' | 'large'
    compactMode: boolean
    animations: boolean
  }
  security: {
    twoFactorAuth: boolean
    loginNotifications: boolean
    sessionTimeout: number
    passwordChangeRequired: boolean
  }
  preferences: {
    language: string
    currency: string
    timezone: string
    dateFormat: string
    timeFormat: '12h' | '24h'
  }
}

interface SettingsPanelProps {
  settings: UserSettings
  onUpdateSettings: (settings: Partial<UserSettings>) => Promise<void>
  onClose: () => void
  className?: string
}

export default function SettingsPanel({
  settings,
  onUpdateSettings,
  onClose,
  className = ''
}: SettingsPanelProps) {
  const [currentSettings, setCurrentSettings] = useState<UserSettings>(settings)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'security' | 'preferences'>('profile')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const tabs = [
    { id: 'profile', label: 'Профил', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'privacy', label: 'Поверителност', icon: Shield },
    { id: 'appearance', label: 'Външен вид', icon: Palette },
    { id: 'security', label: 'Сигурност', icon: Lock },
    { id: 'preferences', label: 'Предпочитания', icon: Settings }
  ]

  const languages = [
    { code: 'bg', name: 'Български' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ]

  const currencies = [
    { code: 'EUR', name: 'Евро (€)' },
    { code: 'EUR', name: 'Евро (€)' },
    { code: 'USD', name: 'US Dollar ($)' }
  ]

  const timezones = [
    { value: 'Europe/Sofia', name: 'София (GMT+2)' },
    { value: 'Europe/London', name: 'Лондон (GMT+0)' },
    { value: 'Europe/Berlin', name: 'Берлин (GMT+1)' },
    { value: 'America/New_York', name: 'Ню Йорк (GMT-5)' }
  ]

  const handleSettingChange = (section: keyof UserSettings, field: string, value: any) => {
    setCurrentSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onUpdateSettings(currentSettings)
      // Show success message
    } catch (error) {
      console.error('Error updating settings:', error)
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Паролите не съвпадат')
      return
    }
    if (newPassword.length < 8) {
      alert('Паролата трябва да е поне 8 символа')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Implement password change logic
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Основна информация
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Име
            </label>
            <input
              type="text"
              value={currentSettings.profile.name}
              onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имейл
            </label>
            <input
              type="email"
              value={currentSettings.profile.email}
              onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={currentSettings.profile.phone}
              onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Локация
            </label>
            <input
              type="text"
              value={currentSettings.profile.location}
              onChange={(e) => handleSettingChange('profile', 'location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Биография
        </label>
        <textarea
          value={currentSettings.profile.bio}
          onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Канали за уведомления
        </h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Имейл уведомления' },
            { key: 'push', label: 'Push уведомления' },
            { key: 'sms', label: 'SMS уведомления' }
          ].map((channel) => (
            <label key={channel.key} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={currentSettings.notifications[channel.key as keyof typeof currentSettings.notifications] as boolean}
                onChange={(e) => handleSettingChange('notifications', channel.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">{channel.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Типове уведомления
        </h3>
        <div className="space-y-3">
          {[
            { key: 'newTasks', label: 'Нови задачи в района' },
            { key: 'newOffers', label: 'Нови оферти за вашите задачи' },
            { key: 'payments', label: 'Плащания и транзакции' },
            { key: 'reminders', label: 'Напомняния за задачи' },
            { key: 'marketing', label: 'Маркетингови съобщения' }
          ].map((type) => (
            <label key={type.key} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={currentSettings.notifications[type.key as keyof typeof currentSettings.notifications] as boolean}
                onChange={(e) => handleSettingChange('notifications', type.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Видимост на профила
        </h3>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'Публичен', description: 'Всички могат да видят профила ви' },
            { value: 'contacts', label: 'Само контакти', description: 'Само хората, с които сте в контакт' },
            { value: 'private', label: 'Частен', description: 'Само вие можете да видите профила' }
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={currentSettings.privacy.profileVisibility === option.value}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Информация за показване
        </h3>
        <div className="space-y-3">
          {[
            { key: 'showLocation', label: 'Показвай локация' },
            { key: 'showPhone', label: 'Показвай телефон' },
            { key: 'showEmail', label: 'Показвай имейл' },
            { key: 'allowMessages', label: 'Позволявай съобщения' },
            { key: 'allowCalls', label: 'Позволявай обаждания' }
          ].map((setting) => (
            <label key={setting.key} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={currentSettings.privacy[setting.key as keyof typeof currentSettings.privacy] as boolean}
                onChange={(e) => handleSettingChange('privacy', setting.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Тема
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Светла', icon: Sun },
            { value: 'dark', label: 'Тъмна', icon: Moon },
            { value: 'system', label: 'Системна', icon: Monitor }
          ].map((theme) => (
            <label
              key={theme.value}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                currentSettings.appearance.theme === theme.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={theme.value}
                checked={currentSettings.appearance.theme === theme.value}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="sr-only"
              />
              <theme.icon size={24} className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{theme.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Размер на текста
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: 'small', label: 'Малък' },
            { value: 'medium', label: 'Среден' },
            { value: 'large', label: 'Голям' }
          ].map((size) => (
            <label
              key={size.value}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                currentSettings.appearance.fontSize === size.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="fontSize"
                value={size.value}
                checked={currentSettings.appearance.fontSize === size.value}
                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">{size.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Други настройки
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={currentSettings.appearance.compactMode}
              onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900 dark:text-gray-100">Компактен режим</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={currentSettings.appearance.animations}
              onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900 dark:text-gray-100">Анимации</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Двуфакторна автентикация
        </h3>
        <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">2FA защита</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentSettings.security.twoFactorAuth ? 'Активирана' : 'Неактивирана'}
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('security', 'twoFactorAuth', !currentSettings.security.twoFactorAuth)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentSettings.security.twoFactorAuth
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
              }`}
            >
              {currentSettings.security.twoFactorAuth ? 'Деактивирай' : 'Активирай'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Промяна на парола
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Нова парола
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Потвърди парола
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            disabled={!newPassword || !confirmPassword || isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          >
            Промени парола
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Други настройки
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={currentSettings.security.loginNotifications}
              onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900 dark:text-gray-100">Уведомления за влизане</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Език и регионални настройки
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Език
            </label>
            <select
              value={currentSettings.preferences.language}
              onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Валута
            </label>
            <select
              value={currentSettings.preferences.currency}
              onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Часови пояс
            </label>
            <select
              value={currentSettings.preferences.timezone}
              onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Формат на часа
            </label>
            <select
              value={currentSettings.preferences.timeFormat}
              onChange={(e) => handleSettingChange('preferences', 'timeFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="12h">12-часов формат</option>
              <option value="24h">24-часов формат</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'privacy':
        return renderPrivacyTab()
      case 'appearance':
        return renderAppearanceTab()
      case 'security':
        return renderSecurityTab()
      case 'preferences':
        return renderPreferencesTab()
      default:
        return null
    }
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Настройки
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Запазване...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Запази
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <nav className="p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <tab.icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
