'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Star, MapPin, Clock, DollarSign } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
  taskCount: number
  avgPrice: number
  avgRating: number
}

const categories: Category[] = [
  {
    id: 'removalists',
    name: 'Хамали',
    description: 'Опаковане, увиване, преместване и други!',
    icon: '📦',
    image: '/api/placeholder/80/80',
    taskCount: 156,
    avgPrice: 200,
    avgRating: 4.8
  },
  {
    id: 'furniture-assembly',
    name: 'Сглобяване на мебели',
    description: 'Сглобяване и разглобяване на плоски пакети',
    icon: '🔧',
    image: '/api/placeholder/80/80',
    taskCount: 89,
    avgPrice: 80,
    avgRating: 4.7
  },
  {
    id: 'gardening',
    name: 'Градинарство и озеленяване',
    description: 'Мулчиране, плевене и подреждане',
    icon: '🌱',
    image: '/api/placeholder/80/80',
    taskCount: 234,
    avgPrice: 120,
    avgRating: 4.6
  },
  {
    id: 'handyperson',
    name: 'Майстор за дома',
    description: 'Помощ с поддръжката на дома',
    icon: '🏠',
    image: '/api/placeholder/80/80',
    taskCount: 445,
    avgPrice: 150,
    avgRating: 4.9
  },
  {
    id: 'marketing-design',
    name: 'Маркетинг и дизайн',
    description: 'Помощ с уебсайт и дизайн',
    icon: '💻',
    image: '/api/placeholder/80/80',
    taskCount: 123,
    avgPrice: 300,
    avgRating: 4.5
  },
  {
    id: 'home-cleaning',
    name: 'Почистване на дома',
    description: 'Почистване, миене и подреждане на дома',
    icon: '🧹',
    image: '/api/placeholder/80/80',
    taskCount: 567,
    avgPrice: 100,
    avgRating: 4.8
  },
  {
    id: 'deliveries',
    name: 'Доставки',
    description: 'Спешни доставки и куриерски услуги',
    icon: '🚚',
    image: '/api/placeholder/80/80',
    taskCount: 234,
    avgPrice: 50,
    avgRating: 4.7
  },
  {
    id: 'painting',
    name: 'Боядисване',
    description: 'Интериорно и екстериорно боядисване на стени',
    icon: '🎨',
    image: '/api/placeholder/80/80',
    taskCount: 178,
    avgPrice: 250,
    avgRating: 4.6
  },
  {
    id: 'business-admin',
    name: 'Бизнес и администрация',
    description: 'Помощ със счетоводство и данъчни декларации',
    icon: '📊',
    image: '/api/placeholder/80/80',
    taskCount: 89,
    avgPrice: 400,
    avgRating: 4.8
  },
  {
    id: 'something-else',
    name: 'Нещо друго',
    description: 'Монтиране на изкуство и картини на стена',
    icon: '🎭',
    image: '/api/placeholder/80/80',
    taskCount: 67,
    avgPrice: 180,
    avgRating: 4.4
  },
  {
    id: 'dog-walking',
    name: 'Разходка с кучета',
    description: 'Професионална грижа за домашни любимци',
    icon: '🐕',
    image: '/api/placeholder/80/80',
    taskCount: 145,
    avgPrice: 60,
    avgRating: 4.9
  },
  {
    id: 'packaging',
    name: 'Опаковане',
    description: 'Професионално опаковане за преместване',
    icon: '📦',
    image: '/api/placeholder/80/80',
    taskCount: 98,
    avgPrice: 90,
    avgRating: 4.7
  }
]

interface CategoryGridProps {
  className?: string
}

export default function CategoryGrid({ className = '' }: CategoryGridProps) {
  const [leftColumn, setLeftColumn] = useState<Category[]>([])
  const [rightColumn, setRightColumn] = useState<Category[]>([])
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // Разделяне на категориите в две колони
  useEffect(() => {
    const left = categories.filter((_, index) => index % 2 === 0)
    const right = categories.filter((_, index) => index % 2 === 1)
    setLeftColumn(left)
    setRightColumn(right)
  }, [])

  // Автоматично скролиране
  useEffect(() => {
    const leftInterval = setInterval(() => {
      if (leftRef.current) {
        const firstChild = leftRef.current.firstElementChild as HTMLElement
        if (firstChild) {
          leftRef.current.scrollTop += 1
          if (leftRef.current.scrollTop >= firstChild.offsetHeight) {
            leftRef.current.scrollTop = 0
          }
        }
      }
    }, 50)

    const rightInterval = setInterval(() => {
      if (rightRef.current) {
        const firstChild = rightRef.current.firstElementChild as HTMLElement
        if (firstChild) {
          rightRef.current.scrollTop += 1
          if (rightRef.current.scrollTop >= firstChild.offsetHeight) {
            rightRef.current.scrollTop = 0
          }
        }
      }
    }, 50)

    return () => {
      clearInterval(leftInterval)
      clearInterval(rightInterval)
    }
  }, [])

  const renderCategoryCard = (category: Category) => (
    <div
      key={category.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {category.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span>{category.avgRating}</span>
              <span>•</span>
              <span>{category.taskCount} задачи</span>
            </div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400">
              от {category.avgPrice} лв.
            </div>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  )

  return (
    <div className={`bg-gray-50 dark:bg-gray-900 py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Популярни категории услуги
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Открийте надеждни изпълнители за всякакви задачи. Нашите категории включват всичко от почистване до специализирани услуги.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-96 overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Домашни услуги
              </h3>
              <div
                ref={leftRef}
                className="space-y-4 h-80 overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {leftColumn.map(renderCategoryCard)}
                {/* Duplicate for seamless loop */}
                {leftColumn.map(renderCategoryCard)}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-96 overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Специализирани услуги
              </h3>
              <div
                ref={rightRef}
                className="space-y-4 h-80 overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {rightColumn.map(renderCategoryCard)}
                {/* Duplicate for seamless loop */}
                {rightColumn.map(renderCategoryCard)}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            <span>Разгледайте всички категории</span>
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
} 