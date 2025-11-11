'use client'

import { useState } from 'react'
import { Crown, Zap, Star, Shield, TrendingUp, Users, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

interface PremiumPlan {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  features: string[]
  isPopular?: boolean
  isRecommended?: boolean
}

interface PremiumFeaturesProps {
  className?: string
  variant?: 'default' | 'compact' | 'pricing'
}

export default function PremiumFeatures({ 
  className = '', 
  variant = 'default' 
}: PremiumFeaturesProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month')

  const premiumPlans: PremiumPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'month',
      features: [
        'Премиум профил с портфолио',
        'Приоритет в търсенето',
        'До 10 заявки на ден',
        'Основни статистики',
        'Email поддръжка'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19.99,
      period: 'month',
      features: [
        'Всичко от Basic',
        'Неограничени заявки',
        'Разширени статистики',
        'VIP поддръжка',
        'Промоция на профила',
        'Приоритетен отговор',
        'Календар за резервации'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 39.99,
      period: 'month',
      features: [
        'Всичко от Professional',
        'Персонализиран профил',
        'API достъп',
        'Беликети',
        'Персональен мениджър',
        'Приоритетна поддръжка 24/7',
        'Анализ на конкурентството'
      ],
      isRecommended: true
    }
  ]

  const premiumFeatures = [
    {
      icon: Crown,
      title: 'Премиум профил',
      description: 'Създайте професионален профил с портфолио, сертификати и детайлни умения',
      benefits: ['Привлича повече клиенти', 'Повышава доверието', 'Професионален вид']
    },
    {
      icon: Zap,
      title: 'Приоритет в търсенето',
      description: 'Вашият профил се показва първи в резултатите от търсенето',
      benefits: ['Повече видимост', 'Повече заявки', 'По-бързо намиране на клиенти']
    },
    {
      icon: Star,
      title: 'Промоция на профила',
      description: 'Вашият профил се подчертава с премиум значка и специални цветове',
      benefits: ['Отличава се от другите', 'Привлича вниманието', 'Повышава кликването']
    },
    {
      icon: TrendingUp,
      title: 'Разширени статистики',
      description: 'Получавайте детайлни анализи за вашата работа и производителност',
      benefits: ['Анализ на производителността', 'Проследяване на доходите', 'Оптимизация на стратегията']
    },
    {
      icon: Users,
      title: 'VIP поддръжка',
      description: 'Приоритетна поддръжка от нашия експертен екип',
      benefits: ['Бърз отговор', 'Персонализирана помощ', 'Експертни съвети']
    },
    {
      icon: Shield,
      title: 'Застраховка на работата',
      description: 'Защита за вашите проекти с покритие до 10,000 лв',
      benefits: ['Финансова защита', 'Спокойствие', 'Доверие от клиентите']
    }
  ]

  const testimonials = [
    {
      name: 'Мария Петрова',
      role: 'Графичен дизайнер',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'След като станах премиум член, заявките ми се увеличиха с 300%! Профилът ми изглежда много професионално.',
      earnings: '+150% повече заявки'
    },
    {
      name: 'Иван Димитров',
      role: 'IT консултант',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Премиум функциите ми помогнаха да се отлича от конкуренцията и да намеря по-качествени клиенти.',
      earnings: '+200% по-високи цени'
    },
    {
      name: 'Елена Георгиева',
      role: 'Преподавател',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'VIP поддръжката е невероятна! Винаги получавам бърз отговор и професионална помощ.',
      earnings: '24/7 поддръжка'
    }
  ]

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Crown className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-bold">Премиум членство</h3>
            <p className="text-yellow-100">Разгърнете пълния потенциал на профила си</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">Приоритет в търсенето</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">Промоция на профила</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">VIP поддръжка</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">Разширени статистики</span>
          </div>
        </div>
        <button className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Станете премиум за 19.99 лв/месец
        </button>
      </div>
    )
  }

  if (variant === 'pricing') {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Изберете своя план
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Разгърнете пълния потенциал на профила си с нашите премиум планове
          </p>

          {/* Period Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${selectedPeriod === 'month' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Месечно
            </span>
            <button
              onClick={() => setSelectedPeriod(selectedPeriod === 'month' ? 'year' : 'month')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                selectedPeriod === 'year' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  selectedPeriod === 'year' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${selectedPeriod === 'year' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Годишно
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                plan.isPopular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Най-популярен
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedPeriod === 'year' ? Math.round(plan.price * 12 * 0.8) : plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    лв/{selectedPeriod === 'year' ? 'година' : 'месец'}
                  </span>
                </div>
                {selectedPeriod === 'year' && (
                  <p className="text-sm text-green-600 font-medium">
                    Спестете {Math.round(plan.price * 12 * 0.2)} лв годишно!
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Изберете план
              </button>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Какво казват нашите премиум членове
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  "{testimonial.text}"
                </p>
                <div className="text-sm font-medium text-green-600">
                  {testimonial.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="h-12 w-12 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Премиум функции
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Разгърнете пълния потенциал на профила си с нашите премиум функции и увеличите доходите си
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {premiumFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {feature.description}
            </p>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8" />
          <h3 className="text-2xl font-bold">
            Готови ли сте да станете премиум?
          </h3>
        </div>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Присъединете се към хилядите премиум изпълнители, които увеличават доходите си с нашите функции
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="float-left bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
            Станете премиум
            <ArrowRight className="h-5 w-5" />
          </button>
          <button className="float-left border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Вижте плановете
          </button>
        </div>
      </div>
    </div>
  )
}


