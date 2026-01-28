'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MapPin, Crown, Shield, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface Professional {
  id: string
  username: string
  display_name: string
  tagline: string
  profession_title: string
  profession: string
  cover_image: string
  avatar?: string
  city: string
  rating: number
  reviews: number
  price: number
  is_premium: boolean
  verified: boolean
}

// Demo professionals data
const demoProfessionals: Professional[] = [
  {
    id: '1',
    username: 'fitness-maria',
    display_name: 'Мария Иванова',
    tagline: 'Персонален треньор с 10+ години опит',
    profession_title: 'Персонален треньор',
    profession: 'fitness',
    cover_image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    city: 'София',
    rating: 4.9,
    reviews: 127,
    price: 35,
    is_premium: true,
    verified: true
  },
  {
    id: '2',
    username: 'beauty-elena',
    display_name: 'Елена Петрова',
    tagline: 'Професионален козметик и визажист',
    profession_title: 'Козметик',
    profession: 'beauty',
    cover_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    city: 'София',
    rating: 4.8,
    reviews: 94,
    price: 50,
    is_premium: true,
    verified: true
  },
  {
    id: '3',
    username: 'electrician-georgi',
    display_name: 'Георги Димитров',
    tagline: 'Лицензиран електротехник, 15г. опит',
    profession_title: 'Електротехник',
    profession: 'repairs',
    cover_image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    city: 'Пловдив',
    rating: 4.7,
    reviews: 78,
    price: 25,
    is_premium: true,
    verified: true
  },
  {
    id: '4',
    username: 'cleaning-pro',
    display_name: 'Надежда Колева',
    tagline: 'Професионално почистване на домове',
    profession_title: 'Почистване',
    profession: 'cleaning',
    cover_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    city: 'София',
    rating: 4.9,
    reviews: 203,
    price: 15,
    is_premium: true,
    verified: true
  },
  {
    id: '5',
    username: 'dev-ivan',
    display_name: 'Иван Стоянов',
    tagline: 'Full-stack разработчик и IT консултант',
    profession_title: 'Софтуерен разработчик',
    profession: 'it',
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    city: 'София',
    rating: 4.9,
    reviews: 156,
    price: 50,
    is_premium: true,
    verified: true
  },
  {
    id: '6',
    username: 'dj-alex',
    display_name: 'DJ Алекс',
    tagline: 'DJ за сватби, партита, фирмени събития',
    profession_title: 'DJ & Озвучаване',
    profession: 'music',
    cover_image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=300&fit=crop',
    city: 'София',
    rating: 5.0,
    reviews: 67,
    price: 200,
    is_premium: true,
    verified: true
  }
]

export default function ProfessionalsShowcase() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [professionals, setProfessionals] = useState<Professional[]>(demoProfessionals)
  
  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % professionals.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [professionals.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % professionals.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + professionals.length) % professionals.length)
  }

  // Get visible cards (3 on desktop, 1 on mobile)
  const getVisibleProfessionals = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % professionals.length
      visible.push(professionals[index])
    }
    return visible
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-4">
            <Crown size={16} className="text-yellow-500" />
            <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">
              Топ Професионалисти
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Открий експертите
            </span>
            <br className="hidden sm:block" />
            <span className="text-gray-800 dark:text-gray-200">които ще ти помогнат</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Верифицирани специалисти с отлични отзиви • Всички професии на едно място
          </p>
        </div>

        {/* Cards Carousel */}
        <div className="relative mb-12">
          {/* Desktop: 3 cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {getVisibleProfessionals().map((professional, idx) => (
              <ProfessionalCard 
                key={`${professional.id}-${idx}`} 
                professional={professional}
                onClick={() => router.push(`/p/${professional.username}`)}
              />
            ))}
          </div>

          {/* Mobile: Single card with navigation */}
          <div className="md:hidden relative">
            <ProfessionalCard 
              professional={professionals[currentIndex]}
              onClick={() => router.push(`/p/${professionals[currentIndex].username}`)}
            />
            
            {/* Mobile Navigation */}
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-10">
          {professionals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              } rounded-full`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/professionals')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🔍 Разгледай всички професионалисти
            <ArrowRight size={20} />
          </button>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
            или{' '}
            <button
              onClick={() => router.push('/premium')}
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium underline underline-offset-2"
            >
              стани един от тях
            </button>
            {' '}и получи повече клиенти!
          </p>
        </div>
      </div>
    </section>
  )
}

// Professional Card Component
function ProfessionalCard({ 
  professional, 
  onClick 
}: { 
  professional: Professional
  onClick: () => void 
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden">
        <OptimizedImage
          src={professional.cover_image}
          alt={professional.display_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {professional.is_premium && (
            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
              <Crown size={12} /> Pro
            </span>
          )}
          {professional.verified && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              <Shield size={12} />
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-green-600 font-bold rounded-full text-sm">
            от {professional.price} €
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
              {professional.display_name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {professional.profession_title}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
            <Star size={14} className="text-yellow-500 fill-current" />
            <span className="font-bold text-sm">{professional.rating}</span>
            <span className="text-gray-500 text-xs">({professional.reviews})</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {professional.tagline}
        </p>

        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin size={14} />
          {professional.city}
        </div>
      </div>
    </div>
  )
}

