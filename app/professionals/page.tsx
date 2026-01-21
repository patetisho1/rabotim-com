'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, Users, Star, Shield, TrendingUp, Crown,
  Briefcase, Wrench, Scissors, Code, Camera, Music, 
  GraduationCap, Truck, Scale, Calculator, Heart
} from 'lucide-react'
import ProfessionalProfilesCatalog from '@/components/ProfessionalProfilesCatalog'
import { professionCategories, ProfessionCategory } from '@/types/professional-profile'

export default function ProfessionalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialProfession = searchParams.get('category') as ProfessionCategory | null
  const initialCity = searchParams.get('city')

  const stats = [
    { icon: Users, value: '2,500+', label: 'Професионалисти', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { icon: Star, value: '4.8', label: 'Среден рейтинг', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
    { icon: Shield, value: '98%', label: 'Верифицирани', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { icon: TrendingUp, value: '15K+', label: 'Завършени задачи', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' }
  ]

  const popularCategories = [
    { id: 'repairs', icon: '🔧', name: 'Ремонти', count: 450 },
    { id: 'beauty', icon: '💅', name: 'Красота', count: 320 },
    { id: 'it', icon: '💻', name: 'IT услуги', count: 280 },
    { id: 'teaching', icon: '📚', name: 'Уроци', count: 210 },
    { id: 'cleaning', icon: '🧹', name: 'Почистване', count: 190 },
    { id: 'fitness', icon: '💪', name: 'Фитнес', count: 150 },
    { id: 'photography', icon: '📷', name: 'Фотография', count: 120 },
    { id: 'transport', icon: '🚚', name: 'Транспорт', count: 95 }
  ]

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/professionals?category=${categoryId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
            <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
              Намери професионалист
            </h1>
            <p className="text-sm md:text-xl text-blue-100">
              Верифицирани професионалисти за твоята задача
            </p>
          </div>

          {/* Stats - Simplified on mobile */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 max-w-4xl mx-auto">
            {stats.slice(0, 2).map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-center"
              >
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs md:text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
            {/* Show all stats on desktop, only first 2 on mobile */}
            {stats.slice(2).map((stat, index) => (
              <div 
                key={index + 2} 
                className="hidden md:block bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 md:mb-4 uppercase tracking-wider">
            Популярни категории
          </h2>
          {/* Mobile: Grid layout, Desktop: Horizontal scroll */}
          <div className="grid grid-cols-4 gap-2 md:hidden">
            {popularCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  initialProfession === cat.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
          {/* Desktop: Horizontal scroll */}
          <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {popularCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all hover:shadow-md ${
                  initialProfession === cat.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
                <span className={`text-xs ${initialProfession === cat.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfessionalProfilesCatalog 
          initialProfession={initialProfession || undefined}
          initialCity={initialCity || undefined}
        />
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center md:text-left md:grid md:grid-cols-2 md:gap-8 md:items-center">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
                Ти си професионалист?
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                Присъедини се и получи достъп до хиляди потенциални клиенти.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={() => router.push('/premium')}
                  className="flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm md:text-base"
                >
                  <Crown size={16} className="md:w-[18px] md:h-[18px]" />
                  Стани Premium
                </button>
                <button
                  onClick={() => router.push('/profile/professional')}
                  className="px-5 md:px-6 py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
                >
                  Създай профил
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-4">
                {['💼', '⭐', '🚀', '💰', '🎯', '✅'].map((emoji, i) => (
                  <div 
                    key={i}
                    className="aspect-square bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center text-4xl shadow-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
