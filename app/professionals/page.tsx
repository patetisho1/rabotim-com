'use client'

import { useState } from 'react'
import { ArrowLeft, Crown, Shield, Star, Users, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProfessionalProfilesCatalog from '@/components/ProfessionalProfilesCatalog'
import PremiumFeatures from '@/components/PremiumFeatures'

export default function ProfessionalsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'catalog' | 'premium' | 'stats'>('catalog')

  const stats = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Активни професионалисти',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'Среден рейтинг',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      value: '98%',
      label: 'Верифицирани профили',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      value: '+150%',
      label: 'Увеличение на доходите',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Професионални изпълнители
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Намерете най-добрите професионалисти за вашите задачи
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className={`inline-flex p-2 rounded-lg bg-white dark:bg-gray-800 mb-2`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Каталог
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'premium'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Премиум функции
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Статисти постепени
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'catalog' && (
          <ProfessionalProfilesCatalog />
        )}

        {activeTab === 'premium' && (
          <PremiumFeatures variant="pricing" />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Success Stories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Истории на успеха
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">MP</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Мария Петрова</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Графичен дизайнер</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Преди премиум:</span>
                      <span className="text-sm font-medium">2-3 заявки/седмица</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">След премиум:</span>
                      <span className="text-sm font-medium text-green-600">8-10 заявки/седмица</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Увеличение:</span>
                      <span className="text-sm font-bold text-green-600">+250%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">ID</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Иван Димитров</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">IT консултант</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Преди премиум:</span>
                      <span className="text-sm font-medium">45 лв/час</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">След премиум:</span>
                      <span className="text-sm font-medium text-green-600">75 лв/час</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Увеличение:</span>
                      <span className="text-sm font-bold text-green-600">+67%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">EG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Елена Георгиева</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Преподавател</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Преди премиум:</span>
                      <span className="text-sm font-medium">15 часа/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">След премиум:</span>
                      <span className="text-sm font-medium text-green-600">35 часа/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Увеличение:</span>
                      <span className="text-sm font-bold text-green-600">+133%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Пазарни инсайти
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Най-търсени умения
                  </h3>
                  <div className="space-y-3">
                    {[
                      { skill: 'Уеб разработка', demand: 95, color: 'bg-blue-500' },
                      { skill: 'Графичен дизайн', demand: 88, color: 'bg-green-500' },
                      { skill: 'Маркетинг', demand: 82, color: 'bg-purple-500' },
                      { skill: 'Преподаване', demand: 75, color: 'bg-orange-500' },
                      { skill: 'Ремонтни работи', demand: 70, color: 'bg-red-500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-24 text-sm text-gray-600 dark:text-gray-400">
                          {item.skill}
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.demand}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.demand}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Средни ставки по категории
                  </h3>
                  <div className="space-y-3">
                    {[
                      { category: 'IT услуги', rate: '60-120 лв/час', color: 'text-blue-600' },
                      { category: 'Дизайн', rate: '40-80 лв/час', color: 'text-green-600' },
                      { category: 'Маркетинг', rate: '35-70 лв/час', color: 'text-purple-600' },
                      { category: 'Преподаване', rate: '30-60 лв/час', color: 'text-orange-600' },
                      { category: 'Ремонт', rate: '25-50 лв/час', color: 'text-red-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                        <span className={`font-medium ${item.color}`}>{item.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
