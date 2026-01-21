'use client'

import { useState } from 'react'
import { ArrowLeft, Building2, Star, Users, TrendingUp, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CompanyProfilesCatalog from '@/components/CompanyProfilesCatalog'

export default function CompaniesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'catalog' | 'stats' | 'partnership'>('catalog')

  const stats = [
    {
      icon: Building2,
      value: '500+',
      label: 'Партньорски компании',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      value: '4.7/5',
      label: 'Среден рейтинг',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      value: '95%',
      label: 'Верифицирани профили',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      value: '+200%',
      label: 'Ръст на партньорството',
      color: 'text-purple-600'
    }
  ]

  const industries = [
    { name: 'IT услуги', count: 120, color: 'bg-blue-500' },
    { name: 'Дизайн и реклама', count: 85, color: 'bg-green-500' },
    { name: 'Здравеопазване', count: 65, color: 'bg-red-500' },
    { name: 'Образование', count: 55, color: 'bg-purple-500' },
    { name: 'Правни услуги', count: 40, color: 'bg-orange-500' },
    { name: 'Екология', count: 35, color: 'bg-teal-500' }
  ]

  const benefits = [
    {
      title: 'Увеличете видимостта',
      description: 'Вашата компания ще се показва на хиляди потенциални клиенти',
      icon: '👁️'
    },
    {
      title: 'Получавайте качествени заявки',
      description: 'Клиентите ще намират вашата компания чрез нашата платформа',
      icon: '🎯'
    },
    {
      title: 'Управлявайте проектите лесно',
      description: 'Цялостна система за управление на задачи и комуникация',
      icon: '📊'
    },
    {
      title: 'Изградете репутация',
      description: 'Получавайте отзиви и изградете доверие сред клиентите',
      icon: '⭐'
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
                Компании партньори
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Открийте доверени компании за вашите нужди
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
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Статистики
            </button>
            <button
              onClick={() => setActiveTab('partnership')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'partnership'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Партньорство
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'catalog' && (
          <CompanyProfilesCatalog />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Industry Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Разпределение по индустрии
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries.map((industry, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {industry.name}
                      </h3>
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {industry.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${industry.color}`}
                        style={{ width: `${(industry.count / 120) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Истории на успеха
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">TechCorp Bulgaria</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">IT услуги</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Преди партньорството:</span>
                      <span className="text-sm font-medium">5-8 заявки/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">След партньорството:</span>
                      <span className="text-sm font-medium text-green-600">25-30 заявки/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Увеличение:</span>
                      <span className="text-sm font-bold text-green-600">+300%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Creative Studio</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Дизайн и реклама</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Преди партньорството:</span>
                      <span className="text-sm font-medium">3-5 проекта/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">След партньорството:</span>
                      <span className="text-sm font-medium text-green-600">15-20 проекта/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Увеличение:</span>
                      <span className="text-sm font-bold text-green-600">+250%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">HealthCare Plus</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Здравеопазване</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Преди партньорството:</span>
                      <span className="text-sm font-medium">10-15 заявки/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">След партньорството:</span>
                      <span className="text-sm font-medium text-green-600">40-50 заявки/месец</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Увеличение:</span>
                      <span className="text-sm font-bold text-green-600">+200%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partnership' && (
          <div className="space-y-8">
            {/* Partnership Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Защо да станете партньор?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-4xl">{benefit.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partnership Plans */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Планове за партньорство
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Basic
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Безплатно
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Основни профил
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      До 5 активни задачи
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Email поддръжка
                    </li>
                  </ul>
                  <button className="w-full bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg font-medium">
                    Започнете безплатно
                  </button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border-2 border-blue-500">
                  <div className="text-center mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Най-популярен
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Professional
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    49 €/месец
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Всичко от Basic
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Неограничени задачи
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Приоритет в търсенето
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      VIP поддръжка
                    </li>
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Изберете Professional
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Enterprise
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    149 €/месец
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Всичко от Professional
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Персонализиран профил
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      API достъп
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-green-500">✓</span>
                      Персональен мениджър
                    </li>
                  </ul>
                  <button className="w-full bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg font-medium">
                    Свържете се с нас
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                Готови ли сте да станете партньор?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Присъединете се към стотиците компании, които успешно използват нашата платформа за намиране на клиенти.
              </p>
              <button className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Станете партньор днес
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
