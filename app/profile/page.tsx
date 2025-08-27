'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Star, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Camera,
  CheckCircle,
  Shield,
  Clock,
  DollarSign,
  MessageCircle,
  Heart,
  Share2,
  Settings,
  Plus,
  Briefcase,
  Wrench,
  TrendingUp,
  FileText,
  Users,
  ThumbsUp,
  Bell,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  roles: {
    taskGiver: boolean
    taskExecutor: boolean
  }
  taskGiver: {
    totalTasksPosted: number
    completedTasks: number
    totalSpent: number
    rating: number
    reviews: any[]
  }
  taskExecutor: {
    completedTasks: number
    totalEarnings: number
    rating: number
    totalReviews: number
    skills: string[]
    portfolio: any[]
    responseRate: number
    avgResponseTime: string
    isVerified: boolean
    badges: any[]
  }
  profile: {
    bio: string
    location: string
    avatar: string
    joinDate: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'taskGiver' | 'taskExecutor' | 'settings'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    try {
      const loginStatus = localStorage.getItem('isLoggedIn')
      const userData = localStorage.getItem('user')
      
      if (loginStatus !== 'true' || !userData) {
        toast.error('Трябва да сте влезли в акаунта си')
        router.push('/login')
        return
      }

      const user = JSON.parse(userData)
      setUser(user)
      setLoading(false)
    } catch (error) {
      toast.error('Грешка при зареждането на профила')
      router.push('/login')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    router.push('/')
    toast.success('Успешно излязохте от акаунта')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Назад
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Моят профил</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                Изход
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                    <Camera size={16} className="text-gray-600" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && (
                  <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                    <Phone size={14} />
                    {user.phone}
                  </p>
                )}
              </div>

              {/* Roles */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Роли</h3>
                <div className="space-y-2">
                  {user.roles.taskGiver && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <Briefcase size={16} className="text-blue-600" />
                      <span className="text-sm text-blue-900">Даващ задачи</span>
                    </div>
                  )}
                  {user.roles.taskExecutor && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Wrench size={16} className="text-green-600" />
                      <span className="text-sm text-green-900">Изпълнител</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                {user.roles.taskGiver && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Като даващ задачи</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Публикувани задачи:</span>
                        <span className="font-semibold">{user.taskGiver.totalTasksPosted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Завършени задачи:</span>
                        <span className="font-semibold">{user.taskGiver.completedTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Общо похарчени:</span>
                        <span className="font-semibold">{user.taskGiver.totalSpent} лв</span>
                      </div>
                    </div>
                  </div>
                )}

                {user.roles.taskExecutor && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Като изпълнител</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Завършени задачи:</span>
                        <span className="font-semibold">{user.taskExecutor.completedTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Общо изкарани:</span>
                        <span className="font-semibold">{user.taskExecutor.totalEarnings} лв</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Рейтинг:</span>
                        <span className="font-semibold flex items-center gap-1">
                          {user.taskExecutor.rating} <Star size={12} className="text-yellow-500 fill-current" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Общ преглед
                  </button>
                  {user.roles.taskGiver && (
                    <button
                      onClick={() => setActiveTab('taskGiver')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'taskGiver'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Моите задачи
                    </button>
                  )}
                  {user.roles.taskExecutor && (
                    <button
                      onClick={() => setActiveTab('taskExecutor')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'taskExecutor'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Моите услуги
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'settings'
                        ? 'border-gray-500 text-gray-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Настройки
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Добре дошли, {user.firstName}!</h3>
                      <p className="text-gray-600">
                        Това е вашият личен профил в Rabotim.com. Тук можете да управлявате всички ваши активности.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.roles.taskGiver && (
                        <div className="bg-blue-50 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                            <h4 className="text-lg font-medium text-blue-900">Даващ задачи</h4>
                          </div>
                          <p className="text-blue-700 mb-4">Публикувайте нови задачи и намерете квалифицирани изпълнители.</p>
                          <button
                            onClick={() => router.push('/post-task')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Публикувай задача
                          </button>
                        </div>
                      )}

                      {user.roles.taskExecutor && (
                        <div className="bg-green-50 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Wrench className="h-6 w-6 text-green-600" />
                            <h4 className="text-lg font-medium text-green-900">Изпълнител</h4>
                          </div>
                          <p className="text-green-700 mb-4">Намерете нови задачи и изкарайте пари с вашите умения.</p>
                          <button
                            onClick={() => router.push('/tasks')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Търси задачи
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Бързи действия</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                          onClick={() => router.push('/favorites')}
                          className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                          <Heart className="h-6 w-6 text-red-500 mb-2" />
                          <span className="text-sm text-gray-700">Любими</span>
                        </button>
                        <button
                          onClick={() => router.push('/messages')}
                          className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                          <MessageCircle className="h-6 w-6 text-blue-500 mb-2" />
                          <span className="text-sm text-gray-700">Съобщения</span>
                        </button>
                        <button
                          onClick={() => router.push('/notifications')}
                          className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                          <Bell className="h-6 w-6 text-yellow-500 mb-2" />
                          <span className="text-sm text-gray-700">Известия</span>
                        </button>
                        <button
                          onClick={() => router.push('/ratings')}
                          className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                          <Star className="h-6 w-6 text-yellow-500 mb-2" />
                          <span className="text-sm text-gray-700">Отзиви</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'taskGiver' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Моите задачи</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push('/my-tasks')}
                          className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Преглед на всички
                        </button>
                        <button
                          onClick={() => router.push('/post-task')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Публикувай задача
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-900">{user.taskGiver.totalTasksPosted}</div>
                          <div className="text-sm text-blue-700">Публикувани задачи</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-900">{user.taskGiver.completedTasks}</div>
                          <div className="text-sm text-blue-700">Завършени задачи</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-900">{user.taskGiver.totalSpent} лв</div>
                          <div className="text-sm text-blue-700">Общо похарчени</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Все още нямате публикувани задачи</p>
                      <button
                        onClick={() => router.push('/post-task')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Публикувай първата си задача
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'taskExecutor' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Моите услуги</h3>
                      <button
                        onClick={() => router.push('/tasks')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <TrendingUp size={16} />
                        Търси задачи
                      </button>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-900">{user.taskExecutor.completedTasks}</div>
                          <div className="text-sm text-green-700">Завършени задачи</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-900">{user.taskExecutor.totalEarnings} лв</div>
                          <div className="text-sm text-green-700">Общо изкарани</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-900 flex items-center justify-center gap-1">
                            {user.taskExecutor.rating} <Star size={16} className="text-yellow-500 fill-current" />
                          </div>
                          <div className="text-sm text-green-700">Рейтинг</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-900">{user.taskExecutor.responseRate}%</div>
                          <div className="text-sm text-green-700">Процент отговори</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Все още нямате завършени задачи</p>
                      <button
                        onClick={() => router.push('/tasks')}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Започни да търсиш задачи
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Настройки на профила</h3>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Лична информация</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Име</label>
                          <input
                            type="text"
                            value={user.firstName}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                          <input
                            type="text"
                            value={user.lastName}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                          <input
                            type="tel"
                            value={user.phone || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Роли</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={user.roles.taskGiver}
                            disabled
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Даващ задачи</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={user.roles.taskExecutor}
                            disabled
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Изпълнител</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 