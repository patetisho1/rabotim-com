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

// Steps for task seekers/workers
const workerSteps: Step[] = [
  {
    id: 1,
    title: 'Регистрирайте се за минути',
    description: 'Създайте профил с няколко клика. Добавете вашите умения, опит и снимка за да привлечете повече клиенти.',
    icon: <UserCheck size={24} />,
    color: 'text-blue-600',
    mobileScreen: 'bg-gradient-to-br from-blue-50 to-blue-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Създайте профил</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <UserCheck size={24} className="text-blue-600" />
            </div>
            <input 
              type="text" 
              placeholder="Вашето име"
              className="w-full text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded p-2 mb-2"
              readOnly
            />
            <input 
              type="email" 
              placeholder="Вашият имейл"
              className="w-full text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded p-2"
              readOnly
            />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: 'Изберете вашите умения',
    description: 'Маркирайте категориите, в които сте експерт. Колкото повече умения имате, толкова повече задачи можете да получавате.',
    icon: <Award size={24} />,
    color: 'text-green-600',
    mobileScreen: 'bg-gradient-to-br from-green-50 to-green-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Вашите умения</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              {['Майсторски услуги', 'Почистване', 'Градинарство', 'Доставки'].map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: 'Получете уведомления за нови задачи',
    description: 'Получавайте известия за задачи, които отговарят на вашите умения. Отговаряйте бързо за да увеличите шансовете си.',
    icon: <MessageCircle size={24} />,
    color: 'text-purple-600',
    mobileScreen: 'bg-gradient-to-br from-purple-50 to-purple-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <div className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-medium mb-3">
            🔔 3 Нови задачи
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Нови задачи за вас</h3>
        </div>
        <div className="space-y-3">
          {[
            { title: 'Почистване на апартамент', location: 'София, Лозенец', price: '25 лв/час' },
            { title: 'Ремонт на баня', location: 'Пловдив, Център', price: '1500 лв' },
            { title: 'Разходка с куче', location: 'Варна, Морска градина', price: '20 лв/час' }
          ].map((task, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="font-medium text-gray-800 text-sm">{task.title}</p>
              <p className="text-xs text-gray-600">{task.location}</p>
              <p className="text-xs font-semibold text-green-600">{task.price}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: 'Изпълнете задачите и изкарайте пари',
    description: 'След завършване на задачата, получавайте плащането директно от клиента. Изградете репутация и получавайте повече задачи.',
    icon: <DollarSign size={24} />,
    color: 'text-yellow-600',
    mobileScreen: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    mobileContent: (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Вашите приходи</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-2">2,450 лв</div>
            <p className="text-sm text-gray-600 mb-3">Общо изкарани този месец</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Завършени задачи:</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Среден рейтинг:</span>
                <span className="font-semibold">4.9 ⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
      <div className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Как работи
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Четири прости стъпки за да намерите перфектния изпълнител за вашата задача
            </p>
          </div>

          <div className="space-y-32">
            {steps.map((step, index) => (
              <div key={step.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Text Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color.replace('text-', 'bg-')} text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <span className="text-3xl font-bold text-gray-900">Стъпка {step.id}</span>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed mb-10">
                    {step.description}
                  </p>
                  
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Публикувайте задачата си безплатно
                    <ArrowRight size={20} />
                  </button>
                </div>

                {/* Visual Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} flex justify-center`}>
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative w-96 h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-green-100">
                      <img
                        src={step.id === 1 ? "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop&crop=center" :
                             step.id === 2 ? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center" :
                             step.id === 3 ? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop&crop=center" :
                             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=center"}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                              <div class="text-center">
                                <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                  📱
                                </div>
                                <p class="text-gray-600 font-medium">${step.title}</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                          {step.mobileContent}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-80 shadow-lg"></div>
                    <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-80 shadow-lg"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-1/4 -right-8 w-6 h-6 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
                    <div className="absolute bottom-1/4 -left-8 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
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

      {/* How It Works for Workers Section */}
      <div className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Изкарайте допълнителен доход
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Четири прости стъпки за да започнете да изкарвате пари с вашите умения
            </p>
          </div>

          <div className="space-y-32">
            {workerSteps.map((step, index) => (
              <div key={step.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Text Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color.replace('text-', 'bg-')} text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <span className="text-3xl font-bold text-gray-900">Стъпка {step.id}</span>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed mb-10">
                    {step.description}
                  </p>
                  
                  <button
                    onClick={handleBecomeTasker}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Станете изпълнител
                    <ArrowRight size={20} />
                  </button>
                </div>

                {/* Visual Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} flex justify-center`}>
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative w-96 h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-blue-100">
                      <img
                        src={step.id === 1 ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" :
                             step.id === 2 ? "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face" :
                             step.id === 3 ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" :
                             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                              <div class="text-center">
                                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                  👤
                                </div>
                                <p class="text-gray-600 font-medium">${step.title}</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                          {step.mobileContent}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-80 shadow-lg"></div>
                    <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-80 shadow-lg"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-1/4 -right-8 w-6 h-6 bg-orange-400 rounded-full opacity-60 animate-bounce"></div>
                    <div className="absolute bottom-1/4 -left-8 w-4 h-4 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
                  </div>
                </div>
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
