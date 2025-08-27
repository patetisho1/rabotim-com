'use client'

import React, { useState, useEffect } from 'react'
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

interface Task {
  id: number
  title: string
  description: string
  category: string
  price: number
  priceType: 'fixed' | 'hourly'
  location: string
  deadline: string
  urgent: boolean
  remote: boolean
  offers: number
  views: number
  createdAt: string
  userId: number
  status: 'active' | 'assigned' | 'completed'
  user: {
    name: string
    rating: number
    avatar: string
  }
}

const categories = [
  { name: 'Всички категории', icon: Briefcase, value: '' },
  { name: 'Домакински услуги', icon: Home, value: 'home' },
  { name: 'Ремонт', icon: Wrench, value: 'repair' },
  { name: 'Транспорт', icon: Car, value: 'transport' },
  { name: 'Дизайн', icon: Palette, value: 'design' },
  { name: 'Обучение', icon: BookOpen, value: 'education' },
  { name: 'IT услуги', icon: Smartphone, value: 'it' },
  { name: 'Градинарство', icon: Leaf, value: 'gardening' }
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

// Mock данни за задачи
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Трябва ми майстор за ремонт на баня',
    description: 'Имам нужда от квалифициран майстор за пълен ремонт на баня. Площ 6 кв.м.',
    category: 'Ремонт',
    price: 2500,
    priceType: 'fixed',
    location: 'София, Лозенец',
    deadline: '2024-02-15',
    urgent: true,
    remote: false,
    offers: 8,
    views: 45,
    createdAt: '2024-01-20',
    userId: 1,
    status: 'active',
    user: {
      name: 'Иван Петров',
      rating: 4.8,
      avatar: ''
    }
  },
  {
    id: 2,
    title: 'Дизайн на уеб сайт за ресторант',
    description: 'Търся дизайнер за създаване на модерен уеб сайт за италиански ресторант.',
    category: 'Дизайн',
    price: 150,
    priceType: 'hourly',
    location: 'Пловдив',
    deadline: '2024-02-10',
    urgent: false,
    remote: true,
    offers: 12,
    views: 67,
    createdAt: '2024-01-19',
    userId: 2,
    status: 'active',
    user: {
      name: 'Мария Георгиева',
      rating: 4.9,
      avatar: ''
    }
  },
  {
    id: 3,
    title: 'Преместване на апартамент',
    description: 'Трябва ми помощ за преместване на 2-стаен апартамент от 3-ти на 1-ви етаж.',
    category: 'Транспорт',
    price: 300,
    priceType: 'fixed',
    location: 'Варна',
    deadline: '2024-01-25',
    urgent: true,
    remote: false,
    offers: 5,
    views: 23,
    createdAt: '2024-01-18',
    userId: 3,
    status: 'assigned',
    user: {
      name: 'Стефан Димитров',
      rating: 4.7,
      avatar: ''
    }
  },
  {
    id: 4,
    title: 'Уроци по математика за 8-ми клас',
    description: 'Търся преподавател по математика за подготовка на дъщеря ми за изпитите.',
    category: 'Обучение',
    price: 25,
    priceType: 'hourly',
    location: 'София, Младост',
    deadline: '2024-02-20',
    urgent: false,
    remote: true,
    offers: 15,
    views: 89,
    createdAt: '2024-01-17',
    userId: 4,
    status: 'active',
    user: {
      name: 'Елена Василева',
      rating: 5.0,
      avatar: ''
    }
  },
  {
    id: 5,
    title: 'Поддръжка на компютър',
    description: 'Компютърът ми работи бавно и има нужда от чистене и оптимизация.',
    category: 'IT услуги',
    price: 80,
    priceType: 'fixed',
    location: 'Бургас',
    deadline: '2024-01-30',
    urgent: false,
    remote: false,
    offers: 7,
    views: 34,
    createdAt: '2024-01-16',
    userId: 5,
    status: 'active',
    user: {
      name: 'Николай Тодоров',
      rating: 4.6,
      avatar: ''
    }
  },
  {
    id: 6,
    title: 'Подреждане на градина',
    description: 'Имам нужда от помощ за подреждане на градината - косане, подрязване на храсти.',
    category: 'Градинарство',
    price: 120,
    priceType: 'fixed',
    location: 'София, Драгалевци',
    deadline: '2024-02-05',
    urgent: false,
    remote: false,
    offers: 3,
    views: 18,
    createdAt: '2024-01-15',
    userId: 6,
    status: 'active',
    user: {
      name: 'Анна Стоянова',
      rating: 4.5,
      avatar: ''
    }
  }
]

export default function BrowseTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedSort, setSelectedSort] = useState('Най-нови')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    // Зареждане на любими задачи от localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

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
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.icon : Briefcase
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
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Няма намерени задачи</h3>
                  <p className="text-gray-600">Опитайте да промените филтрите или търсенето</p>
                </div>
              ) : (
                                 filteredTasks.map(task => (
                   <div key={task.id} id={`task-${task.id}`} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          {task.urgent && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Спешно
                            </span>
                          )}
                          {task.remote && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Дистанционно
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {React.createElement(getCategoryIcon(task.category), { className: "h-4 w-4" })}
                            {task.category}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {task.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(task.deadline)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {formatPrice(task.price, task.priceType)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.offers} оферти
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          {task.user.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          {task.user.rating}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          {task.views}
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
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Отвори
                        </button>
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
