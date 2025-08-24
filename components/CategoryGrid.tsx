'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Star, CheckCircle, Users, Clock, DollarSign } from 'lucide-react'

interface ServiceCard {
  id: string
  title: string
  image: string
  personImage: string
  description: string
}

const serviceCards: ServiceCard[] = [
  {
    id: 'removalists',
    title: 'Хамали',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Опаковане, увиване, преместване и други!'
  },
  {
    id: 'furniture-assembly',
    title: 'Сглобяване на мебели',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Сглобяване и разглобяване на плоски пакети'
  },
  {
    id: 'gardening',
    title: 'Градинарство и озеленяване',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Мулчиране, плевене и подреждане'
  },
  {
    id: 'handyperson',
    title: 'Майстор за дома',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Помощ с поддръжката на дома'
  },
  {
    id: 'marketing-design',
    title: 'Маркетинг и дизайн',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Помощ с уебсайт и дизайн'
  },
  {
    id: 'home-cleaning',
    title: 'Почистване на дома',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Почистване, миене и подреждане на дома'
  },
  {
    id: 'deliveries',
    title: 'Доставки',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Спешни доставки и куриерски услуги'
  },
  {
    id: 'painting',
    title: 'Боядисване',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Интериорно и екстериорно боядисване на стени'
  },
  {
    id: 'business-admin',
    title: 'Бизнес и администрация',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Помощ със счетоводство и данъчни декларации'
  },
  {
    id: 'something-else',
    title: 'Нещо друго',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Монтиране на изкуство и картини на стена'
  }
]

interface CategoryGridProps {
  className?: string
}

export default function CategoryGrid({ className = '' }: CategoryGridProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // Разделяне на картите в две колони
  const leftCards = serviceCards.filter((_, index) => index % 2 === 0)
  const rightCards = serviceCards.filter((_, index) => index % 2 === 1)

  // Автоматично скролиране нагоре
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

  const renderServiceCard = (card: ServiceCard) => (
    <div
      key={card.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={card.personImage}
            alt={card.title}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {card.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {card.description}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-16 rounded object-cover"
        />
      </div>
    </div>
  )

  return (
    <div className={`bg-gray-50 dark:bg-gray-900 py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column - How it works */}
          <div className="flex flex-col justify-center">
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Публикувайте първата си задача за секунди
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Спестете си часове и изпълнете списъка си със задачи
              </p>
              
              {/* Steps */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Опишете какво ви е необходимо
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Детайлно описание на задачата, която искате да бъде изпълнена
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Определете бюджета си
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Задайте бюджет и срок за изпълнение на задачата
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Получете оферти и изберете най-добрия изпълнител
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Сравнете предложенията и изберете най-подходящия изпълнител
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg">
                Публикувайте задачата си
              </button>
            </div>
          </div>

          {/* Right Column - Service Cards with Auto-scroll */}
          <div className="grid grid-cols-2 gap-4 h-96">
            {/* Left Column of Cards */}
            <div className="relative">
              <div
                ref={leftRef}
                className="space-y-4 h-full overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {leftCards.map(renderServiceCard)}
                {/* Duplicate for seamless loop */}
                {leftCards.map(renderServiceCard)}
              </div>
            </div>

            {/* Right Column of Cards */}
            <div className="relative">
              <div
                ref={rightRef}
                className="space-y-4 h-full overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {rightCards.map(renderServiceCard)}
                {/* Duplicate for seamless loop */}
                {rightCards.map(renderServiceCard)}
              </div>
            </div>
          </div>
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