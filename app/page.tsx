'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import SearchSection from '@/components/SearchSection'
import CategoryGrid from '@/components/CategoryGrid'
import TaskGrid from '@/components/TaskGrid'

import { Search, Plus, List, Users, MapPin, Star, Clock, CheckCircle, ArrowRight, Quote } from 'lucide-react'
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
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [categoriesRef, categoriesInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [tasksRef, tasksInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    // Зареждане на статистики от localStorage
    const loadStats = async () => {
      setIsLoadingStats(true)
      // Симулиране на зареждане
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const cities = new Set(tasks.map((task: any) => task.location)).size
      
      setStats({
        tasks: tasks.length,
        users: users.length || 150, // Fallback стойност
        cities: cities || 8,
        completed: Math.floor(tasks.length * 0.7) // Симулирани завършени задачи
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
      {/* Main Content */}
      <main className="pb-20">
        {/* Hero Section */}
        <section ref={heroRef} className="bg-[#001B44] text-white py-20">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
            
            {/* Left Text */}
            <div className="max-w-lg mb-10 md:mb-0">
              <h1 className={`text-5xl md:text-6xl font-extrabold leading-tight transition-all duration-1000 ${heroInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Направи работата <span className="text-blue-400">лесна</span>
              </h1>
              <p className={`mt-6 text-lg text-gray-300 transition-all duration-1000 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Публикувайте задача. Изберете най-добрия човек. Свършете я — бързо и лесно.
              </p>
              <div className={`mt-8 flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button
                  onClick={handlePostTask}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-white font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  Намери изпълнител
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleViewAllTasks}
                  className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition-all duration-200"
                >
                  Стани изпълнител
                </button>
              </div>
              <div className={`mt-6 flex gap-6 text-sm text-gray-300 transition-all duration-1000 delay-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span>👥 {stats.users}+ клиенти</span>
                <span>✅ {stats.completed}+ свършени задачи</span>
                <span>⭐ 4.8★ рейтинг</span>
              </div>
            </div>

            {/* Right Task Cards */}
            <div className="relative w-full md:w-1/2 flex justify-center">
              <div className="w-96 h-80 overflow-hidden relative">
                {/* Task Cards */}
                <div className="absolute inset-0">
                  {[
                    {
                      id: 1,
                      title: "Почистване на дом",
                      price: 65,
                      priceType: "fixed",
                      location: "София",
                      category: "cleaning",
                      postedBy: "Мария И.",
                      postedDate: "2024-01-15",
                      rating: 4.8,
                      reviewCount: 12,
                      views: 45,
                      applications: 3,
                      attachments: [
                        {
                          name: "cleaning1.jpg",
                          size: 1024000,
                          type: "image/jpeg",
                          url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
                        }
                      ]
                    },
                    {
                      id: 2,
                      title: "Ремонт на баня",
                      price: 300,
                      priceType: "fixed",
                      location: "Пловдив",
                      category: "handyman",
                      postedBy: "Иван П.",
                      postedDate: "2024-01-14",
                      rating: 4.9,
                      reviewCount: 8,
                      views: 32,
                      applications: 2,
                      attachments: [
                        {
                          name: "bathroom1.jpg",
                          size: 1024000,
                          type: "image/jpeg",
                          url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
                        }
                      ]
                    },
                    {
                      id: 3,
                      title: "Доставка на храна",
                      price: 20,
                      priceType: "fixed",
                      location: "Варна",
                      category: "delivery",
                      postedBy: "Петър Д.",
                      postedDate: "2024-01-13",
                      rating: 4.7,
                      reviewCount: 15,
                      views: 28,
                      applications: 1,
                      attachments: [
                        {
                          name: "delivery1.jpg",
                          size: 1024000,
                          type: "image/jpeg",
                          url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
                        }
                      ]
                    },
                    {
                      id: 4,
                      title: "Градинарски услуги",
                      price: 100,
                      priceType: "fixed",
                      location: "Бургас",
                      category: "gardening",
                      postedBy: "Стоян Г.",
                      postedDate: "2024-01-12",
                      rating: 4.6,
                      reviewCount: 6,
                      views: 19,
                      applications: 2,
                      attachments: [
                        {
                          name: "gardening1.jpg",
                          size: 1024000,
                          type: "image/jpeg",
                          url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop"
                        }
                      ]
                    },
                    {
                      id: 5,
                      title: "Уроци по математика",
                      price: 40,
                      priceType: "hourly",
                      location: "София",
                      category: "tutoring",
                      postedBy: "Анна К.",
                      postedDate: "2024-01-11",
                      rating: 4.9,
                      reviewCount: 22,
                      views: 67,
                      applications: 4,
                      attachments: [
                        {
                          name: "tutoring1.jpg",
                          size: 1024000,
                          type: "image/jpeg",
                          url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
                        }
                      ]
                    },
                    {
                      id: 6,
                      title: "Фотографски услуги",
                      price: 250,
                      priceType: "fixed",
                      location: "Пловдив",
                      category: "other",
                      postedBy: "Елена М.",
                      postedDate: "2024-01-10",
                      rating: 4.8,
                      reviewCount: 18,
                      views: 41,
                      applications: 3,
                      attachments: [
                        {
                          name: "photography1.jpg",
                          size: 1024000,
                          type: "image/jpeg",
                          url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop"
                        }
                      ]
                    }
                                     ].map((task, index) => (
                     <Link
                       key={task.id}
                       href={`/task/${task.id}`}
                       className="absolute inset-0 task-card-rotation block"
                     >
                       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full cursor-pointer group">
                        {/* Image */}
                        {task.attachments && task.attachments.length > 0 && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={task.attachments[0].url} 
                              alt={task.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                task.category === 'cleaning' ? 'bg-blue-100 text-blue-600' :
                                task.category === 'handyman' ? 'bg-orange-100 text-orange-600' :
                                task.category === 'delivery' ? 'bg-yellow-100 text-yellow-600' :
                                task.category === 'gardening' ? 'bg-green-100 text-green-600' :
                                task.category === 'tutoring' ? 'bg-indigo-100 text-indigo-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {task.category === 'cleaning' ? 'Почистване' :
                                 task.category === 'handyman' ? 'Ремонт' :
                                 task.category === 'delivery' ? 'Доставка' :
                                 task.category === 'gardening' ? 'Градинарство' :
                                 task.category === 'tutoring' ? 'Обучение' :
                                 'Фотография'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2 line-clamp-2">
                            {task.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <MapPin size={14} className="mr-1" />
                              {task.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Clock size={14} className="mr-1" />
                              {task.postedDate === '2024-01-15' ? 'днес' :
                               task.postedDate === '2024-01-14' ? 'вчера' :
                               'преди 2 дни'}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star size={14} className="text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {task.rating}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({task.reviewCount})
                              </span>
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {task.priceType === 'hourly' ? `${task.price} лв/час` : `${task.price} лв`}
                            </div>
                                                     </div>
                         </div>
                       </div>
                     </Link>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section ref={categoriesRef} className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-all duration-1000 ${categoriesInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Популярни категории
              </h2>
              <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${categoriesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Намерете работа или изпълнител в различни области
              </p>
            </div>
            <CategoryGrid />
          </div>
        </section>

        {/* How It Works */}
        <section ref={howItWorksRef} className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-all duration-1000 ${howItWorksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Как работи
              </h2>
              <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${howItWorksInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Само три прости стъпки до успешното завършване на вашата задача
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className={`text-center group transition-all duration-700 delay-${index * 200} ${howItWorksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 animate-float">
                      <div className="text-primary-600 dark:text-primary-400">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold animate-bounce">
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
        <section ref={tasksRef} className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className={`flex justify-between items-center mb-8 transition-all duration-1000 ${tasksInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
        <section ref={testimonialsRef} className="py-16 px-4 bg-gray-100 dark:bg-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-all duration-1000 ${testimonialsInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Какво казват нашите потребители
              </h2>
              <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Реални отзиви от доволни клиенти и изпълнители
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-500 delay-${index * 200} cursor-pointer ${testimonialsInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
        <section ref={ctaRef} className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-1000 ${ctaInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Готови сте да започнете?
            </h2>
            <p className={`text-xl mb-8 text-primary-100 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Публикувайте задача или намерете работа в минути. Присъединете се към нашата общност!
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

    </div>
  )
} 