'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Shield, Users, Star, Zap, Heart, MessageCircle } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Бързо и лесно',
    description: 'Публикувай задача за 2 минути и получавай отговори веднага',
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: '100% сигурно',
    description: 'Всички потребители са верифицирани и платформата е защитена',
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Активна общност',
    description: 'Над 5000 активни потребителя готови да работят',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: 'Качествена работа',
    description: 'Рейтинг система гарантира високо качество на услугите',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  }
]

const steps = [
  {
    number: '1',
    title: 'Публикувай задача',
    description: 'Опиши какво ти трябва, кога и колко искаш да платиш',
    icon: '📝'
  },
  {
    number: '2',
    title: 'Получавай отговори',
    description: 'Получаваш предложения от квалифицирани изпълнители',
    icon: '💬'
  },
  {
    number: '3',
    title: 'Избери най-добрия',
    description: 'Прегледай профилите и избери най-подходящия кандидат',
    icon: '✅'
  },
  {
    number: '4',
    title: 'Работата свършена!',
    description: 'Изпълнителят свършва работата и получаваш качествен резултат',
    icon: '🎉'
  }
]

export default function HowItWorksSection() {
  const [currentStep, setCurrentStep] = useState(0)

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Защо да избереш <span className="text-blue-600">Rabotim</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Най-голямата платформа за задачи в България с над 10,000 успешни проекта
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-2"
            >
              <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Как работи платформата?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Само 4 лесни стъпки до успешна работа
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 dark:from-blue-800 dark:via-green-800 dark:to-purple-800 transform -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    index === currentStep ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {/* Step circle */}
                  <div className={`relative mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <div className="text-2xl font-bold">{step.number}</div>
                    <div className="absolute -top-2 -right-2 text-2xl">{step.icon}</div>
                  </div>

                  {/* Step content */}
                  <h4 className={`text-lg font-bold mb-3 transition-colors duration-500 ${
                    index === currentStep
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Предимства за всички
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Независимо дали търсиш работа или работници
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Task Givers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6" />
                За публикуващи задачи
              </h4>
              <ul className="space-y-3">
                {[
                  'Безплатна публикация на задачи',
                  'Бързо намиране на изпълнители',
                  'Прозрачни цени и условия',
                  'Гаранция за качество',
                  '24/7 поддръжка'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Task Executors */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6" />
                За изпълнители
              </h4>
              <ul className="space-y-3">
                {[
                  'Безплатна регистрация',
                  'Гъвкаво работно време',
                  'Допълнителен доход',
                  'Изграждане на репутация',
                  'Нови възможности за растеж'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
