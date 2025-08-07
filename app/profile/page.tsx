'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Calendar, CheckCircle, Clock, AlertCircle, LogOut, Edit, Star, TrendingUp, Award, MapPin, Phone, Mail, Settings, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import NotificationManager from '@/components/NotificationManager'

interface Application {
  taskId: number
  taskTitle: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface Task {
  id: number
  title: string
  description: string
  location: string
  price: string
  priceType: string
  date: string
  time: string
  category: string
  user: {
    name: string
    rating: number
    completedTasks: number
    avatar: string
  }
  urgent: boolean
  createdAt: string
  status?: 'active' | 'completed' | 'cancelled'
}

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
  isVerified: boolean
  avatar?: string
  bio?: string
  location?: string
  rating?: number
  completedTasks?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [user, setUser] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    location: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = () => {
    try {
      // Проверка дали потребителят е влязъл
      const loginStatus = localStorage.getItem('isLoggedIn')
      const userData = localStorage.getItem('user')
      
      if (loginStatus !== 'true' || !userData) {
        toast.error('Трябва да сте влезли в акаунта си')
        router.push('/login')
        return
      }

      const user = JSON.parse(userData)
      setUser(user)
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || ''
      })

      // Зареждане на кандидатури
      const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]')
      setApplications(savedApplications)

      // Зареждане на публикувани задачи
      const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      setMyTasks(savedTasks)
    } catch (error) {
      toast.error('Грешка при зареждането на профила')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    toast.success('Успешно излязохте от акаунта')
    router.push('/')
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...editForm
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    toast.success('Профилът е обновен успешно')
  }

  const handleCancelEdit = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || ''
    })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Паролите не съвпадат')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Паролата трябва да е поне 6 символа')
      return
    }

    // В реален проект тук ще има API заявка
    toast.success('Паролата е променена успешно')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} className="text-success-600" />
      case 'rejected':
        return <AlertCircle size={16} className="text-danger-600" />
      default:
        return <Clock size={16} className="text-secondary-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Приета'
      case 'rejected':
        return 'Отхвърлена'
      default:
        return 'В изчакване'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStats = () => {
    const totalApplications = applications.length
    const acceptedApplications = applications.filter(app => app.status === 'accepted').length
    const totalTasks = myTasks.length
    const completedTasks = myTasks.filter(task => task.status === 'completed').length
    const activeTasks = myTasks.filter(task => task.status === 'active').length

    return {
      totalApplications,
      acceptedApplications,
      totalTasks,
      completedTasks,
      activeTasks,
      successRate: totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0
    }
  }

  const stats = getStats()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Мой профил
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline text-sm flex items-center gap-2"
            >
              <LogOut size={16} />
              Излез
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <User size={40} className="text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      {user.phone}
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {user.location}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Член от {new Date(user.createdAt).toLocaleDateString('bg-BG', { month: 'long', year: 'numeric' })}
                  </span>
                  {user.rating && (
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      {user.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300">
                  <CheckCircle size={14} />
                  Верифициран
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300">
                  <Clock size={14} />
                  Неверифициран
                </span>
              )}
              <button
                onClick={handleEditProfile}
                className="btn btn-outline text-sm flex items-center gap-2"
              >
                <Edit size={16} />
                Редактирай
              </button>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">За мен</h3>
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {stats.totalApplications}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Кандидатури</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-1">
                {stats.acceptedApplications}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Приети</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mb-1">
                {stats.totalTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Публикувани</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-1">
                {stats.successRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Успеваемост</div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Редактирай профил
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Име
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="input w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Локация
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    За мен
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className="input w-full h-24 resize-none"
                    placeholder="Разкажете малко за себе си..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="btn btn-primary flex-1"
                >
                  Запази
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-outline flex-1"
                >
                  Отказ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Моите кандидатури ({applications.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp size={16} />
              Успеваемост: {stats.successRate}%
            </div>
          </div>
          
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                Все още не сте кандидатствали за задачи
              </div>
              <button
                onClick={() => router.push('/tasks')}
                className="btn btn-primary"
              >
                Разгледай задачи
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {app.taskTitle}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Кандидатствана на {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className="text-sm font-medium">
                        {getStatusText(app.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Моите публикувани задачи ({myTasks.length})
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-success-600 dark:text-success-400">
                {stats.completedTasks} завършени
              </span>
              <span className="text-secondary-600 dark:text-secondary-400">
                {stats.activeTasks} активни
              </span>
            </div>
          </div>
          
          {myTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                Все още не сте публикували задачи
              </div>
              <button
                onClick={() => router.push('/post-task')}
                className="btn btn-primary"
              >
                Публикувай първата задача
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {task.description.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {task.location}
                        </span>
                        <span>{task.price} {task.priceType === 'hourly' ? 'лв/час' : 'лв'}</span>
                        <span>{task.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.urgent && (
                        <span className="text-xs bg-danger-100 text-danger-600 px-2 py-1 rounded dark:bg-danger-900 dark:text-danger-300">
                          Спешно
                        </span>
                      )}
                      {task.status && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.status === 'completed' 
                            ? 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300'
                            : task.status === 'active'
                            ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {task.status === 'completed' ? 'Завършена' : 
                           task.status === 'active' ? 'Активна' : 'Отменена'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Settings size={20} />
            Настройки
          </h3>
          
          <div className="space-y-6">
            {/* Notification Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                Настройки за уведомления
              </h4>
              <NotificationManager />
            </div>

            {/* Change Password */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                Промяна на парола
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Текуща парола
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="input w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Нова парола
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Потвърди нова парола
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="input w-full"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  className="btn btn-primary"
                >
                  Промени парола
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 