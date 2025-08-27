'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Shield,
  Globe,
  Award,
  TrendingUp,
  MessageCircle,
  DollarSign
} from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()

  const stats = [
    {
      value: '50K+',
      label: 'Доволни клиенти',
      icon: <Users size={24} className="text-blue-600" />
    },
    {
      value: '100K+',
      label: 'Завършени задачи',
      icon: <CheckCircle size={24} className="text-green-600" />
    },
    {
      value: '4.8',
      label: 'Среден рейтинг',
      icon: <Star size={24} className="text-yellow-600" />
    },
    {
      value: '24ч',
      label: 'Средно време за отговор',
      icon: <Clock size={24} className="text-purple-600" />
    }
  ]

  const values = [
    {
      title: 'Доверие и сигурност',
      description: 'Изграждаме доверие чрез прозрачност, проверени изпълнители и защитени транзакции.',
      icon: <Shield size={32} className="text-blue-600" />
    },
    {
      title: 'Качество и надеждност',
      description: 'Гарантираме високо качество на услугите чрез строги стандарти и постоянен контрол.',
      icon: <Award size={32} className="text-green-600" />
    },
    {
      title: 'Иновации и технологии',
      description: 'Използваме най-новите технологии за да направим процеса по-лесен и ефективен.',
      icon: <TrendingUp size={32} className="text-purple-600" />
    },
    {
      title: 'Общност и подкрепа',
      description: 'Създаваме общност от доволни клиенти и успешни изпълнители.',
      icon: <Heart size={32} className="text-red-600" />
    }
  ]

  const team = [
    {
      name: 'Иван Петров',
      position: 'CEO & Основател',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      description: '10+ години опит в технологичния сектор'
    },
    {
      name: 'Мария Георгиева',
      position: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      description: 'Експерт в разработката на дигитални решения'
    },
    {
      name: 'Петър Стоянов',
      position: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      description: 'Специалист в управлението на операциите'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              За Rabotim.com
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Създаваме бъдещето на работата, свързвайки хора с умения с хора, които имат нужда от тях
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/post-task')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Публикувайте задача
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Станете изпълнител
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {stat.icon}
                  <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Нашата мисия
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                В Rabotim.com вярваме, че всеки човек има уникални умения, които могат да помогнат на другите. 
                Нашата мисия е да създадем платформа, която прави свързването между хората лесно, сигурно и взаимно изгодно.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Искаме да демократизираме достъпа до качествени услуги и да дадем възможност на хората да изкарват 
                достойни пари с техните умения, независимо от географското им местоположение.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-blue-600" />
                  <span className="text-gray-600">Достъпни в цяла България</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-green-600" />
                  <span className="text-gray-600">24/7 поддръжка</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Създаваме общност
                  </h3>
                  <p className="text-gray-600">
                    Свързваме хора, изграждаме доверие и създаваме възможности за растеж
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Нашите ценности
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Тези принципи ни водят във всичко, което правим
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Нашият екип
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Познайте хората зад Rabotim.com
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-48 h-48 rounded-full mx-auto bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center shadow-lg">
                          <div class="text-center">
                            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              👤
                            </div>
                            <p class="text-gray-600 font-medium">${member.name}</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600">
                  {member.description}
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
            Присъединете се към нас
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Бъдете част от революцията в начина, по който хората работят и свързват
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/post-task')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              Публикувайте първата си задача
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push('/register')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Станете изпълнител
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
