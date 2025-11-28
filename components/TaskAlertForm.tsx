'use client'

import { useState } from 'react'
import { 
  Bell, 
  BellRing,
  MapPin, 
  Tag, 
  DollarSign,
  X,
  Check,
  Mail,
  Smartphone,
  Clock,
  Sparkles
} from 'lucide-react'
import { useQuickSubscribe, CreateTaskAlertInput } from '@/hooks/useTaskAlerts'
import { haptics } from '@/lib/haptics'

const categories = [
  { slug: 'cleaning', name: 'Почистване' },
  { slug: 'handyman', name: 'Майсторски услуги' },
  { slug: 'moving', name: 'Преместване' },
  { slug: 'delivery', name: 'Доставки' },
  { slug: 'gardening', name: 'Градинарство' },
  { slug: 'assembly', name: 'Сглобяване' },
  { slug: 'painting', name: 'Боядисване' },
  { slug: 'plumbing', name: 'ВиК услуги' },
  { slug: 'electrical', name: 'Електро услуги' },
  { slug: 'tutoring', name: 'Уроци' },
  { slug: 'pet-care', name: 'Домашни любимци' },
  { slug: 'tech-help', name: 'Техническа помощ' },
  { slug: 'other', name: 'Други' },
]

const locations = [
  'София', 'Пловдив', 'Варна', 'Бургас', 
  'Стара Загора', 'Плевен', 'Велико Търново', 'Русе'
]

interface TaskAlertFormProps {
  userId?: string
  defaultCategory?: string
  defaultLocation?: string
  onSuccess?: () => void
  onCancel?: () => void
  compact?: boolean
  className?: string
}

export default function TaskAlertForm({
  userId,
  defaultCategory,
  defaultLocation,
  onSuccess,
  onCancel,
  compact = false,
  className = ''
}: TaskAlertFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultCategory ? [defaultCategory] : []
  )
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    defaultLocation ? [defaultLocation] : []
  )
  const [minBudget, setMinBudget] = useState<string>('')
  const [maxBudget, setMaxBudget] = useState<string>('')
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly'>('immediate')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleCategory = (slug: string) => {
    haptics.light()
    setSelectedCategories(prev => 
      prev.includes(slug) 
        ? prev.filter(c => c !== slug)
        : [...prev, slug]
    )
  }

  const toggleLocation = (loc: string) => {
    haptics.light()
    setSelectedLocations(prev => 
      prev.includes(loc) 
        ? prev.filter(l => l !== loc)
        : [...prev, loc]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      return
    }

    // Validate at least one filter
    if (selectedCategories.length === 0 && selectedLocations.length === 0 && !minBudget && !maxBudget) {
      haptics.error()
      return
    }

    setIsSubmitting(true)
    haptics.medium()

    try {
      const response = await fetch('/api/task-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          categories: selectedCategories,
          locations: selectedLocations,
          min_budget: minBudget ? parseInt(minBudget) : 0,
          max_budget: maxBudget ? parseInt(maxBudget) : 999999,
          email_enabled: emailEnabled,
          push_enabled: pushEnabled,
          frequency
        })
      })

      const data = await response.json()

      if (response.ok) {
        haptics.success()
        onSuccess?.()
      }
    } catch (error) {
      haptics.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (compact) {
    return (
      <QuickSubscribeButton 
        userId={userId}
        category={defaultCategory}
        location={defaultLocation}
        className={className}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <BellRing className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Създай известие за нови задачи
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Получавайте email когато се появи подходяща задача
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Tag className="h-4 w-4" />
          Категории
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => toggleCategory(cat.slug)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <MapPin className="h-4 w-4" />
          Локации
        </label>
        <div className="flex flex-wrap gap-2">
          {locations.map(loc => (
            <button
              key={loc}
              type="button"
              onClick={() => toggleLocation(loc)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                selectedLocations.includes(loc)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <DollarSign className="h-4 w-4" />
          Бюджет (лв)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="От"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="До"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Как да ви уведомим?
        </h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Email известия</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={(e) => setPushEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Smartphone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Push известия</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Clock className="h-4 w-4" />
            Честота
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as typeof frequency)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="immediate">Веднага при нова задача</option>
            <option value="daily">Дневен обзор</option>
            <option value="weekly">Седмичен обзор</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отказ
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !userId || (selectedCategories.length === 0 && selectedLocations.length === 0 && !minBudget && !maxBudget)}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Bell className="h-5 w-5" />
              Създай известие
            </>
          )}
        </button>
      </div>

      {!userId && (
        <p className="mt-4 text-center text-sm text-amber-600 dark:text-amber-400">
          ⚠️ Моля влезте в профила си за да създадете известие
        </p>
      )}
    </form>
  )
}

// Quick Subscribe Button - простият вариант
export function QuickSubscribeButton({
  userId,
  category,
  location,
  className = ''
}: {
  userId?: string
  category?: string
  location?: string
  className?: string
}) {
  const { subscribe, subscribing } = useQuickSubscribe(userId)
  const [subscribed, setSubscribed] = useState(false)

  const handleClick = async () => {
    haptics.medium()
    const success = await subscribe({
      category,
      location
    })
    if (success) {
      setSubscribed(true)
      haptics.success()
    }
  }

  if (subscribed) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg ${className}`}>
        <Check className="h-5 w-5" />
        <span className="text-sm font-medium">Абонирахте се!</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={subscribing || !userId}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors ${className}`}
    >
      {subscribing ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">
        {subscribing ? 'Абониране...' : 'Уведоми ме за нови задачи'}
      </span>
    </button>
  )
}

// Inline subscribe prompt - за показване в listings
export function TaskAlertPrompt({
  userId,
  category,
  location,
  className = ''
}: {
  userId?: string
  category?: string
  location?: string
  className?: string
}) {
  const [dismissed, setDismissed] = useState(false)
  const { subscribe, subscribing } = useQuickSubscribe(userId)
  const [subscribed, setSubscribed] = useState(false)

  if (dismissed || subscribed) return null

  const categoryLabel = categories.find(c => c.slug === category)?.name || category

  return (
    <div className={`relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 ${className}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            Искате ли да получавате известия?
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {category 
              ? `Ще ви уведомим за нови задачи в "${categoryLabel}"`
              : 'Ще ви уведомим за нови подходящи задачи'
            }
            {location && ` в ${location}`}
          </p>
          <button
            onClick={async () => {
              const success = await subscribe({ category, location })
              if (success) setSubscribed(true)
            }}
            disabled={subscribing || !userId}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Bell className="h-3.5 w-3.5" />
            {subscribing ? 'Абониране...' : 'Да, абонирай ме'}
          </button>
        </div>
      </div>
    </div>
  )
}

