'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Clock, DollarSign, User, Star, Calendar, Phone, Mail, MessageSquare, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageGallery from '../../components/ImageGallery'

interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  priceType: 'hourly' | 'fixed'
  urgent: boolean
  rating: number
  reviewCount: number
  postedBy: string
  postedDate: string
  views: number
  applications: number
  attachments?: Attachment[]
}

interface Application {
  taskId: string
  taskTitle: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')

  useEffect(() => {
    loadTask()
    checkLoginStatus()
  }, [taskId])

  const loadTask = () => {
    try {
      // Sample tasks with the new structure
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Почистване на апартамент',
          description: 'Търся надежден човек за почистване на 3-стаен апартамент. Работата включва почистване на всички стаи, баня и кухня. Имам домашни любимци.',
          category: 'cleaning',
          location: 'София, Лозенец',
          price: 25,
          priceType: 'hourly',
          urgent: true,
          rating: 4.8,
          reviewCount: 127,
          postedBy: 'Мария Петрова',
          postedDate: '2024-01-15T10:30:00Z',
          views: 45,
          applications: 8,
          attachments: [
            {
              name: 'apartment1.jpg',
              size: 1024000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
            },
            {
              name: 'apartment2.jpg',
              size: 980000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '2',
          title: 'Ремонт на баня',
          description: 'Нужен е опитен майстор за пълна реконструкция на баня. Включва замяна на плочки, санитария и инсталации.',
          category: 'repair',
          location: 'Пловдив, Център',
          price: 1500,
          priceType: 'fixed',
          urgent: false,
          rating: 4.9,
          reviewCount: 89,
          postedBy: 'Иван Димитров',
          postedDate: '2024-01-14T14:20:00Z',
          views: 32,
          applications: 5,
          attachments: [
            {
              name: 'bathroom1.jpg',
              size: 1200000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '3',
          title: 'Разходка с кучето ми',
          description: 'Търся човек за ежедневна разходка с моя лабрадор. Кучето е спокойно и послушно. Работата е за 1 час дневно.',
          category: 'dog-care',
          location: 'Варна, Морска градина',
          price: 20,
          priceType: 'hourly',
          urgent: false,
          rating: 4.7,
          reviewCount: 156,
          postedBy: 'Елена Стоянова',
          postedDate: '2024-01-13T09:15:00Z',
          views: 28,
          applications: 12,
          attachments: [
            {
              name: 'dog1.jpg',
              size: 850000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop'
            },
            {
              name: 'dog2.jpg',
              size: 920000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '4',
          title: 'Уроци по математика',
          description: 'Търся преподавател по математика за ученик в 8 клас. Нужна е помощ с алгебра и геометрия. Уроците ще са 2 пъти седмично.',
          category: 'tutoring',
          location: 'София, Младост',
          price: 30,
          priceType: 'hourly',
          urgent: false,
          rating: 4.6,
          reviewCount: 78,
          postedBy: 'Стефан Георгиев',
          postedDate: '2024-01-12T16:45:00Z',
          views: 35,
          applications: 6,
          attachments: [
            {
              name: 'math1.jpg',
              size: 750000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop'
            }
          ]
        },
        {
          id: '5',
          title: 'Грижа за възрастен човек',
          description: 'Търся отговорен човек за грижа за моя 85-годишен баща. Нужна е помощ с ежедневните дейности и придружаване.',
          category: 'care',
          location: 'Бургас, Център',
          price: 35,
          priceType: 'hourly',
          urgent: true,
          rating: 4.9,
          reviewCount: 203,
          postedBy: 'Анна Димитрова',
          postedDate: '2024-01-11T11:20:00Z',
          views: 52,
          applications: 15,
          attachments: [
            {
              name: 'care1.jpg',
              size: 680000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
            }
          ]
        }
      ]

      const foundTask = sampleTasks.find(t => t.id === taskId)
      
      if (foundTask) {
        setTask(foundTask)
        checkIfApplied(foundTask.id)
      } else {
        toast.error('Задачата не е намерена')
        router.push('/tasks')
      }
    } catch (error) {
      toast.error('Грешка при зареждането на задачата')
    } finally {
      setIsLoading(false)
    }
  }

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loginStatus === 'true')
  }

  const checkIfApplied = (taskId: string) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]')
    const hasAppliedToTask = applications.some((app: Application) => app.taskId === taskId)
    setHasApplied(hasAppliedToTask)
  }

  const handleApply = async () => {
    if (!isLoggedIn) {
      toast.error('Трябва да сте влезли в акаунта си за да кандидатствате')
      router.push('/login')
      return
    }

    if (!applicationMessage.trim()) {
      toast.error('Моля, напишете съобщение за кандидатурата')
      return
    }

    setIsApplying(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newApplication = {
        taskId: task?.id,
        taskTitle: task?.title,
        appliedAt: new Date().toISOString(),
        status: 'pending' as const
      }
      
      const applications = JSON.parse(localStorage.getItem('applications') || '[]')
      applications.push(newApplication)
      localStorage.setItem('applications', JSON.stringify(applications))
      
      setHasApplied(true)
      setApplicationMessage('')
      toast.success('Кандидатурата е изпратена успешно!')
    } catch (error) {
      toast.error('Грешка при изпращането на кандидатурата')
    } finally {
      setIsApplying(false)
    }
  }

  const handleContact = () => {
    if (!isLoggedIn) {
      toast.error('Трябва да сте влезли в акаунта си за да се свържете')
      router.push('/login')
      return
    }
    setShowContactInfo(true)
  }

  const getLocationLabel = (locationValue: string) => {
    const locations = [
      { value: 'sofia', label: 'София' },
      { value: 'plovdiv', label: 'Пловдив' },
      { value: 'varna', label: 'Варна' },
      { value: 'burgas', label: 'Бургас' },
      { value: 'ruse', label: 'Русе' },
      { value: 'stara-zagora', label: 'Стара Загора' },
      { value: 'pleven', label: 'Плевен' },
    ]
    const location = locations.find(loc => loc.value === locationValue)
    return location ? location.label : locationValue
  }

  const getCategoryLabel = (categoryValue: string) => {
    const categories = [
      { value: 'repair', label: 'Ремонт' },
      { value: 'cleaning', label: 'Почистване' },
      { value: 'care', label: 'Грижа' },
      { value: 'delivery', label: 'Доставка' },
      { value: 'moving', label: 'Преместване' },
      { value: 'garden', label: 'Градинарство' },
      { value: 'dog-care', label: 'Разходка/грижа за куче' },
      { value: 'tutoring', label: 'Обучение' },
      { value: 'packaging', label: 'Опаковане' },
      { value: 'other', label: 'Друго' },
    ]
    const category = categories.find(cat => cat.value === categoryValue)
    return category ? category.label : categoryValue
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'днес'
    if (diffDays === 2) return 'вчера'
    if (diffDays <= 7) return `преди ${diffDays - 1} дни`
    
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'hourly') {
      return `${price} лв/час`
    }
    return `${price} лв`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане на задачата...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Задачата не е намерена</p>
          <button
            onClick={() => router.push('/tasks')}
            className="btn btn-primary mt-4"
          >
            Връщане към задачите
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Детайли за задачата
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ImageGallery 
                  images={task.attachments.map(attachment => ({
                    id: attachment.name,
                    src: attachment.url,
                    alt: attachment.name,
                    thumbnail: attachment.url
                  }))} 
                />
              </div>
            )}

            {/* Task Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {task.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {task.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {task.postedDate ? formatDate(task.postedDate) : 'По договаряне'}
                    </span>
                    {task.urgent && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertCircle size={16} />
                        Спешно
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPrice(task.price, task.priceType)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {task.priceType === 'hourly' ? 'на час' : 'общо'}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getCategoryLabel(task.category)}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Описание
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                За потребителя
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {task.postedBy}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />
                      {task.rating} ({task.reviewCount} прегледи)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleContact}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Свържи се
                </button>
              </div>

              {/* Contact Info (Hidden by default) */}
              {showContactInfo && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Контактна информация
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">0888 123 456</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">user@example.com</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Кандидатствай за тази задача
              </h3>
              
              {hasApplied ? (
                <div className="text-center py-4">
                  <div className="text-green-600 mb-2">
                    ✓ Вече сте кандидатствали
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Вашата кандидатура е в изчакване
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Съобщение към потребителя
                    </label>
                    <textarea
                      value={applicationMessage}
                      onChange={(e) => setApplicationMessage(e.target.value)}
                      placeholder="Напишете кратко съобщение защо искате да изпълните тази задача..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      rows={4}
                    />
                  </div>
                  
                  <button
                    onClick={handleApply}
                    disabled={isApplying || !applicationMessage.trim()}
                    className="w-full btn btn-primary disabled:opacity-50"
                  >
                    {isApplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Изпращане...
                      </>
                    ) : (
                      'Кандидатствай'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Task Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Детайли
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Локация:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{task.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Категория:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{getCategoryLabel(task.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Публикувана:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {task.postedDate ? formatDate(task.postedDate) : 'По договаряне'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Прегледи:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{task.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Кандидатури:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{task.applications}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 