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
    id: 'electrical',
    title: 'Електро инсталация',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Професионални електротехнически услуги'
  },
  {
    id: 'gardening',
    title: 'Градинарство',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Косене, плевене и поддръжка на градина'
  },
  {
    id: 'painting',
    title: 'Боядисване',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Интериорно и екстериорно боядисване'
  },
  {
    id: 'cleaning',
    title: 'Почистване',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Домашно и офис почистване'
  },
  {
    id: 'plumbing',
    title: 'Водопровод',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Ремонт и поддръжка на водопровод'
  },
  {
    id: 'carpentry',
    title: 'Дърводелство',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Изработка и ремонт на мебели'
  },
  {
    id: 'delivery',
    title: 'Доставка',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Бързи и надеждни доставки'
  },
  {
    id: 'assembly',
    title: 'Сглобяване',
    image: '/api/placeholder/120/80',
    personImage: '/api/placeholder/60/60',
    description: 'Сглобяване на мебели и техника'
  }
]

interface CategoryGridProps {
  className?: string
}

export default function CategoryGrid({ className = '' }: CategoryGridProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const rightRef = useRef<HTMLDivElement>(null)

  // Автоматично скролиране на дясната колона
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % serviceCards.length)
    }, 3000) // Смяна на всеки 3 секунди

    return () => clearInterval(interval)
  }, [])

  const renderServiceCard = (card: ServiceCard, index: number) => (
    <div
      key={card.id}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-500 ${
        index === currentCardIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <img
            src={card.personImage}
            alt={card.title}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
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

          {/* Right Column - Service Cards */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-96">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Популярни услуги
              </h3>
              <div
                ref={rightRef}
                className="relative h-80 overflow-hidden"
              >
                {serviceCards.map((card, index) => 
                  renderServiceCard(card, index)
                )}
              </div>
              
              {/* Dots indicator */}
              <div className="flex justify-center space-x-2 mt-4">
                {serviceCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCardIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentCardIndex 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 