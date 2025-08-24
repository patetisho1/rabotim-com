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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    description: 'Опаковане, увиване, преместване и други!'
  },
  {
    id: 'furniture-assembly',
    title: 'Сглобяване на мебели',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    description: 'Сглобяване и разглобяване на плоски пакети'
  },
  {
    id: 'gardening',
    title: 'Градинарство',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    description: 'Мулчиране, плевене и подреждане'
  },
  {
    id: 'handyperson',
    title: 'Майстор за дома',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face',
    description: 'Помощ с поддръжката на дома'
  },
  {
    id: 'marketing-design',
    title: 'Маркетинг и дизайн',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    description: 'Помощ с уебсайт и дизайн'
  },
  {
    id: 'home-cleaning',
    title: 'Почистване на дома',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    description: 'Почистване, миене и подреждане'
  },
  {
    id: 'deliveries',
    title: 'Доставки',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    description: 'Спешни доставки и куриерски услуги'
  },
  {
    id: 'painting',
    title: 'Боядисване',
    image: 'https://images.unsplash.com/photo-1560435650-7470e0f12610?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    description: 'Интериорно и екстериорно боядисване'
  },
  {
    id: 'business-admin',
    title: 'Бизнес и администрация',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    description: 'Помощ със счетоводство и данъчни декларации'
  },
  {
    id: 'something-else',
    title: 'Нещо друго',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop',
    personImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
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
        leftRef.current.scrollTop += 1
        if (leftRef.current.scrollTop >= leftRef.current.scrollHeight / 2) {
          leftRef.current.scrollTop = 0
        }
      }
    }, 30)

    const rightInterval = setInterval(() => {
      if (rightRef.current) {
        rightRef.current.scrollTop += 1
        if (rightRef.current.scrollTop >= rightRef.current.scrollHeight / 2) {
          rightRef.current.scrollTop = 0
        }
      }
    }, 30)

    return () => {
      clearInterval(leftInterval)
      clearInterval(rightInterval)
    }
  }, [])

  const renderServiceCard = (card: ServiceCard) => (
    <div
      key={card.id}
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-300 mb-3"
      style={{ height: '120px', minHeight: '120px' }}
    >
      {/* Background Image */}
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/200x120/6B7280/FFFFFF?text=📷'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 p-3 h-full flex flex-col justify-between">
        {/* Top section with profile picture */}
        <div className="flex items-start justify-between">
          <img
            src={card.personImage}
            alt={card.title}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/32x32/6B7280/FFFFFF?text=👤'
            }}
          />
        </div>
        
        {/* Bottom section with text */}
        <div className="text-white">
          <h3 className="font-semibold text-sm leading-tight">
            {card.title}
          </h3>
          <p className="text-xs opacity-90 mt-1 leading-tight">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`bg-gray-50 dark:bg-gray-900 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column - How it works */}
            <div className="flex flex-col justify-center">
              <div className="max-w-md">
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
            <div className="flex justify-center">
              <div className="w-72">
                {/* Fixed height container with scroll */}
                <div className="h-96 overflow-hidden">
                  <div className="grid grid-cols-2 gap-3 h-full">
                    {/* Left Column of Cards */}
                    <div className="relative">
                      <div
                        ref={leftRef}
                        className="h-full overflow-y-auto scrollbar-hide"
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
                        className="h-full overflow-y-auto scrollbar-hide"
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