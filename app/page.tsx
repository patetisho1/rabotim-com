'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import SearchSection from '@/components/SearchSection'
import CategoryGrid from '@/components/CategoryGrid'
import TaskGrid from '@/components/TaskGrid'

import { Search, Plus, List, Users, MapPin, Star, Clock, CheckCircle, ArrowRight, Quote, DollarSign, Shield, Smartphone, TrendingUp, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

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
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Intersection Observer hooks for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [trustRef, trustInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [taskersRef, taskersInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [categoriesRef, categoriesInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [tasksRef, tasksInView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    // Зареждане на статистики от localStorage
    const loadStats = async () => {
      setIsLoadingStats(true)
      // Симулиране на зареждане
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      
      // По-реалистични статистики
      const baseTasks = Math.max(tasks.length, 15) // Минимум 15 задачи
      const baseUsers = Math.max(users.length, 250) // Минимум 250 потребители
      const cities = new Set(tasks.map((task: any) => task.location)).size
      const activeCities = Math.max(cities, 12) // Минимум 12 града
      
      setStats({
        tasks: baseTasks,
        users: baseUsers,
        cities: activeCities,
        completed: Math.floor(baseTasks * 0.85) // 85% завършени задачи
      })
      setIsLoadingStats(false)
    }
    
    loadStats()
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

  const handleBecomeTasker = () => {
    router.push('/register')
  }

  const trustFeatures = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Директни плащания",
      description: "Плащането се извършва директно между вас и изпълнителя след завършване на задачата.",
      link: "Прочетете повече"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Доверени рейтинги и отзиви",
      description: "Изберете правилния човек за задачата въз основа на реални рейтинги и отзиви от други потребители.",
      link: "Прочетете повече"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Защита и сигурност",
      description: "Предоставяме защита и сигурност за изпълнителите при извършване на повечето задачи.",
      link: "Прочетете повече"
    }
  ]

  const featuredTaskers = [
    {
      name: "Стела",
      rating: 4.7,
      completionRate: 95,
      specialties: "жилищно, след наем и търговско почистване",
      bio: "Стела е мигрант, която намери работа чрез Rabotim. Приложението ѝ помага да балансира работата и семейството.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      review: "Не мога да препоръчам Стела достатъчно. Тя е старателна, върши всичко на висок стандарт, има отлична комуникация и е много надеждна.",
      reviewer: "— Паулина А."
    },
    {
      name: "Георги",
      rating: 5.0,
      completionRate: 98,
      specialties: "градинар, еколог, готвач, чистач",
      bio: "Георги използва Rabotim, за да преследва страстта си към изкуствата, актьорството и писането.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      review: "Наехме Георги да се погрижи за нашите стайни растения. Георги работи усърдно да почисти и пресади растенията ни, и сега те изглеждат по-здрави и щастливи от преди.",
      reviewer: "— Арт Х."
    }
  ]

  const recentTasks = [
    {
      id: "1",
      title: "Почистване на апартамент",
      price: 25,
      priceType: "hourly",
      location: "София, Лозенец",
      category: "cleaning",
      postedBy: "Мария Петрова",
      postedDate: "2024-01-15T10:30:00Z",
      rating: 4.8,
      reviewCount: 127,
      views: 45,
      applications: 8,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "2",
      title: "Ремонт на баня",
      price: 1500,
      priceType: "fixed",
      location: "Пловдив, Център",
      category: "handyman",
      postedBy: "Иван Димитров",
      postedDate: "2024-01-14T14:20:00Z",
      rating: 4.9,
      reviewCount: 89,
      views: 32,
      applications: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "3",
      title: "Разходка с кучето ми",
      price: 20,
      priceType: "hourly",
      location: "Варна, Морска градина",
      category: "dog-care",
      postedBy: "Елена Стоянова",
      postedDate: "2024-01-13T09:15:00Z",
      rating: 4.7,
      reviewCount: 156,
      views: 28,
      applications: 12,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "4",
      title: "Уроци по математика",
      price: 30,
      priceType: "hourly",
      location: "София, Младост",
      category: "tutoring",
      postedBy: "Стефан Георгиев",
      postedDate: "2024-01-12T16:45:00Z",
      rating: 4.6,
      reviewCount: 78,
      views: 35,
      applications: 6,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="bg-[#001B44] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              
              {/* Left Text */}
              <div className="max-w-2xl mb-12 lg:mb-0 text-center lg:text-left">
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 transition-all duration-1000 ${heroInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  СВЪРШЕТЕ ВСИЧКО
                </h1>
                <p className={`text-xl md:text-2xl text-gray-300 mb-8 transition-all duration-1000 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Публикувайте всяка задача. Изберете най-добрия човек. Свършете я.
                </p>
                <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-500 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <button
                    onClick={handlePostTask}
                    className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    Публикувайте задачата си безплатно
                    <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={handleBecomeTasker}
                    className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                  >
                    Печелете пари като изпълнител
                  </button>
                </div>
                <div className={`mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-lg transition-all duration-1000 delay-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {isLoadingStats ? (
                    <>
                      <span className="animate-pulse">Зареждане...</span>
                      <span className="animate-pulse">Зареждане...</span>
                      <span className="animate-pulse">Зареждане...</span>
                    </>
                  ) : (
                    <>
                      <span>{stats.users}+ клиенти</span>
                      <span>{stats.completed}+ свършени задачи</span>
                      <span>4.8★ рейтинг</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Illustrations */}
              <div className="relative w-full lg:w-1/2 flex justify-center">
                <div className="relative">
                  {/* Ladder illustration */}
                  <div className="absolute left-0 top-0 w-32 h-64 bg-blue-400 rounded-lg transform rotate-12 opacity-80"></div>
                  <div className="absolute left-4 top-8 w-24 h-48 bg-blue-300 rounded-lg transform rotate-12 opacity-60"></div>
                  
                  {/* Person climbing */}
                  <div className="absolute left-8 top-16 w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  
                  {/* Swinging character */}
                  <div className="absolute right-8 top-8 w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center transform rotate-12">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section ref={trustRef} className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left - User Story */}
              <div className="relative">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face" 
                    alt="Tasker" 
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  
                  {/* Blue splash effects */}
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-300 rounded-full opacity-60"></div>
                  
                  {/* Mobile phone overlay */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="text-xs text-gray-600 mb-1">Задача завършена</div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">👍</span>
                      <span className="text-xs">Плащането освободено преди 2м</span>
                    </div>
                  </div>
                  
                  {/* Rating overlay */}
                  <div className="absolute -top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&crop=face" 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-sm">5.0 ★ Общ рейтинг</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Trust Features */}
              <div>
                <h2 className={`text-4xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${trustInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Функции за доверие и сигурност за вашата защита
                </h2>
                
                <div className="space-y-8">
                  {trustFeatures.map((feature, index) => (
                    <div key={index} className={`flex gap-4 transition-all duration-1000 delay-${index * 200} ${trustInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="text-blue-600">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {feature.description}
                        </p>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                          {feature.link}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handlePostTask}
                  className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                >
                  Публикувайте задачата си безплатно
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Be Your Own Boss Section */}
        <section ref={taskersRef} className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left - Value Proposition */}
              <div>
                <h2 className={`text-4xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${taskersInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Бъдете собственик на себе си
                </h2>
                <p className={`text-xl text-gray-600 mb-8 transition-all duration-1000 delay-300 ${taskersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Независимо дали сте гений в електронните таблици или усърден дърводелец, намерете следващата си работа в Rabotim.
                </p>
                
                <div className={`space-y-4 mb-8 transition-all duration-1000 delay-500 ${taskersInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Безплатен достъп до хиляди възможности за работа</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Без абонамент или кредитни такси</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Печелете допълнителен доход с гъвкав график</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Развийте бизнеса и клиентската база</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleBecomeTasker}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                >
                  Печелете пари като изпълнител
                </button>
              </div>

              {/* Right - Earnings & Mobile Interface */}
              <div className="relative">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=500&fit=crop" 
                    alt="Gardener" 
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  
                  {/* Blue splash effects */}
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-300 rounded-full opacity-60"></div>
                  
                  {/* Mobile phone overlay */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="text-xs text-gray-600 mb-1">Плащането получено</div>
                    <div className="font-semibold">"Боядисване на столове"</div>
                    <div className="text-green-600 font-bold">179 лв</div>
                  </div>
                  
                  {/* Earnings graph */}
                  <div className="absolute -bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="text-xs text-gray-600 mb-1">Общи приходи</div>
                    <div className="font-bold text-lg">13,066 лв</div>
                    <div className="text-green-600 text-sm">+20% миналия месец</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics */}
            <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${taskersInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                160,000 изпълнители са спечелили доход в Rabotim
              </h3>
              <p className="text-xl text-gray-600">
                Започнете да печелите с доверената местна пазарна платформа за услуги в България
              </p>
            </div>
          </div>
        </section>

        {/* Featured Taskers */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredTaskers.map((tasker, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-6 mb-6">
                    <img 
                      src={tasker.avatar} 
                      alt={tasker.name} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tasker.name}</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold">{tasker.rating} ★ Общ рейтинг</span>
                        </div>
                        <div className="text-gray-600">{tasker.completionRate}% Процент на завършване</div>
                      </div>
                      <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                        Специалности: {tasker.specialties}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tasker.bio}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Метод на плащане</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-sm">Мобилен</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Какво казват отзивите</h4>
                    <blockquote className="text-gray-600 italic">
                      "{tasker.review}"
                    </blockquote>
                    <div className="text-sm text-gray-500 mt-2">{tasker.reviewer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories with Auto-scrolling */}
        <CategoryGrid />

        {/* Recent Tasks */}
        <section ref={tasksRef} className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-1000 ${tasksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Вижте какво другите свършват
              </h2>
            </div>
            
            {/* Category Tabs */}
            <div className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${tasksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex space-x-1 bg-white rounded-full p-1 shadow-sm">
                {['Преместване', 'Поддръжка на дома', 'Стартиране на бизнес', 'Партита', 'Нещо различно'].map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      index === 0 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Task Cards Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-500 ${tasksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {recentTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/task/${task.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={task.avatar} 
                        alt={task.postedBy} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                          {task.category === 'cleaning' ? 'Почистване' :
                           task.category === 'handyman' ? 'Ремонт' :
                           task.category === 'delivery' ? 'Доставка' :
                           task.category === 'gardening' ? 'Градинарство' :
                           task.category === 'tutoring' ? 'Обучение' :
                           task.category === 'dog-care' ? 'Грижа за кучета' :
                           task.category === 'care' ? 'Грижа' : 'Друго'}
                        </div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{task.rating}</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {task.priceType === 'hourly' ? `${task.price} лв/час` : `${task.price} лв`}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className={`text-center transition-all duration-1000 delay-700 ${tasksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button 
                onClick={handlePostTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
              >
                Публикувайте задачата си безплатно
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 