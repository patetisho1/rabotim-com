'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  Users, 
  Star, 
  Clock, 
  DollarSign, 
  MessageCircle,
  ArrowRight,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface Stat {
  value: string
  label: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Опишете какво ви е необходимо',
    description: 'Детайлно опишете задачата, която искате да бъде изпълнена. Добавете снимки, специфични изисквания и предпочитания.',
    icon: <MessageCircle size={24} />,
    color: 'text-blue-600'
  },
  {
    id: 2,
    title: 'Определете бюджета си',
    description: 'Задайте бюджет и срок за изпълнение на задачата. Можете да изберете между фиксирана цена или почасова ставка.',
    icon: <DollarSign size={24} />,
    color: 'text-green-600'
  },
  {
    id: 3,
    title: 'Получете оферти и изберете най-добрия изпълнител',
    description: 'Сравнете предложенията от квалифицирани изпълнители и изберете най-подходящия за вашата задача.',
    icon: <Users size={24} />,
    color: 'text-purple-600'
  },
  {
    id: 4,
    title: 'Завършете задачата и оставете отзив',
    description: 'След завършване на задачата, оставете отзив за изпълнителя и оценете качеството на работата.',
    icon: <Star size={24} />,
    color: 'text-yellow-600'
  }
]

const stats: Stat[] = [
  {
    value: '50K+',
    label: 'Доволни клиенти',
    icon: <Users size={20} className="text-blue-600" />
  },
  {
    value: '100K+',
    label: 'Завършени задачи',
    icon: <CheckCircle size={20} className="text-green-600" />
  },
  {
    value: '4.8',
    label: 'Среден рейтинг',
    icon: <Star size={20} className="text-yellow-600" />
  },
  {
    value: '24ч',
    label: 'Средно време за отговор',
    icon: <Clock size={20} className="text-purple-600" />
  }
]

const benefits = [
  {
    title: 'Гарантирано качество',
    description: 'Всички изпълнители са проверени и с положителни отзиви',
    icon: <Shield size={20} className="text-green-600" />
  },
  {
    title: 'Директна комуникация',
    description: 'Уговаряйте условията и плащането директно с изпълнителя',
    icon: <MessageCircle size={20} className="text-blue-600" />
  },
  {
    title: 'Бързо изпълнение',
    description: 'Получете оферти в рамките на минути, не дни',
    icon: <Clock size={20} className="text-purple-600" />
  },
  {
    title: 'Гъвкави цени',
    description: 'Изберете между фиксирана цена или почасова ставка',
    icon: <TrendingUp size={20} className="text-orange-600" />
  }
]

export default function HowItWorksPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/post-task')
  }

  const handleBecomeTasker = () => {
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              НАПРАВЕТЕ ВСИЧКО
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Публикувайте задача. Изберете най-добрия човек. Завършете я.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Публикувайте задача безплатно
                <ArrowRight size={20} />
              </button>
              <button
                onClick={handleBecomeTasker}
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Печете пари като изпълнител
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-blue-100 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Как работи
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Четири прости стъпки за да намерите перфектния изпълнител за вашата задача
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 z-0" />
                )}
                
                <div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 ${step.color}`}>
                    {step.icon}
                  </div>
                  
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.id}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Защо да изберете нас?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Вашата сигурност и удовлетворение са наш приоритет
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Готови сте да започнете?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Присъединете се към хилядите доволни клиенти, които вече използват нашата платформа
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              Публикувайте първата си задача
              <ArrowRight size={20} />
            </button>
            <button
              onClick={handleBecomeTasker}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Станете изпълнител
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Често задавани въпроси
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Колко струва да публикувам задача?
              </h3>
              <p className="text-gray-600">
                Публикуването на задача е напълно безплатно. Ние не удържаме никакъв процент от плащанията - те се уговарят директно между вас и изпълнителя.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Как се гарантира качеството на работата?
              </h3>
              <p className="text-gray-600">
                Всички изпълнители са проверени и имат положителни отзиви. Препоръчваме ви да прегледате профилите и отзивите преди да изберете изпълнител.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                За колко време ще получа оферти?
              </h3>
              <p className="text-gray-600">
                Обикновено получавате първите оферти в рамките на 30 минути. За спешни задачи може да получите оферти още по-бързо.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Как се извършват плащанията?
              </h3>
              <p className="text-gray-600">
                Плащането се уговаря директно между вас и изпълнителя. Ние осигуряваме само платформата за свързване - условията и начинът на плащане са ваше решение.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Мога ли да отменя задачата?
              </h3>
              <p className="text-gray-600">
                Да, можете да отменяте задачата преди да изберете изпълнител без никакви такси. След избора на изпълнител се уговарят условията за отмяна.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
