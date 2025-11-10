'use client'

import { useState } from 'react'
import { ArrowLeft, Crown, CheckCircle, Star, Zap, Shield, TrendingUp, Users, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PremiumFeatures from '@/components/PremiumFeatures'

export default function PremiumPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Увеличете доходите си',
      description: 'Премиум членовете печелят средно 150% повече от обикновените изпълнители',
      stats: '+150% повече заявки'
    },
    {
      icon: Star,
      title: 'Приоритет в търсенето',
      description: 'Вашият профил се показва първи в резултатите, което означава повече видимост',
      stats: '3x повече видимост'
    },
    {
      icon: Shield,
      title: 'Застраховка на работата',
      description: 'Защита за вашите проекти с покритие до 10,000 лв за всеки проект',
      stats: 'До 10,000 лв покритие'
    },
    {
      icon: Users,
      title: 'VIP поддръжка',
      description: 'Приоритетна поддръжка от нашия експертен екип 24/7',
      stats: '24/7 поддръжка'
    }
  ]

  const testimonials = [
    {
      name: 'Мария Петрова',
      role: 'Графичен дизайнер',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'След като станах премиум член, заявките ми се увеличиха с 300%! Профилът ми изглежда много професионално и клиентите ми се доверяват повече.',
      earnings: '+300% повече заявки',
      period: 'Преди 6 месеца'
    },
    {
      name: 'Иван Димитров',
      role: 'IT консултант',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Премиум функциите ми помогнаха да се отлича от конкуренцията и да намеря по-качествени клиенти. Сега работя само с премиум клиенти.',
      earnings: '+200% по-високи цени',
      period: 'Преди 4 месеца'
    },
    {
      name: 'Елена Георгиева',
      role: 'Преподавател по английски',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'VIP поддръжката е невероятна! Винаги получавам бърз отговор и професионална помощ. Застраховката ми дава спокойствие.',
      earnings: '24/7 поддръжка',
      period: 'Преди 8 месеца'
    }
  ]

  const faqs = [
    {
      question: 'Какво включва премиум членството?',
      answer: 'Премиум членството включва приоритет в търсенето, промоция на профила, разширени статистики, VIP поддръжка, застраховка на работата и много други функции.'
    },
    {
      question: 'Мога ли да отменя членството по всяко време?',
      answer: 'Да, можете да отмените членството си по всяко време без допълнителни такси. Ще запазите премиум функциите до края на текущия период.'
    },
    {
      question: 'Как работи застраховката на работата?',
      answer: 'Застраховката покрива до 10,000 лв за всеки проект при недовършена работа, закъснения или други проблеми. Покритието е автоматично за всички премиум членове.'
    },
    {
      question: 'Има ли безплатен пробен период?',
      answer: 'Да, предлагаме 14-дневен безплатен пробен период за нови членове. Можете да тествате всички премиум функции без задължение.'
    },
    {
      question: 'Как се изчислява приоритетът в търсенето?',
      answer: 'Премиум членовете се показват първи в резултатите от търсенето, последвани от верифицирани и обикновени профили. Това значително увеличава видимостта.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Премиум членство
              </h1>
              <p className="text-blue-100">
                Разгърнете пълния потенциал на профила си
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                </div>
                <p className="text-blue-100 text-sm mb-3">
                  {benefit.description}
                </p>
                <div className="text-lg font-bold text-yellow-300">
                  {benefit.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Pricing */}
        <PremiumFeatures variant="pricing" className="mb-16" />

        {/* Testimonials */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Какво казват нашите премиум членове
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
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
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                  "{testimonial.text}"
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-green-600">
                    {testimonial.earnings}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.period}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Често задавани въпроси
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8" />
            <h2 className="text-2xl font-bold">
              Готови ли сте да станете премиум?
            </h2>
          </div>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Присъединете се към хилядите премиум изпълнители, които увеличават доходите си с нашите функции
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Започнете безплатния пробен период
            </button>
            <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Говорете с нашия екип
            </button>
          </div>
          <p className="text-green-100 text-sm mt-4">
            14-дневен безплатен пробен период • Отмяна по всяко време • Без скрити такси
          </p>
        </div>
      </div>
    </div>
  )
}
