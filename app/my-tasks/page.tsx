'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Eye, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Filter,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Task, useTasksAPI } from '@/hooks/useTasksAPI'
import { supabase } from '@/lib/supabase'

const statusColors = {
  active: 'bg-green-100 text-green-800',
  assigned: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  active: 'Активна',
  assigned: 'Възложена',
  completed: 'Завършена',
  cancelled: 'Отменена'
}

export default function MyTasksPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const { tasks: allTasks, loading: tasksLoading, getUserTasks } = useTasksAPI()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || tasksLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    // Зареждане на задачите на потребителя от Supabase
    const loadUserTasks = async () => {
      try {
        const userTasks = await getUserTasks(authUser.id)
        console.log('Задачи на потребителя от Supabase:', userTasks)
        setTasks(userTasks)
        setFilteredTasks(userTasks)
      } catch (error) {
        console.error('Грешка при зареждане на задачи:', error)
        toast.error('Грешка при зареждане на задачи')
      } finally {
        setLoading(false)
      }
    }
    
    loadUserTasks()
  }, [authUser, authLoading, tasksLoading, getUserTasks, router])

  useEffect(() => {
    filterTasks()
  }, [searchQuery, selectedStatus, tasks])

  const filterTasks = () => {
    let filtered = [...tasks]

    // Филтър по търсене
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Филтър по статус
    if (selectedStatus) {
      filtered = filtered.filter(task => task.status === selectedStatus)
    }

    setFilteredTasks(filtered)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази задача? Това действие е необратимо.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== taskId))
      
      toast.success('Задачата е изтрита успешно')
    } catch (error: any) {
      console.error('Error deleting task:', error)
      toast.error('Грешка при изтриване на задачата')
    }
  }

  const handleEditTask = (taskId: string) => {
    router.push(`/task/${taskId}/edit`)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Няма срок'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  const formatPrice = (price: number, priceType: string) => {
    return priceType === 'hourly' ? `${price} лв/час` : `${price} лв`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />
      case 'assigned':
        return <MessageCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Моите задачи</h1>
                <p className="text-gray-600 mt-1">
                  Управлявайте задачите, които сте публикували
                </p>
              </div>
              <button
                onClick={() => router.push('/post-task')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Публикувай нова задача
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Общо задачи</p>
                  <p className="text-2xl font-bold text-blue-900">{tasks.length}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Активни</p>
                  <p className="text-2xl font-bold text-green-900">
                    {tasks.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-2">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Възложени</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {tasks.filter(t => t.status === 'assigned').length}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Завършени</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full p-2">
                  <CheckCircle className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Търси в задачите..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Всички статуси</option>
              <option value="active">Активни</option>
              <option value="assigned">Възложени</option>
              <option value="completed">Завършени</option>
              <option value="cancelled">Отменени</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tasks.length === 0 ? 'Все още нямате публикувани задачи' : 'Няма намерени задачи'}
            </h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0 
                ? 'Започнете да публикувате задачи и намерете изпълнители'
                : 'Опитайте да промените филтрите или търсенето'
              }
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => router.push('/post-task')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Публикувай първата си задача
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                        {statusLabels[task.status]}
                      </span>
                      {task.urgent && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Спешно
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    
                    {/* Images */}
                    {task.images && task.images.length > 0 && (
                      <div className="mb-3">
                        <div className="flex gap-2 overflow-x-auto">
                          {task.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Снимка ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                            />
                          ))}
                          {task.images.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                              +{task.images.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(task.deadline)}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(task.price, task.price_type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500 mb-1">
                      {task.applications} оферти
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.views} прегледа
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Публикувана на {formatDate(task.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTask(task.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Редактирай"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Изтрий"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => router.push(`/task/${task.id}/applicants`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Кандидати ({task.applications || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
