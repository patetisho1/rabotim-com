'use client'

import Link from 'next/link'
import { 
  Sparkles, 
  Home, 
  Truck, 
  Package, 
  Flower2, 
  Wrench,
  Paintbrush,
  Droplets,
  Zap,
  GraduationCap,
  Dog,
  Laptop,
  MoreHorizontal,
  TrendingUp
} from 'lucide-react'

interface Category {
  slug: string
  name: string
  icon: React.ElementType
  count?: number
  trending?: boolean
}

const categories: Category[] = [
  { slug: 'cleaning', name: 'Почистване', icon: Sparkles, trending: true },
  { slug: 'handyman', name: 'Майсторски услуги', icon: Wrench, trending: true },
  { slug: 'moving', name: 'Преместване', icon: Truck },
  { slug: 'delivery', name: 'Доставки', icon: Package },
  { slug: 'gardening', name: 'Градинарство', icon: Flower2 },
  { slug: 'assembly', name: 'Сглобяване', icon: Home },
  { slug: 'painting', name: 'Боядисване', icon: Paintbrush },
  { slug: 'plumbing', name: 'ВиК услуги', icon: Droplets },
  { slug: 'electrical', name: 'Електро услуги', icon: Zap },
  { slug: 'tutoring', name: 'Уроци', icon: GraduationCap },
  { slug: 'pet-care', name: 'Грижа за домашни любимци', icon: Dog },
  { slug: 'tech-help', name: 'Техническа помощ', icon: Laptop },
  { slug: 'other', name: 'Други', icon: MoreHorizontal },
]

interface PopularCategoriesProps {
  currentCategory?: string
  showAll?: boolean
  variant?: 'sidebar' | 'grid' | 'compact'
  className?: string
}

export default function PopularCategories({
  currentCategory,
  showAll = false,
  variant = 'sidebar',
  className = ''
}: PopularCategoriesProps) {
  const displayCategories = showAll 
    ? categories 
    : categories.filter(c => c.trending || categories.indexOf(c) < 6)

  if (variant === 'grid') {
    return (
      <section className={`${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Популярни категории
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {displayCategories.map((category) => {
            const Icon = category.icon
            const isActive = currentCategory === category.slug
            
            return (
              <Link
                key={category.slug}
                href={`/tasks?category=${category.slug}`}
                className={`flex flex-col items-center p-4 rounded-xl border transition-all hover:shadow-md ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <Icon className={`h-8 w-8 mb-2 ${
                  isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium text-center ${
                  isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {category.name}
                </span>
                {category.trending && (
                  <span className="mt-1 text-xs text-orange-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Популярно
                  </span>
                )}
              </Link>
            )
          })}
        </div>
        {!showAll && (
          <div className="mt-4 text-center">
            <Link 
              href="/categories"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
            >
              Виж всички категории →
            </Link>
          </div>
        )}
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Категории
        </h4>
        <div className="flex flex-wrap gap-2">
          {displayCategories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/tasks?category=${category.slug}`}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                currentCategory === category.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Default: sidebar variant
  return (
    <aside className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        Категории
      </h3>
      <nav>
        <ul className="space-y-1">
          {displayCategories.map((category) => {
            const Icon = category.icon
            const isActive = currentCategory === category.slug
            
            return (
              <li key={category.slug}>
                <Link
                  href={`/tasks?category=${category.slug}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{category.name}</span>
                  {category.trending && (
                    <span className="ml-auto text-xs text-orange-500">
                      🔥
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href="/categories"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
        >
          Всички категории →
        </Link>
      </div>
    </aside>
  )
}

// Popular Locations widget for SEO
export function PopularLocations({
  currentLocation,
  variant = 'sidebar',
  className = ''
}: {
  currentLocation?: string
  variant?: 'sidebar' | 'compact'
  className?: string
}) {
  const locations = [
    { slug: 'sofia', name: 'София', count: 150 },
    { slug: 'plovdiv', name: 'Пловдив', count: 45 },
    { slug: 'varna', name: 'Варна', count: 38 },
    { slug: 'burgas', name: 'Бургас', count: 28 },
    { slug: 'stara-zagora', name: 'Стара Загора', count: 18 },
    { slug: 'pleven', name: 'Плевен', count: 15 },
    { slug: 'veliko-tarnovo', name: 'Велико Търново', count: 12 },
    { slug: 'ruse', name: 'Русе', count: 10 },
  ]

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Локации
        </h4>
        <div className="flex flex-wrap gap-2">
          {locations.slice(0, 6).map((loc) => (
            <Link
              key={loc.slug}
              href={`/tasks?location=${loc.name}`}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                currentLocation === loc.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
              }`}
            >
              {loc.name}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <aside className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        📍 Популярни градове
      </h3>
      <ul className="space-y-2">
        {locations.map((loc) => (
          <li key={loc.slug}>
            <Link
              href={`/tasks?location=${loc.name}`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                currentLocation === loc.name
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-sm">{loc.name}</span>
              <span className="text-xs text-gray-400">{loc.count} задачи</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

