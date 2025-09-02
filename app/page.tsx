'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import SearchSection from '@/components/SearchSection'
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

  // Refs for scrolling animation
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Dynamic hero text animation
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
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

  // Rotating examples animation
  useEffect(() => {
    const exampleInterval = setInterval(() => {
      setCurrentExampleIndex((prevIndex) => (prevIndex + 1) % 6) // 6 examples
    }, 8000) // Change example every 8 seconds

    return () => clearInterval(exampleInterval)
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

  // Active Job Listings data
  const activeJobListings = [
    {
      id: "1",
      title: "Почистване на апартамент",
      description: "Търся някой да почисти апартамент след ремонт. 120 кв/м, 2 стаи, кухня, баня.",
      price: 220,
      priceType: "fixed",
      location: "София, Лозенец",
      category: "Почистване",
      postedBy: "Мария П.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "2",
      title: "Ремонт на баня",
      description: "Нужен е майстор за пълна реконструкция на баня. 8 кв/м, нова електроника.",
      price: 1500,
      priceType: "fixed",
      location: "Пловдив, Център",
      category: "Ремонт",
      postedBy: "Иван Д.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "3",
      title: "Разходка с кучето",
      description: "Търся някой да разходи моя златен ретривър 2 пъти дневно. Парк близо до нас.",
      price: 25,
      priceType: "hourly",
      location: "Варна, Морска градина",
      category: "Грижа за животни",
      postedBy: "Елена С.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "4",
      title: "Уроци по математика",
      description: "Нужен е учител по математика за 8-ми клас. 2 пъти седмично, 90 мин.",
      price: 30,
      priceType: "hourly",
      location: "София, Младост",
      category: "Обучение",
      postedBy: "Стефан Г.",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "5",
      title: "Боядисване на стая",
      description: "Боядисване на 2 стаи и коридор. 60 кв/м общо. Бяла боя, готови стени.",
      price: 400,
      priceType: "fixed",
      location: "София, Надежда",
      category: "Ремонт",
      postedBy: "Петър К.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "6",
      title: "Сглобяване на мебели",
      description: "Нужен е майстор за сглобяване на кухненски шкафове. 5 броя, плоски мебели.",
      price: 150,
      priceType: "fixed",
      location: "София, Изток",
      category: "Монтаж",
      postedBy: "Анна В.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "7",
      title: "Доставка на мебели",
      description: "Доставка на диван от ИКЕА до апартамент в центъра. 3-ти етаж, асансьор.",
      price: 120,
      priceType: "fixed",
      location: "София, Център",
      category: "Доставка",
      postedBy: "Владимир Т.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "8",
      title: "Градинарски услуги",
      description: "Търся градинар за подреждане на градината. Плевене, подрязване, насаждане.",
      price: 45,
      priceType: "hourly",
      location: "София, Бояна",
      category: "Градинарство",
      postedBy: "Георги М.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "9",
      title: "Фотограф за сватба",
      description: "Нужен е фотограф за сватбена снимка. 6 часа работа, 2 локации, 200+ снимки.",
      price: 800,
      priceType: "fixed",
      location: "София, Банкя",
      category: "Фотография",
      postedBy: "Дарина Л.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "10",
      title: "Ремонт на компютър",
      description: "Нужен е IT специалист за ремонт на лаптоп. Проблем с батерията и вентилатора.",
      price: 80,
      priceType: "fixed",
      location: "София, Люлин",
      category: "IT услуги",
      postedBy: "Николай С.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "11",
      title: "Почистване на офис",
      description: "Почистване на офис 200 кв/м. 5 стаи, кухня, 2 бани. След ремонт.",
      price: 350,
      priceType: "fixed",
      location: "София, Бизнес парк",
      category: "Почистване",
      postedBy: "Светлана К.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "12",
      title: "Монтаж на климатик",
      description: "Монтаж на сплит климатик. 2-ри етаж, балкон, готови тръби за фреон.",
      price: 200,
      priceType: "fixed",
      location: "София, Младост",
      category: "Монтаж",
      postedBy: "Димитър П.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "13",
      title: "Грижа за дете",
      description: "Търся бавачка за 3-годишно дете. 4 часа дневно, игри, разходка в парка.",
      price: 35,
      priceType: "hourly",
      location: "София, Лозенец",
      category: "Грижа за деца",
      postedBy: "Елена М.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "14",
      title: "Ремонт на кола",
      description: "Нужен е механик за смяна на спирачките. Форд Фокус, предни и задни.",
      price: 300,
      priceType: "fixed",
      location: "София, Надежда",
      category: "Автосервиз",
      postedBy: "Стоян В.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "15",
      title: "Организиране на парти",
      description: "Организиране на 30-ти рожден ден. 50 гости, ресторант, декор, забавления.",
      price: 500,
      priceType: "fixed",
      location: "София, Център",
      category: "Организация",
      postedBy: "Анна К.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "16",
      title: "Превод на документи",
      description: "Превод на 20 страници от английски на български. Юридически документи.",
      price: 25,
      priceType: "page",
      location: "София, Център",
      category: "Преводи",
      postedBy: "Мария Г.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "17",
      title: "Монтаж на завеси",
      description: "Монтаж на 4 завеси в хола. Готови релси, нужен само монтаж.",
      price: 80,
      priceType: "fixed",
      location: "София, Изток",
      category: "Монтаж",
      postedBy: "Петър Д.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "18",
      title: "Грижа за растения",
      description: "Търся някой да се грижи за стайните растения. Поливане, подрязване, пресаждане.",
      price: 40,
      priceType: "hourly",
      location: "София, Бояна",
      category: "Градинарство",
      postedBy: "Георги С.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "19",
      title: "Ремонт на телевизор",
      description: "Нужен е техник за ремонт на LED телевизор. Проблем с изображението.",
      price: 150,
      priceType: "fixed",
      location: "София, Младост",
      category: "Ремонт",
      postedBy: "Николай К.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "20",
      title: "Уроци по пиано",
      description: "Нужен е учител по пиано за начинаещ. 1 път седмично, 60 мин, у дома.",
      price: 50,
      priceType: "hourly",
      location: "София, Лозенец",
      category: "Музика",
      postedBy: "Елена В.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main>
                {/* Hero Section - Mobile Optimized */}
        <section 
          ref={heroRef} 
          className="relative text-white py-12 md:py-24 overflow-hidden min-h-screen"
          style={{
            backgroundImage: `url('/hero-image-dark.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              
                             {/* Main Title - Mobile Optimized */}
               <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 md:mb-6 transition-all duration-1000 font-display ${heroInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                 Търся някой...
               </h1>
              
                             {/* Rotating Task Text - Mobile Optimized */}
               <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-200 mb-4 md:mb-6 h-10 sm:h-12 flex items-center justify-center transition-all duration-500 font-accent ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                 <span className="transition-all duration-500 px-2">
                   {tasks[currentTaskIndex]}
                 </span>
               </div>
              
                             {/* Subtitle - Mobile Optimized */}
               <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 px-4 transition-all duration-1000 delay-300 font-readable ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                 Намери точния човек за твоята задача.
               </p>
              
              {/* Airtasker-style Buttons - Mobile Optimized with better touch targets */}
              <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-sm sm:max-w-none transition-all duration-1000 delay-500 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                 <button
                   onClick={handlePostTask}
                   className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg min-h-[56px] touch-manipulation font-heading"
                 >
                   <span className="whitespace-nowrap">Публикувай обява безплатно</span>
                   <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                 </button>
                 <button
                   onClick={handleBecomeTasker}
                   className="bg-white hover:bg-gray-100 active:bg-gray-200 text-blue-700 px-6 sm:px-8 py-4 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg min-h-[56px] touch-manipulation font-heading"
                 >
                   Стани изпълнител
                 </button>
              </div>
              
                             {/* Stats - Mobile Optimized */}
               <div className={`mt-8 md:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-lg transition-all duration-1000 delay-700 font-body ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                 {isLoadingStats ? (
                   <>
                     <span className="animate-pulse">Зареждане...</span>
                     <span className="animate-pulse">Зареждане...</span>
                     <span className="animate-pulse">Зареждане...</span>
                   </>
                 ) : (
                   <>
                     <span className="flex items-center gap-1">
                       <Users size={16} className="sm:w-5 sm:h-5" />
                       {stats.users}+ клиенти
                     </span>
                     <span className="flex items-center gap-1">
                       <CheckCircle size={16} className="sm:w-5 sm:h-5" />
                       {stats.completed}+ свършени задачи
                     </span>
                     <span className="flex items-center gap-1">
                       <Star size={16} className="sm:w-5 sm:h-5 fill-current" />
                       4.8★ рейтинг
                     </span>
                   </>
                 )}
               </div>
            </div>
          </div>
        </section>

        {/* Post Your First Task Section */}
        <section className="py-20 px-4 bg-white">
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
                    Публикувай обява безплатно
                  </button>
                  
                  {/* Learn How It Works Link */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link 
                      href="/how-it-works"
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      Научете как работи
                      <ArrowRight size={16} />
                    </Link>
                  </div>
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

        {/* Earn Extra with Your Skills Section */}
        <section ref={taskersRef} className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left - Value Proposition */}
              <div>
                <h2 className={`text-4xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${taskersInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Печели допълнително с уменията си – по твой график
                </h2>
                <p className={`text-xl text-gray-600 mb-8 transition-all duration-1000 delay-300 ${taskersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Станете част от нашата общност. Поемайте задачи съответсващи на вашите възможности.
                </p>
                
                <div className={`space-y-4 mb-8 transition-all duration-1000 delay-500 ${taskersInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Можете да заварявате - някой има нужда от вас</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Можете да боядисвате - някой има стена за боядисване</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Можете да направите сайт - някой ще плати за това</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Искате просто да се разходите - разходете кучето на някой</span>
                  </div>
                </div>
                
                <div className={`mb-8 transition-all duration-1000 delay-600 ${taskersInView ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <p className="text-lg text-gray-700 mb-4">
                    Разгледайте активните обяви и кандидатсвайте с един клик. Толкова е лесно.
                  </p>
                  <Link 
                    href="/tasks"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Вижте всички обяви
                    <ArrowRight size={16} />
                  </Link>
                </div>
                
                <button 
                  onClick={handleBecomeTasker}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                >
                  Станете изпълнител
                </button>
              </div>

              {/* Right - Rotating Task Examples */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg h-96 overflow-hidden">
                  <div className="h-full">
                    {(() => {
                      const examples = [
                        { name: "Дарина", task: "Грижа за домашни любимци", amount: "25 лв/час", rating: 4.9, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=320&fit=crop", description: "Търся някой да се грижи за моя златен ретривър 2 пъти дневно. Разходка в парка и игри." },
                        { name: "Мария", task: "Почистване на апартамент", amount: "220 лв", rating: 4.8, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=320&fit=crop", description: "Търся някой да почисти апартамент в Кв. Бояна. 140 кв/м и тераса. След ремонт." },
                        { name: "Иван", task: "Строителство", amount: "120 лв", rating: 4.7, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=320&fit=crop", description: "Нужен е майстор за изливане на бетон за основа. 20 кв/м площ. Спешно." },
                        { name: "Петър", task: "Градинарство", amount: "45 лв/час", rating: 4.9, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=320&fit=crop", description: "Търся градинар за подреждане на градината. Плевене, подрязване на дървета и цветя." },
                        { name: "Анна", task: "Фотография", amount: "200 лв", rating: 4.8, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=320&fit=crop", description: "Нужен е фотограф за сватбена снимка. 4 часа работа. Централна София." },
                        { name: "Владимир", task: "Боядисване", amount: "40 лв/час", rating: 4.8, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=320&fit=crop", description: "Боядисване на 3 стаи и коридор. 80 кв/м общо. Бяла боя. Спешно." }
                      ]
                      const currentExample = examples[currentExampleIndex]
                      
                      return (
                        <div key={currentExampleIndex} className="relative w-full h-full rounded-2xl overflow-hidden">
                          <img 
                            src={currentExample.image} 
                            alt={currentExample.task} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                          
                          {/* Top section - Name and task acceptance */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img 
                                src={currentExample.avatar} 
                                alt={currentExample.name} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                              />
                              <div>
                                <div className="font-semibold text-white text-sm">{currentExample.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-green-300 bg-green-800/50 px-2 py-1 rounded-full">
                                Прие задача
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom section - Task details and rating */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-white mb-3">
                              <div className="font-semibold text-lg mb-1">{currentExample.task}</div>
                              <div className="text-xs opacity-90 mb-2 leading-relaxed">{currentExample.description}</div>
                              <div className="font-bold text-green-400 text-lg">{currentExample.amount}</div>
                            </div>
                            
                            {/* Rating stars */}
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < Math.floor(currentExample.rating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              ))}
                              <span className="text-white text-sm ml-1">{currentExample.rating}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Job Listings */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Разгледайте активните обяви за работа
              </h2>
              <p className="text-xl text-gray-600">
                Намерете задачата, която отговаря на вашите умения
              </p>
            </div>
            
            {/* Category Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                {['Всички', 'Почистване', 'Ремонт', 'Доставка', 'Градинарство', 'Обучение'].map((tab, index) => (
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
            
            {/* Rotating Job Cards - Two Rows */}
            <div className="space-y-8">
              {/* Top Row - Moving Left */}
              <div className="relative overflow-hidden">
                <div className="flex space-x-6 animate-scroll-left">
                  {activeJobListings.slice(0, 10).map((job) => (
                    <div key={job.id} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={job.image} 
                          alt={job.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={job.avatar} 
                            alt={job.postedBy} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                              {job.category}
                            </div>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {job.title}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{job.rating}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {job.priceType === 'hourly' ? `${job.price} лв/час` : `${job.price} лв`}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bottom Row - Moving Right */}
              <div className="relative overflow-hidden">
                <div className="flex space-x-6 animate-scroll-right">
                  {activeJobListings.slice(10, 20).map((job) => (
                    <div key={job.id} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={job.image} 
                          alt={job.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={job.avatar} 
                            alt={job.postedBy} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                              {job.category}
                            </div>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {job.title}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{job.rating}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {job.priceType === 'hourly' ? `${job.price} лв/час` : `${job.price} лв`}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-12">
              <Link 
                href="/tasks"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
              >
                Вижте всички обяви
                <ArrowRight size={20} />
              </Link>
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
    </div>
  )
} 