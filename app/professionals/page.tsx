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
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Намери професионалист
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Разгледай верифицирани професионалисти и намери точния човек за твоята задача
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <div className={`inline-flex p-2 rounded-lg bg-white/20 mb-2`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
            Популярни категории
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
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
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Ти си професионалист?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Присъедини се към нашата мрежа от верифицирани специалисти. 
                Получи достъп до хиляди потенциални клиенти и развий бизнеса си.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/premium')}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <Crown size={18} />
                  Стани Premium
                </button>
                <button
                  onClick={() => router.push('/profile/professional')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
