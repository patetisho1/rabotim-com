'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import SearchSection from '@/components/SearchSection'
import TaskGrid from '@/components/TaskGrid'
import Hero from '@/components/Hero'

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

  // Refs for scrolling animation
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Dynamic hero text animation
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const tasks = [
    "да разходи кучето",
    "да боядиса оградата", 
    "да смени крушките",
    "да прекопае градината",
    "да почисти апартамента",
    "да сглоби мебели",
    "да достави пратка",
    "да направи ремонт",
    "да ми направи сайт",
    "да ми напише CV",
    "да бъркаме бетон",
    "да разтоварим тир",
    "да бере грозде",
    "да сервира на сватба",
    "да води презентация",
    "да преведе документ",
    "да направи масаж",
    "да обучи детето",
    "да организира парти",
    "да направи фотографии",
    "да ремонтира кола",
    "да посади дървета",
    "да направи торта"
  ]

  // Service cards data for scrolling
  const serviceCards = [
    {
      name: "Преместване",
      subtitle: "Пакетиране, опаковане, преместване и още!",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Почистване на дома",
      subtitle: "Почистване, миене и подреждане на дома",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Сглобяване на мебели",
      subtitle: "Сглобяване и разглобяване на плоски мебели",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Доставки",
      subtitle: "Спешни доставки и куриерски услуги",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Градинарство",
      subtitle: "Мулчиране, плевене и подреждане",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Боядисване",
      subtitle: "Интериорно и екстериорно боядисване",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Майсторски услуги",
      subtitle: "Помощ с поддръжката на дома",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Бизнес и админ",
      subtitle: "Помощ с счетоводство и данъчни декларации",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Маркетинг и дизайн",
      subtitle: "Помощ с уебсайт и дизайн",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Нещо друго",
      subtitle: "Монтиране на изкуство и картини",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Фотография",
      subtitle: "Сватбена, портретна и продуктова фотография",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Уеб разработка",
      subtitle: "Създаване и поддръжка на уебсайтове",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Личен треньор",
      subtitle: "Фитнес коучинг и тренировъчни планове",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Грижа за домашни любимци",
      subtitle: "Грижа за вашите домашни любимци",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Организиране на събития",
      subtitle: "Организиране и управление на вашите събития",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Частни уроци",
      subtitle: "Академична поддръжка и помощ с домашните",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Измиване на автомобили",
      subtitle: "Външно и вътрешно почистване на автомобили",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Масажна терапия",
      subtitle: "Релаксационни и терапевтични масажи",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "Готвене и печене",
      subtitle: "Приготвяне на ястия и персонализирани сладкиши",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      name: "IT поддръжка",
      subtitle: "Ремонт на компютри и техническа помощ",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    }
  ]

  // Intersection Observer hooks for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
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

  // Auto-scroll effect for service cards
  useEffect(() => {
    if (!containerRef.current) return

    const cardHeight = 208 + 24 // Card height (h-52 = 208px) + mb-6 (1.5rem = 24px)
    const scrollStep = 1 // Scroll by 1px for smooth continuous movement

    scrollIntervalRef.current = setInterval(() => {
      setScrollPosition((prevPos) => {
        const newPos = prevPos + scrollStep
        // When we reach the end of the first set, reset to continue seamlessly
        if (newPos >= serviceCards.length * cardHeight) {
          return 0
        }
        return newPos
      })
    }, 50) // Faster interval for smooth continuous scrolling

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [])

  // Dynamic hero text animation
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tasks.length)
    }, 2000) // Change task every 2 seconds

    return () => clearInterval(textInterval)
  }, [tasks.length])

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
    <main className="bg-blue-50 min-h-dvh">
      <header className="mx-auto w-full max-w-[640px] px-4 py-4 sm:px-6 flex items-center justify-between">
        <a href="/" className="text-[22px] font-extrabold text-blue-700">Rabotim.com</a>
        <button className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <span className="sr-only">Отвори меню</span>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 6h14M3 10h14M3 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <Hero />

        {/* Post Your First Task Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Left Column - How it works */}
              <div className="flex flex-col justify-center">
                <div className="max-w-md">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Публикувайте първата си задача за секунди
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Спестете си часове и изпълнете списъка си със задачи
                  </p>
                  
                  {/* Steps */}
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Опишете какво ви е необходимо
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Детайлно описание на задачата, която искате да бъде изпълнена
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Определете бюджета си
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Задайте бюджет и срок за изпълнение на задачата
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Получете оферти и изберете най-добрия изпълнител
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Сравнете предложенията и изберете най-подходящия изпълнител
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <button 
                    onClick={handlePostTask}
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg"
                  >
                    Публикувайте задачата си
                  </button>
                </div>
              </div>

              {/* Right Column - Service Categories Grid with Auto-scroll */}
              <div className="w-full">
                <div className="bg-blue-50 rounded-xl p-8 h-[600px] overflow-hidden relative shadow-sm">
                  <div
                    ref={containerRef}
                    className="absolute inset-0 w-full h-full grid grid-cols-2 gap-6 p-8"
                    style={{ 
                      transform: `translateY(${-scrollPosition}px)`
                    }}
                  >
                    {serviceCards.concat(serviceCards).map((service, index) => (
                      <div key={index} className="relative h-52 rounded-xl overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200 mb-6">
                        {/* Background Image */}
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between">
                          {/* Avatar */}
                          <div className="flex justify-start">
                            <img 
                              src={service.avatar} 
                              alt="Profile" 
                              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                            />
                          </div>
                          
                          {/* Text */}
                          <div className="text-white">
                            <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                            <p className="text-sm opacity-90 leading-relaxed">{service.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
  )
} 