'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
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
  const [selectedJobCategory, setSelectedJobCategory] = useState('Всички')

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



  const activeJobListings = [
    {
      id: "1",
      title: "Почистване на апартамент",
      description: "Търся някой да почисти апартамент в Кв. Бояна. 140 кв/м и тераса, нужна е генерална почистка.",
      price: 25,
      priceType: "hourly",
      location: "София, Кв. Бояна",
      category: "Почистване",
      postedBy: "Мария Петрова",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "2",
      title: "Ремонт на баня",
      description: "Нужен е майстор за ремонт на баня. Замяна на плочки, ремонт на душ кабина и монтаж на ново санитари.",
      price: 1500,
      priceType: "fixed",
      location: "Пловдив, Център",
      category: "Ремонт",
      postedBy: "Иван Димитров",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "3",
      title: "Разходка с кучето",
      description: "Търся някой да разходи кучето ми два пъти дневно. Кучето е спокойно и послушно, нужни са 30 мин разходка.",
      price: 20,
      priceType: "hourly",
      location: "Варна, Морска градина",
      category: "Доставка",
      postedBy: "Елена Стоянова",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "4",
      title: "Уроци по математика",
      description: "Нужен е учител по математика за ученик в 8 клас. Уроците да са 2 пъти седмично по 90 минути.",
      price: 30,
      priceType: "hourly",
      location: "София, Младост",
      category: "Обучение",
      postedBy: "Стефан Георгиев",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "5",
      title: "Градинарски услуги",
      description: "Нужен е градинар за подреждане на градината. Плевене, подрязване на живи плетове и посаждане на цветя.",
      price: 35,
      priceType: "hourly",
      location: "София, Драгалевци",
      category: "Градинарство",
      postedBy: "Петър Иванов",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "6",
      title: "Сглобяване на мебели",
      description: "Нужен е майстор за сглобяване на кухненски шкафове и маса. Мебелите са от IKEA.",
      price: 200,
      priceType: "fixed",
      location: "София, Лозенец",
      category: "Ремонт",
      postedBy: "Анна Георгиева",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "7",
      title: "Доставка на храни",
      description: "Нужна е доставка на храни от магазин до дома. Списъкът ще бъде предоставен предварително.",
      price: 15,
      priceType: "fixed",
      location: "София, Център",
      category: "Доставка",
      postedBy: "Николай Петров",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "8",
      title: "Почистване след ремонт",
      description: "Нужна е генерална почистка след ремонт на апартамент. Включва почистване на прах и отпадъци.",
      price: 300,
      priceType: "fixed",
      location: "София, Изток",
      category: "Почистване",
      postedBy: "Георги Стоянов",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "9",
      title: "Уроци по английски",
      description: "Търся учител по английски за начинаещи. Уроците да са онлайн, 2 пъти седмично по 60 минути.",
      price: 25,
      priceType: "hourly",
      location: "Онлайн",
      category: "Обучение",
      postedBy: "Мария Иванова",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "10",
      title: "Поддръжка на градина",
      description: "Нужна е редовна поддръжка на градината - плевене, поливане, подрязване на растения.",
      price: 40,
      priceType: "hourly",
      location: "София, Бояна",
      category: "Градинарство",
      postedBy: "Иван Петров",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "11",
      title: "Ремонт на електрически уреди",
      description: "Нужен е електротехник за ремонт на пералня и хладилник. Проблемът е с електрическата част.",
      price: 120,
      priceType: "fixed",
      location: "София, Младост",
      category: "Ремонт",
      postedBy: "Петър Георгиев",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "12",
      title: "Почистване на офис",
      description: "Нужна е почистка на офис пространство 200 кв/м. Включва почистване на работни места и общи зони.",
      price: 400,
      priceType: "fixed",
      location: "София, Център",
      category: "Почистване",
      postedBy: "Анна Петрова",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "13",
      title: "Доставка на мебели",
      description: "Нужна е доставка на диван и маса от магазин до дома. Разстояние около 5 км.",
      price: 80,
      priceType: "fixed",
      location: "София, Лозенец",
      category: "Доставка",
      postedBy: "Николай Иванов",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "14",
      title: "Уроци по музика",
      description: "Търся учител по пиано за дете 8 години. Уроците да са в дома ни, веднъж седмично по 45 минути.",
      price: 35,
      priceType: "hourly",
      location: "София, Драгалевци",
      category: "Обучение",
      postedBy: "Елена Петрова",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "15",
      title: "Посаждане на дървета",
      description: "Нужен е градинар за посаждане на 10 плодни дървета. Включва копаене на ями и посаждане.",
      price: 250,
      priceType: "fixed",
      location: "София, Бояна",
      category: "Градинарство",
      postedBy: "Георги Иванов",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "16",
      title: "Ремонт на покрив",
      description: "Нужен е покривчик за ремонт на покрива. Проблемът е с подпокривната изолация.",
      price: 800,
      priceType: "fixed",
      location: "София, Бояна",
      category: "Ремонт",
      postedBy: "Иван Стоянов",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "17",
      title: "Почистване на автомобил",
      description: "Нужна е пълна почистка на автомобил - вътре и отвън. Включва пълнене и полиране.",
      price: 60,
      priceType: "fixed",
      location: "София, Център",
      category: "Почистване",
      postedBy: "Петър Стоянов",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "18",
      title: "Доставка на документи",
      description: "Нужна е спешна доставка на документи от офис до банка. Разстояние около 3 км.",
      price: 25,
      priceType: "fixed",
      location: "София, Център",
      category: "Доставка",
      postedBy: "Анна Георгиева",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "19",
      title: "Уроци по рисуване",
      description: "Търся учител по рисуване за дете 10 години. Уроците да са в дома ни, веднъж седмично.",
      price: 30,
      priceType: "hourly",
      location: "София, Младост",
      category: "Обучение",
      postedBy: "Стефан Петров",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "20",
      title: "Подреждане на градина",
      description: "Нужна е подредба на градината - подрязване на живи плетове, почистване на пътеки.",
      price: 45,
      priceType: "hourly",
      location: "София, Драгалевци",
      category: "Градинарство",
      postedBy: "Мария Стоянова",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "21",
      title: "Почистване на вила",
      description: "Нужна е почистка на вила 300 кв/м. Включва почистване на всички стаи, баня и кухня.",
      price: 500,
      priceType: "fixed",
      location: "София, Бояна",
      category: "Почистване",
      postedBy: "Иван Петров",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "22",
      title: "Ремонт на кухня",
      description: "Нужен е майстор за ремонт на кухненски шкафове и монтаж на ново оборудване.",
      price: 1200,
      priceType: "fixed",
      location: "София, Младост",
      category: "Ремонт",
      postedBy: "Анна Георгиева",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "23",
      title: "Доставка на пица",
      description: "Нужна е доставка на пица от ресторант до дома. Разстояние около 2 км.",
      price: 8,
      priceType: "fixed",
      location: "София, Център",
      category: "Доставка",
      postedBy: "Петър Стоянов",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "24",
      title: "Уроци по програмиране",
      description: "Търся учител по Python за начинаещи. Уроците да са онлайн, веднъж седмично по 90 мин.",
      price: 40,
      priceType: "hourly",
      location: "Онлайн",
      category: "Обучение",
      postedBy: "Стефан Петров",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "25",
      title: "Почистване на офис",
      description: "Нужна е почистка на офис пространство 150 кв/м. Включва почистване на работни места.",
      price: 300,
      priceType: "fixed",
      location: "София, Изток",
      category: "Почистване",
      postedBy: "Георги Иванов",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "26",
      title: "Ремонт на електрическа инсталация",
      description: "Нужен е електротехник за ремонт на електрическата инсталация в апартамента.",
      price: 250,
      priceType: "fixed",
      location: "София, Лозенец",
      category: "Ремонт",
      postedBy: "Николай Петров",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "27",
      title: "Доставка на цветя",
      description: "Нужна е доставка на букет цветя за сватба. Разстояние около 10 км.",
      price: 35,
      priceType: "fixed",
      location: "София, Бояна",
      category: "Доставка",
      postedBy: "Елена Стоянова",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "28",
      title: "Уроци по английски за деца",
      description: "Търся учител по английски за дете 6 години. Уроците да са в дома ни, 2 пъти седмично.",
      price: 25,
      priceType: "hourly",
      location: "София, Драгалевци",
      category: "Обучение",
      postedBy: "Мария Иванова",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "29",
      title: "Поддръжка на паркова зона",
      description: "Нужен е градинар за поддръжка на паркова зона. Включва плевене, поливане и подрязване.",
      price: 50,
      priceType: "hourly",
      location: "София, Център",
      category: "Градинарство",
      postedBy: "Иван Стоянов",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: "30",
      title: "Почистване на автомобил",
      description: "Нужна е пълна почистка на автомобил - вътре и отвън. Включва пълнене и полиране.",
      price: 60,
      priceType: "fixed",
      location: "София, Младост",
      category: "Почистване",
      postedBy: "Петър Георгиев",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
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

  // Filter jobs based on selected category
  const filteredJobs = useMemo(() => {
    if (selectedJobCategory === 'Всички') {
      return activeJobListings;
    }
    return activeJobListings.filter(job => job.category === selectedJobCategory);
  }, [selectedJobCategory, activeJobListings]);

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
          <div className="max-w-7xl mx-auto">
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
                {['Всички', 'Почистване', 'Ремонт', 'Доставка', 'Градинарство', 'Обучение'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      tab === selectedJobCategory
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSelectedJobCategory(tab)}
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
                  {/* Duplicate the filtered jobs for seamless loop */}
                  {[...filteredJobs, ...filteredJobs].slice(0, 20).map((job, index) => (
                    <Link 
                      key={`${job.id}-${index}`} 
                      href={`/tasks?category=${encodeURIComponent(job.category)}`}
                      className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      <div className="h-24 overflow-hidden">
                        <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={job.avatar} alt={job.postedBy} className="w-6 h-6 rounded-full object-cover" />
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">{job.category}</div>
                        </div>
                        <div className="font-semibold text-gray-900 text-xs group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{job.title}</div>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{job.rating}</span>
                          </div>
                          <div className="text-sm font-bold text-green-600">{job.priceType === 'hourly' ? `${job.price} лв/час` : `${job.price} лв`}</div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Bottom Row - Moving Right */}
              <div className="relative overflow-hidden">
                <div className="flex space-x-6 animate-scroll-right">
                  {/* Duplicate the filtered jobs for seamless loop */}
                  {[...filteredJobs, ...filteredJobs].slice(20, 40).map((job, index) => (
                    <Link 
                      key={`${job.id}-${index + 20}`} 
                      href={`/tasks?category=${encodeURIComponent(job.category)}`}
                      className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      <div className="h-24 overflow-hidden">
                        <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={job.avatar} alt={job.postedBy} className="w-6 h-6 rounded-full object-cover" />
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">{job.category}</div>
                        </div>
                        <div className="font-semibold text-gray-900 text-xs group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{job.title}</div>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{job.rating}</span>
                          </div>
                          <div className="text-sm font-bold text-green-600">{job.priceType === 'hourly' ? `${job.price} лв/час` : `${job.price} лв`}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-12">
              <Link href="/tasks" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200">
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