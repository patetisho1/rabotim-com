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
  TrendingUp,
  Smartphone,
  Edit3,
  CreditCard,
  UserCheck
} from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  mobileScreen: string
  mobileContent: React.ReactNode
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
    description: 'Опишете задачата в няколко изречения. Бъдете прости и ясни, за да привлечете най-добрите изпълнители.',
    icon: <Edit3 size={24} />,
    color: 'text-blue-600',
    mobileScreen: 'bg-gradient-to-br from-blue-50 to-blue-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Започнете със заглавие</h3>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <input 
              type="text" 
              placeholder="Помощ при ремонт на хладилник"
              className="w-full text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
              readOnly
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Опишете детайлно какво ви е необходимо...</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: 'Определете бюджета си',
    description: 'Не се притеснявайте, можете да коригирате бюджета по-късно и да го обсъдите с потенциалните изпълнители.',
    icon: <CreditCard size={24} />,
    color: 'text-green-600',
    mobileScreen: 'bg-gradient-to-br from-green-50 to-green-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Вашият приблизителен бюджет</h3>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-4">290 лв</div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00', '000'].map((num) => (
                <button key={num} className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 text-sm font-medium text-gray-700">
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: 'Получете оферти и изберете най-добрия изпълнител',
    description: 'Разгледайте профили, рейтинги, процент на завършване и отзиви, за да изберете изпълнителя, с когото искате да работите.',
    icon: <UserCheck size={24} />,
    color: 'text-purple-600',
    mobileScreen: 'bg-gradient-to-br from-purple-50 to-purple-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium mb-3">
            5 Нови оферти получени
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Нужен е майстор</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Иван Д.', rating: '4.9', price: '250 лв', avatar: '👨‍🔧' },
            { name: 'Петър М.', rating: '4.8', price: '280 лв', avatar: '👨‍💼' },
            { name: 'Стоян К.', rating: '4.7', price: '220 лв', avatar: '👨‍🔨' }
          ].map((offer, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                  {offer.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{offer.name}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{offer.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{offer.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: 'Завършете задачата и оставете отзив',
    description: 'След завършване на задачата, оставете отзив за изпълнителя и оценете качеството на работата.',
    icon: <Star size={24} />,
    color: 'text-yellow-600',
    mobileScreen: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Оставете отзив</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={24} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <textarea 
              placeholder="Споделете вашия опит..."
              className="w-full text-sm text-gray-700 placeholder-gray-400 border-none outline-none resize-none"
              rows={3}
              readOnly
            />
            <button className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium mt-3">
              Изпрати отзив
            </button>
          </div>
        </div>
      </div>
    )
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Публикувайте задача. Получете оферти. Завършете я.
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Най-доброто място за хора и бизнеси да възлагат задачи.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
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
                  Станете изпълнител
                </button>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 bg-blue-600 rounded-full opacity-20 absolute -top-4 -right-4"></div>
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone size={48} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Лесно и бързо
                    </h3>
                    <p className="text-gray-600">
                      Публикувайте задачата си за минути и получете оферти от квалифицирани изпълнители
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16">
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

          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={step.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Text Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 ${step.color}`}>
                      {step.icon}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">Стъпка {step.id}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {step.description}
                  </p>
                  
                  <button
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    Публикувайте задачата си безплатно
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Mobile Screen */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} flex justify-center`}>
                  <div className="relative">
                    {/* Phone Frame */}
                    <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 rounded-t-[2.5rem] flex items-center justify-between px-6 text-white text-xs">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-2 bg-white rounded-sm"></div>
                            <div className="w-1 h-3 bg-white rounded-sm"></div>
                          </div>
                        </div>
                        
                        {/* Screen Content */}
                        <div className={`w-full h-full ${step.mobileScreen} pt-8`}>
                          {step.mobileContent}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 rounded-full opacity-20"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-600 rounded-full opacity-20"></div>
                  </div>
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
