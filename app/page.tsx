'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import SearchSection from '@/components/SearchSection'
import CategoryGrid from '@/components/CategoryGrid'
import TaskGrid from '@/components/TaskGrid'
import MobileNav from '@/components/MobileNav'
import { Search, Plus, List, Users, MapPin, Star, Clock, CheckCircle, ArrowRight, Quote } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [stats, setStats] = useState({
    tasks: 0,
    users: 0,
    cities: 0,
    completed: 0
  })

  useEffect(() => {
    // Зареждане на статистики от localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const cities = new Set(tasks.map((task: any) => task.location)).size
    
    setStats({
      tasks: tasks.length,
      users: users.length || 150, // Fallback стойност
      cities: cities || 8,
      completed: Math.floor(tasks.length * 0.7) // Симулирани завършени задачи
    })
  }, [])

  const handleSearch = (query: string, category: string, location: string, filters: any) => {
    setSearchQuery(query)
    setSelectedCategory(category)
    setSelectedLocation(location)
    const filterParams = new URLSearchParams()
    if (query) filterParams.append('search', query)
    if (category) filterParams.append('category', category)
    if (location) filterParams.append('location', location)
    if (filters.priceMin) filterParams.append('priceMin', filters.priceMin)
    if (filters.priceMax) filterParams.append('priceMax', filters.priceMax)
    if (filters.urgent) filterParams.append('urgent', 'true')
    if (filters.rating) filterParams.append('rating', filters.rating)
    if (filters.datePosted) filterParams.append('datePosted', filters.datePosted)
    
    router.push(`/tasks?${filterParams.toString()}`)
  }

  const handlePostTask = () => {
    router.push('/post-task')
  }

  const handleViewAllTasks = () => {
    router.push('/tasks')
  }

  const howItWorks = [
    {
      icon: <Plus className="w-8 h-8" />,
      title: "Публикувайте задача",
      description: "Опишете какво ви трябва, задайте бюджет и срок",
      step: "1"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Получете предложения",
      description: "Изпълнители ще се свържат с вас с предложения",
      step: "2"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Изберете най-добрия",
      description: "Прегледайте профили, рейтинги и изберете подходящия",
      step: "3"
    }
  ]

  const testimonials = [
    {
      name: "Иван Петров",
      role: "Домакин",
      rating: 5,
      text: "Намерих отличен майстор за ремонт на банята. Работата беше свършена перфектно и навреме!",
      avatar: "👨‍💼"
    },
    {
      name: "Мария Георгиева",
      role: "Изпълнител",
      rating: 5,
      text: "Отлична платформа за намиране на работа. Имам редовни клиенти и стабилен доход.",
      avatar: "👩‍🔧"
    },
    {
      name: "Стоян Димитров",
      role: "Домакин",
      rating: 5,
      text: "Бързо и лесно намерих помощник за преместване. Много доволен от услугата!",
      avatar: "👨‍🏠"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 px-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Намерете или предложете
              <span className="block text-primary-200">почасова работа</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Свържете се с надеждни изпълнители или намерете работа в цяла България
            </p>
            
            <SearchSection onSearch={handleSearch} />
            
            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{stats.tasks}+</div>
                <div className="text-sm text-primary-200">Активни задачи</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{stats.users}+</div>
                <div className="text-sm text-primary-200">Доверени потребители</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{stats.cities}</div>
                <div className="text-sm text-primary-200">Градове</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{stats.completed}+</div>
                <div className="text-sm text-primary-200">Завършени задачи</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Популярни категории
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Намерете работа или изпълнител в различни области
              </p>
            </div>
            <CategoryGrid />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Как работи
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Само три прости стъпки до успешното завършване на вашата задача
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <div className="text-primary-600 dark:text-primary-400">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Tasks */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Последно публикувани задачи
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Разгледайте най-новите възможности за работа
                </p>
              </div>
              <button 
                onClick={handleViewAllTasks}
                className="btn btn-outline flex items-center gap-2"
              >
                <List size={16} />
                Виж всички
                <ArrowRight size={16} />
              </button>
            </div>
            <TaskGrid />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-gray-100 dark:bg-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Какво казват нашите потребители
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Реални отзиви от доволни клиенти и изпълнители
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-600 dark:text-gray-400 italic">
                    "{testimonial.text}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Готови сте да започнете?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Публикувайте задача или намерете работа в минути. Присъединете се към нашата общност!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handlePostTask}
                className="btn bg-white text-primary-600 hover:bg-gray-100 flex items-center justify-center gap-2 text-lg px-8 py-3 font-semibold"
              >
                <Plus size={20} />
                Публикувай задача
              </button>
              <button 
                onClick={handleViewAllTasks}
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 flex items-center justify-center gap-2 text-lg px-8 py-3 font-semibold"
              >
                <Search size={20} />
                Разгледай задачи
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
} 