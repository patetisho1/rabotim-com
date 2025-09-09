'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasksAPI, Task } from '@/hooks/useTasksAPI'
import { 
  Search, 
  MapPin, 
  Filter, 
  SortAsc, 
  Calendar, 
  DollarSign,
  Clock,
  User,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Briefcase,
  Wrench,
  Home,
  Car,
  Palette,
  BookOpen,
  Smartphone,
  Leaf
} from 'lucide-react'
import toast from 'react-hot-toast'
import GoogleMap from '@/components/GoogleMap'

// Task interface is imported from useTasksAPI

const categories = [
  { name: 'Всички категории', icon: Briefcase, value: '' },
  { name: 'Почистване', icon: Home, value: 'Почистване' },
  { name: 'Ремонт', icon: Wrench, value: 'Ремонт' },
  { name: 'Доставка', icon: Car, value: 'Доставка' },
  { name: 'Градинарство', icon: Leaf, value: 'Градинарство' },
  { name: 'Обучение', icon: BookOpen, value: 'Обучение' }
]

const locations = [
  'Всички локации',
  'София',
  'Пловдив', 
  'Варна',
  'Бургас',
  'Русе',
  'Стара Загора',
  'Плевен',
  'Сливен',
  'Добрич',
  'Шумен'
]

const priceRanges = [
  'Всяка цена',
  'До 50 лв',
  '50-100 лв',
  '100-200 лв',
  '200-500 лв',
  'Над 500 лв'
]

const sortOptions = [
  'Най-нови',
  'Най-висока цена',
  'Най-ниска цена',
  'Най-близки',
  'Най-популярни'
]

// Реални обяви за задачи
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Почистване на апартамент',
    description: 'Търся някой да почисти апартамент в Кв. Бояна. 140 кв/м и тераса, нужна е генерална почистка.',
    category: 'Почистване',
    price: 25,
    price_type: 'hourly',
    location: 'София, Кв. Бояна',
    deadline: '2024-02-15',
    urgent: false,
    remote: false,
    applications: 8,
    views: 45,
    created_at: '2024-01-20',
    posted_by: '1',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    user: {
      name: 'Мария Петрова',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 2,
    title: 'Ремонт на баня',
    description: 'Нужен е майстор за ремонт на баня. Замяна на плочки, ремонт на душ кабина и монтаж на ново санитари.',
    category: 'Ремонт',
    price: 1500,
    price_type: 'fixed',
    location: 'Пловдив, Център',
    deadline: '2024-02-10',
    urgent: true,
    remote: false,
    applications: 12,
    views: 67,
    created_at: '2024-01-19',
    posted_by: '2',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    user: {
      name: 'Иван Димитров',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 3,
    title: 'Разходка с кучето',
    description: 'Търся някой да разходи кучето ми два пъти дневно. Кучето е спокойно и послушно, нужни са 30 мин разходка.',
    category: 'Доставка',
    price: 20,
    price_type: 'hourly',
    location: 'Варна, Морска градина',
    deadline: '2024-01-25',
    urgent: false,
    remote: false,
    applications: 5,
    views: 23,
    created_at: '2024-01-18',
    posted_by: '3',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    user: {
      name: 'Елена Стоянова',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 4,
    title: 'Уроци по математика',
    description: 'Нужен е учител по математика за ученик в 8 клас. Уроците да са 2 пъти седмично по 90 минути.',
    category: 'Обучение',
    price: 30,
    price_type: 'hourly',
    location: 'София, Младост',
    deadline: '2024-02-20',
    urgent: false,
    remote: true,
    applications: 15,
    views: 89,
    created_at: '2024-01-17',
    posted_by: '4',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    user: {
      name: 'Стефан Георгиев',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 5,
    title: 'Градинарски услуги',
    description: 'Нужен е градинар за подреждане на градината. Плевене, подрязване на живи плетове и посаждане на цветя.',
    category: 'Градинарство',
    price: 35,
    price_type: 'hourly',
    location: 'София, Драгалевци',
    deadline: '2024-01-30',
    urgent: false,
    remote: false,
    applications: 7,
    views: 34,
    created_at: '2024-01-16',
    posted_by: '5',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    user: {
      name: 'Петър Иванов',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 6,
    title: 'Сглобяване на мебели',
    description: 'Нужен е майстор за сглобяване на кухненски шкафове и маса. Мебелите са от IKEA.',
    category: 'Ремонт',
    price: 200,
    price_type: 'fixed',
    location: 'София, Лозенец',
    deadline: '2024-02-05',
    urgent: false,
    remote: false,
    applications: 3,
    views: 18,
    created_at: '2024-01-15',
    posted_by: '6',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    user: {
      name: 'Анна Георгиева',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 7,
    title: 'Доставка на храни',
    description: 'Нужна е доставка на храни от магазин до дома. Списъкът ще бъде предоставен предварително.',
    category: 'Доставка',
    price: 15,
    price_type: 'fixed',
    location: 'София, Център',
    deadline: '2024-01-28',
    urgent: true,
    remote: false,
    applications: 4,
    views: 22,
    created_at: '2024-01-14',
    posted_by: '7',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
    user: {
      name: 'Николай Петров',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 8,
    title: 'Почистване след ремонт',
    description: 'Нужна е генерална почистка след ремонт на апартамент. Включва почистване на прах и отпадъци.',
    category: 'Почистване',
    price: 300,
    price_type: 'fixed',
    location: 'София, Изток',
    deadline: '2024-02-01',
    urgent: false,
    remote: false,
    applications: 6,
    views: 31,
    created_at: '2024-01-13',
    posted_by: '8',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    user: {
      name: 'Георги Стоянов',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 9,
    title: 'Уроци по английски',
    description: 'Търся учител по английски за начинаещи. Уроците да са онлайн, 2 пъти седмично по 60 минути.',
    category: 'Обучение',
    price: 25,
    price_type: 'hourly',
    location: 'Онлайн',
    deadline: '2024-02-12',
    urgent: false,
    remote: true,
    applications: 9,
    views: 56,
    created_at: '2024-01-12',
    posted_by: '9',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    user: {
      name: 'Мария Иванова',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 10,
    title: 'Поддръжка на градина',
    description: 'Нужна е редовна поддръжка на градината - плевене, поливане, подрязване на растения.',
    category: 'Градинарство',
    price: 40,
    price_type: 'hourly',
    location: 'София, Бояна',
    deadline: '2024-01-29',
    urgent: false,
    remote: false,
    applications: 5,
    views: 28,
    created_at: '2024-01-11',
    posted_by: '10',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    user: {
      name: 'Иван Петров',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 11,
    title: 'Ремонт на електрически уреди',
    description: 'Нужен е електротехник за ремонт на пералня и хладилник. Проблемът е с електрическата част.',
    category: 'Ремонт',
    price: 120,
    price_type: 'fixed',
    location: 'София, Младост',
    deadline: '2024-01-27',
    urgent: true,
    remote: false,
    applications: 7,
    views: 35,
    created_at: '2024-01-10',
    posted_by: '11',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    user: {
      name: 'Петър Георгиев',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 12,
    title: 'Почистване на офис',
    description: 'Нужна е почистка на офис пространство 200 кв/м. Включва почистване на работни места и общи зони.',
    category: 'Почистване',
    price: 400,
    price_type: 'fixed',
    location: 'София, Център',
    deadline: '2024-01-26',
    urgent: false,
    remote: false,
    applications: 8,
    views: 42,
    created_at: '2024-01-09',
    posted_by: '12',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    user: {
      name: 'Анна Петрова',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 13,
    title: 'Доставка на мебели',
    description: 'Нужна е доставка на диван и маса от магазин до дома. Разстояние около 5 км.',
    category: 'Доставка',
    price: 80,
    price_type: 'fixed',
    location: 'София, Лозенец',
    deadline: '2024-01-25',
    urgent: false,
    remote: false,
    applications: 4,
    views: 19,
    created_at: '2024-01-08',
    posted_by: '13',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    user: {
      name: 'Николай Иванов',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 14,
    title: 'Уроци по музика',
    description: 'Търся учител по пиано за дете 8 години. Уроците да са в дома ни, веднъж седмично по 45 минути.',
    category: 'Обучение',
    price: 35,
    price_type: 'hourly',
    location: 'София, Драгалевци',
    deadline: '2024-02-08',
    urgent: false,
    remote: false,
    applications: 6,
    views: 33,
    created_at: '2024-01-07',
    posted_by: '14',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    user: {
      name: 'Елена Петрова',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: 15,
    title: 'Посаждане на дървета',
    description: 'Нужен е градинар за посаждане на 10 плодни дървета. Включва копаене на ями и посаждане.',
    category: 'Градинарство',
    price: 250,
    price_type: 'fixed',
    location: 'София, Бояна',
    deadline: '2024-01-24',
    urgent: false,
    remote: false,
    applications: 3,
    views: 16,
    created_at: '2024-01-06',
    posted_by: '15',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop',
    user: {
      name: 'Георги Иванов',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  }
]

export default function TasksPage() {
  const router = useRouter()
  const { tasks, loading, fetchTasks } = useTasksAPI()
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedSort, setSelectedSort] = useState('Най-нови')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  // Функция за получаване на икона според категорията
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Почистване':
        return Home
      case 'Ремонт':
        return Wrench
      case 'Доставка':
        return Car
      case 'Градинарство':
        return Leaf
      case 'Обучение':
        return BookOpen
      default:
        return Briefcase
    }
  }

  useEffect(() => {
    // Зареждане на любими задачи от localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  // Обновяване на филтрираните задачи когато се променят задачите или филтрите
  useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  // Скролиране към конкретна обява, ако е подаден jobId в URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const jobId = urlParams.get('jobId')
      const category = urlParams.get('category')
      
      if (jobId) {
        // Задаваме категорията, ако е подадена
        if (category) {
          setSelectedCategory(category)
        }
        
        // Скролираме към обявата след кратко забавяне
        setTimeout(() => {
          const taskElement = document.getElementById(`task-${jobId}`)
          if (taskElement) {
            taskElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
            // Добавяме визуален ефект
            taskElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
            setTimeout(() => {
              taskElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
            }, 3000)
          }
        }, 1000) // Увеличаваме забавянето
      }
    }
  }, [tasks]) // Променяме зависимостта от filteredTasks на tasks

  useEffect(() => {
    filterTasks()
  }, [searchQuery, selectedCategory, selectedLocation, selectedPriceRange, selectedSort, tasks])

  const filterTasks = () => {
    let filtered = [...tasks]

    // Филтър по търсене
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Филтър по категория
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory)
    }

    // Филтър по локация
    if (selectedLocation && selectedLocation !== 'Всички локации') {
      filtered = filtered.filter(task => task.location.includes(selectedLocation))
    }

    // Филтър по цена
    if (selectedPriceRange && selectedPriceRange !== 'Всяка цена') {
      switch (selectedPriceRange) {
        case 'До 50 лв':
          filtered = filtered.filter(task => task.price <= 50)
          break
        case '50-100 лв':
          filtered = filtered.filter(task => task.price >= 50 && task.price <= 100)
          break
        case '100-200 лв':
          filtered = filtered.filter(task => task.price >= 100 && task.price <= 200)
          break
        case '200-500 лв':
          filtered = filtered.filter(task => task.price >= 200 && task.price <= 500)
          break
        case 'Над 500 лв':
          filtered = filtered.filter(task => task.price > 500)
          break
      }
    }

    // Сортиране
    switch (selectedSort) {
      case 'Най-нови':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'Най-висока цена':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Най-ниска цена':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Най-популярни':
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredTasks(filtered)
  }

  const handleFavoriteToggle = (taskId: number) => {
    const newFavorites = favorites.includes(taskId)
      ? favorites.filter(id => id !== taskId)
      : [...favorites, taskId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    
    if (favorites.includes(taskId)) {
      toast.success('Премахнато от любими')
    } else {
      toast.success('Добавено в любими')
    }
  }



  const formatPrice = (price: number, priceType: string) => {
    return priceType === 'hourly' ? `${price} лв/час` : `${price} лв`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Изтекъл срок'
    if (diffDays === 0) return 'Днес'
    if (diffDays === 1) return 'Утре'
    if (diffDays <= 7) return `След ${diffDays} дни`
    return date.toLocaleDateString('bg-BG')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Разгледайте активните обяви за работа
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Намерете задачата, която отговаря на вашите умения и започнете да печелите
            </p>
            
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.slice(1).map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    <IconComponent size={20} />
                    {category.name}
                  </button>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{tasks.length}+</div>
                <div className="text-blue-200">Активни обяви</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-blue-200">Категории</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-blue-200">Среден рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">Разгледай задачи</h1>
            <p className="text-gray-600 mt-1">Намерете перфектната задача за вас</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Търси задачи..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Филтри
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Зареждане на задачи...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Няма намерени задачи</h3>
                  <p className="text-gray-600">Опитайте да промените филтрите или търсенето</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} id={`task-${task.id}`} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden">
                      <div className="h-48 relative">
                        <img 
                          src={task.image} 
                          alt={task.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {task.category}
                          </span>
                        </div>
                        {task.urgent && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Спешно
                            </span>
                          </div>
                        )}
                        {task.remote && (
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Дистанционно
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3">{task.description}</p>
                          
                          <div className="space-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              {React.createElement(getCategoryIcon(task.category), { className: "h-4 w-4 text-blue-500" })}
                              <span className="font-medium">{task.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{task.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(task.deadline)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {formatPrice(task.price, task.price_type)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.applications} оферти
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <img 
                              src={task.user.avatar} 
                              alt={task.user.name} 
                              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{task.user.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFavoriteToggle(task.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                favorites.includes(task.id)
                                  ? 'text-red-500 bg-red-50'
                                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${favorites.includes(task.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              onClick={() => router.push(`/submit-offer/${task.id}`)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                              Подай оферта
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex">
                      {/* Image Section */}
                      <div className="w-48 h-48 flex-shrink-0 relative">
                        <img 
                          src={task.image} 
                          alt={task.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {task.category}
                          </span>
                        </div>
                        {task.urgent && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Спешно
                            </span>
                          </div>
                        )}
                        {task.remote && (
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Дистанционно
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{task.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-2">
                                {React.createElement(getCategoryIcon(task.category), { className: "h-4 w-4 text-blue-500" })}
                                <span className="font-medium">{task.category}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{task.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{formatDate(task.deadline)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {formatPrice(task.price, task.price_type)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.applications} оферти
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <img 
                                src={task.user.avatar} 
                                alt={task.user.name} 
                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                              />
                              <span className="font-medium">{task.user.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{task.user.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span>{task.views} прегледа</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleFavoriteToggle(task.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                favorites.includes(task.id)
                                  ? 'text-red-500 bg-red-50'
                                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${favorites.includes(task.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              onClick={() => router.push(`/submit-offer/${task.id}`)}
                              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Подай оферта
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <GoogleMap 
                tasks={filteredTasks}
                selectedLocation={selectedLocation}
                onTaskClick={(taskId) => {
                  // Скролиране към задачата в списъка
                  const taskElement = document.getElementById(`task-${taskId}`)
                  if (taskElement) {
                    taskElement.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
