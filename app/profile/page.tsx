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
  X,
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
  Eye,
  Search,
  Megaphone,
  Crown,
  Palette
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useTasksAPI } from '@/hooks/useTasksAPI'
import RatingDisplay from '@/components/RatingDisplay'
import { useRatings } from '@/hooks/useRatings'
import LocationSelector from '@/components/LocationSelector'

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

import ErrorBoundary from '@/components/ErrorBoundary'

function ProfilePageContent() {
  const router = useRouter()
  const { user: authUser, loading: authLoading, signOut } = useAuth()
  const { getUserTasks } = useTasksAPI()
  const { userRatings, loadUserRatings, isLoading: ratingsLoading } = useRatings()
  const [user, setUser] = useState<UserData | null>(null)
  const [userTasks, setUserTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'taskGiver' | 'taskExecutor' | 'settings' | 'dashboard' | 'messages'>('dashboard')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [locationCity, setLocationCity] = useState('')
  const [locationNeighborhood, setLocationNeighborhood] = useState('')
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const userRatingSummary = authUser ? userRatings[authUser.id] : undefined

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    loadUserData()
  }, [authUser, authLoading, loadUserRatings])

  const loadUserData = async () => {
    try {
      // Използваме данните от Supabase Auth
      if (authUser) {
        // Зареждаме задачите на потребителя от Supabase
        console.log('Profile: authUser.id =', authUser.id)
        const tasks = await getUserTasks(authUser.id)
        console.log('Profile: loaded tasks =', tasks)
        setUserTasks(tasks)
        await loadUserRatings(authUser.id)
        
        // Load location from user metadata
        const userCity = authUser.user_metadata?.city || ''
        const userNeighborhood = authUser.user_metadata?.neighborhood || ''
        setLocationCity(userCity)
        setLocationNeighborhood(userNeighborhood)
        
        const userData: UserData = {
          id: 1, // Временно ID
          firstName: authUser.user_metadata?.full_name?.split(' ')[0] || 'Потребител',
          lastName: authUser.user_metadata?.full_name?.split(' ')[1] || '',
          email: authUser.email || '',
          phone: authUser.user_metadata?.phone || '',
          roles: {
            taskGiver: true,
            taskExecutor: true
          },
          taskGiver: {
            totalTasksPosted: tasks.length,
            completedTasks: tasks.filter((task: any) => task.status === 'completed').length,
            totalSpent: tasks.reduce((sum: number, task: any) => sum + (task.price || 0), 0),
            rating: 0,
            reviews: []
          },
          taskExecutor: {
            completedTasks: 0,
            totalEarnings: 0,
            rating: 0,
            totalReviews: 0,
            skills: ['Почистване', 'Ремонт', 'Градинарство'],
            portfolio: [],
            responseRate: 95,
            avgResponseTime: '2 часа',
            isVerified: true,
            badges: ['Бърз отговор', 'Висок рейтинг']
          },
          profile: {
            bio: '',
            location: userCity + (userNeighborhood ? `, ${userNeighborhood}` : ''),
            avatar: '',
            joinDate: new Date(authUser.created_at).toLocaleDateString('bg-BG')
          }
        }
        setUser(userData)
        setLoading(false)
      }
    } catch (error) {
      toast.error('Грешка при зареждането на профила')
      router.push('/login')
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    toast.success('Успешно излязохте от акаунта')
  }

  const handleSaveLocation = async () => {
    if (!authUser) return
    
    setIsSavingLocation(true)
    try {
      const response = await fetch(`/api/users/${authUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: locationCity || null,
          neighborhood: locationNeighborhood || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save location')
      }

      toast.success('Местоположението е запазено успешно!')
      
      // Update local user data
      if (user) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            location: locationCity + (locationNeighborhood ? `, ${locationNeighborhood}` : '')
          }
        })
      }
    } catch (error) {
      console.error('Error saving location:', error)
      toast.error('Грешка при запазване на местоположението')
    } finally {
      setIsSavingLocation(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази задача?')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      toast.success('Задачата е изтрита успешно')
      
      // Reload user data
      await loadUserData()
    } catch (error: any) {
      console.error('Error deleting task:', error)
      toast.error('Грешка при изтриване на задачата')
    }
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
                        <span className="font-semibold">{user.taskGiver.totalSpent} €</span>
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
                        <span className="font-semibold">{user.taskExecutor.totalEarnings} €</span>
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
                    onClick={() => setActiveTab('dashboard')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'dashboard'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Табло
                  </button>
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
                  <button
                    onClick={() => router.push('/messages')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'messages'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      Съобщения
                    </div>
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
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Моето табло</h3>
                      <p className="text-gray-600">
                        Преглед на всички ваши активности, задачи и статистики.
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-blue-700">Публикувани задачи</p>
                            <p className="text-2xl font-bold text-blue-900">{user.taskGiver.totalTasksPosted}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="text-sm text-green-700">Завършени задачи</p>
                            <p className="text-2xl font-bold text-green-900">{user.taskExecutor.completedTasks}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Star className="h-8 w-8 text-yellow-600" />
                          <div>
                            <p className="text-sm text-yellow-700">Рейтинг</p>
                            <p className="text-2xl font-bold text-yellow-900">{user.taskExecutor.rating}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-8 w-8 text-purple-600" />
                          <div>
                            <p className="text-sm text-purple-700">Общо изкарани</p>
                            <p className="text-2xl font-bold text-purple-900">{user.taskExecutor.totalEarnings} €</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Tasks */}
                    <div className="bg-white border rounded-lg">
                      <div className="p-4 border-b">
                        <h4 className="text-lg font-medium text-gray-900">Последни задачи</h4>
                      </div>
                      <div className="p-4">
                        {(() => {
                          const recentTasks = userTasks.slice(0, 5)
                          
                          if (recentTasks.length === 0) {
                            return (
                              <div className="text-center py-8 text-gray-500">
                                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Все още нямате публикувани задачи</p>
                                <button
                                  onClick={() => router.push('/post-task')}
                                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Публикувай първата задача
                                </button>
                              </div>
                            )
                          }

                          return (
                            <div className="space-y-3">
                              {recentTasks.map((task: any) => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                     onClick={() => router.push(`/task/${task.id}`)}>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{task.title}</h5>
                                    <p className="text-sm text-gray-600">{task.category} • {task.location}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">{task.price} €</p>
                                    <p className="text-sm text-gray-500">{task.status}</p>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => router.push('/my-tasks')}
                                className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Виж всички задачи →
                              </button>
                            </div>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => router.push('/post-task')}
                        className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        <Plus className="h-6 w-6 mb-2" />
                        <h4 className="font-medium">Публикувай нова задача</h4>
                        <p className="text-sm text-blue-100">Намери квалифициран изпълнител</p>
                      </button>
                      <button
                        onClick={() => router.push('/tasks')}
                        className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
                      >
                        <Search className="h-6 w-6 mb-2" />
                        <h4 className="font-medium">Търси задачи</h4>
                        <p className="text-sm text-green-100">Намери работа за себе си</p>
                      </button>
                      <button
                        onClick={() => router.push('/profile/professional')}
                        className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors text-left"
                      >
                        <Crown className="h-6 w-6 mb-2" />
                        <h4 className="font-medium">Професионален профил</h4>
                        <p className="text-sm text-yellow-100">Създай своя мини-сайт</p>
                      </button>
                      <button
                        onClick={() => router.push('/profile/orders')}
                        className="p-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-left"
                      >
                        <Palette className="h-6 w-6 mb-2" />
                        <h4 className="font-medium">Мои поръчки</h4>
                        <p className="text-sm text-amber-100">Поръчки за картини и портрети</p>
                      </button>
                      <button
                        onClick={() => router.push('/promote-profile')}
                        className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left"
                      >
                        <Megaphone className="h-6 w-6 mb-2" />
                        <h4 className="font-medium">Рекламирай профила</h4>
                        <p className="text-sm text-purple-100">Достигни до повече клиенти</p>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Добре дошли, {user.firstName}!</h3>
                      <p className="text-gray-600">
                        Това е вашият личен профил в Rabotim.com. Тук можете да управлявате всички ваши активности.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Моят рейтинг</h4>
                      {ratingsLoading && !userRatingSummary ? (
                        <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                      ) : userRatingSummary ? (
                        <RatingDisplay userRating={userRatingSummary} showDetails={false} />
                      ) : (
                        <p className="text-sm text-gray-600">
                          Все още нямате отзиви. Завършвайте задачи и събирайте позитивни оценки, за да се отличите.
                        </p>
                      )}
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
                          <div className="text-2xl font-bold text-blue-900">{user.taskGiver.totalSpent} €</div>
                          <div className="text-sm text-blue-700">Общо похарчени</div>
                        </div>
                      </div>
                    </div>

                    {userTasks.length === 0 ? (
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
                    ) : (
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">Последни задачи</h4>
                        <div className="space-y-3">
                          {userTasks.slice(0, 5).map((task: any) => (
                            <div key={task.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 cursor-pointer" onClick={() => router.push(`/task/${task.id}`)}>
                                  <h5 className="font-medium text-gray-900">{task.title}</h5>
                                  <p className="text-sm text-gray-600">{task.category} • {task.location}</p>
                                  <p className="text-xs text-gray-500 mt-1">Статус: {task.status}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">{task.price} €</p>
                                    <p className="text-sm text-gray-500">{task.price_type === 'hourly' ? 'на час' : 'общо'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/task/${task.id}/edit`)
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Редактирай"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteTask(task.id)
                                      }}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Изтрий"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {userTasks.length > 5 && (
                            <button
                              onClick={() => router.push('/my-tasks')}
                              className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-center"
                            >
                              Виж всички {userTasks.length} задачи →
                            </button>
                          )}
                        </div>
                      </div>
                    )}
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
                          <div className="text-2xl font-bold text-green-900">{user.taskExecutor.totalEarnings} €</div>
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

                    {/* Местоположение */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">Местоположение</h4>
                          <p className="text-sm text-gray-500">Задайте локация за локални обяви с предимство</p>
                        </div>
                        {user.profile.location && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-sm rounded-md">
                            <MapPin size={14} />
                            {user.profile.location}
                          </span>
                        )}
                      </div>
                      
                      <LocationSelector
                        city={locationCity}
                        neighborhood={locationNeighborhood}
                        onCityChange={setLocationCity}
                        onNeighborhoodChange={setLocationNeighborhood}
                        showLabel={false}
                      />
                      
                      <div className="mt-4">
                        <button
                          onClick={handleSaveLocation}
                          disabled={isSavingLocation}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSavingLocation ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Запазване...
                            </span>
                          ) : (
                            'Запази местоположение'
                          )}
                        </button>
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

export default function ProfilePage() {
  return (
    <ErrorBoundary>
      <ProfilePageContent />
    </ErrorBoundary>
  )
} 