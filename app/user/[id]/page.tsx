'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  User, 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  Shield, 
  CheckCircle, 
  MessageCircle, 
  Heart, 
  Eye,
  TrendingUp,
  Clock,
  DollarSign,
  Briefcase,
  Wrench
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface UserProfile {
  id: number
  name: string
  email: string
  rating: number
  avatar: string
  verified: boolean
  joinDate: string
  completedTasks: number
  totalEarnings: number
  responseRate: number
  avgResponseTime: string
  skills: string[]
  badges: string[]
  bio?: string
  location?: string
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
  status: 'active' | 'assigned' | 'completed'
  createdAt: string
  views: number
  applications: number
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { user: authUser } = useAuth()
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userTasks, setUserTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reviews'>('overview')

  useEffect(() => {
    loadUserProfile()
    loadUserTasks()
  }, [userId])

  const loadUserProfile = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find((user: any) => user.id.toString() === userId)
      
      if (foundUser) {
        setUserProfile({
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          rating: foundUser.rating || 4.5,
          avatar: foundUser.avatar || '/default-avatar.png',
          verified: foundUser.verified || false,
          joinDate: foundUser.joinDate || '2023-01-01',
          completedTasks: foundUser.completedTasks || 0,
          totalEarnings: foundUser.totalEarnings || 0,
          responseRate: foundUser.responseRate || 95,
          avgResponseTime: foundUser.avgResponseTime || '2 часа',
          skills: foundUser.skills || ['Почистване', 'Ремонт', 'Градинарство'],
          badges: foundUser.badges || ['Бърз отговор', 'Висок рейтинг'],
          bio: foundUser.bio || 'Опитен изпълнител с добра репутация',
          location: foundUser.location || 'София'
        })
      } else {
        toast.error('Потребителят не е намерен')
        router.push('/tasks')
      }
    } catch (error) {
      toast.error('Грешка при зареждането на профила')
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserTasks = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const userTasks = tasks.filter((task: any) => task.postedByEmail === userProfile?.email)
      setUserTasks(userTasks)
    } catch (error) {
      console.error('Error loading user tasks:', error)
    }
  }

  const handleContact = () => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си за да се свържете')
      router.push('/login')
      return
    }
    
    // Navigate to messages or create conversation
    router.push('/messages')
    toast.success('Ще бъдете пренасочени към съобщенията')
  }

  const handleFavorite = () => {
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    // Add to favorites logic
    toast.success('Потребителят е добавен в любими')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане на профила...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Потребителят не е намерен</p>
          <button
            onClick={() => router.push('/tasks')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Профил на потребител
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              {/* Profile Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png'
                    }}
                  />
                  {userProfile.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                      <Shield size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile.name}</h2>
                {userProfile.location && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                    <MapPin size={14} />
                    {userProfile.location}
                  </p>
                )}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{userProfile.rating}</span>
                  <span className="text-sm text-gray-500">({userProfile.completedTasks} задачи)</span>
                </div>
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{userProfile.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Завършени задачи</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{userProfile.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Общо изкарани</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{userProfile.totalEarnings} лв</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Скорост на отговор</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{userProfile.responseRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Средно време за отговор</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{userProfile.avgResponseTime}</span>
                </div>
              </div>

              {/* Skills */}
              {userProfile.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Умения</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              {userProfile.badges.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Значки</h3>
                  <div className="space-y-2">
                    {userProfile.badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award size={14} className="text-yellow-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContact}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Свържи се
                </button>
                <button
                  onClick={handleFavorite}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={16} />
                  Добави в любими
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
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
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tasks'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Задачи ({userTasks.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reviews'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Отзиви
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        За {userProfile.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {userProfile.bio || 'Опитен изпълнител с добра репутация в общността.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Завършени задачи</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{userProfile.completedTasks}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="text-sm text-green-700 dark:text-green-300">Общо изкарани</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{userProfile.totalEarnings} лв</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    {userTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Няма публикувани задачи</p>
                      </div>
                    ) : (
                      userTasks.map((task) => (
                        <div
                          key={task.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => router.push(`/task/${task.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{task.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {task.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye size={12} />
                                  {task.views} гледания
                                </span>
                                <span className="flex items-center gap-1">
                                  <User size={12} />
                                  {task.applications} кандидатури
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{task.price} лв</p>
                              <p className="text-sm text-gray-500">{task.priceType === 'hourly' ? 'на час' : 'общо'}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                task.status === 'active' ? 'bg-green-100 text-green-800' :
                                task.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status === 'active' ? 'Активна' :
                                 task.status === 'assigned' ? 'Назначена' : 'Завършена'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Отзивите ще бъдат достъпни скоро</p>
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
