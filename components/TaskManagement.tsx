'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  price_type: string
  urgent: boolean
  status: string
  applications_count: number
  views_count: number
  created_at: string
  updated_at: string
  deadline: string
  profiles: {
    id: string
    full_name: string
    email: string
    avatar_url: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const categories = [
    'Ремонт и поддръжка',
    'Почистване',
    'Преместване',
    'Грижа и помощ',
    'Доставка',
    'Други'
  ]

  useEffect(() => {
    loadTasks()
  }, [pagination.page, search, statusFilter, categoryFilter])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter })
      })

      const response = await fetch(`/api/admin/tasks?${params}`)
      
      if (!response.ok) {
        throw new Error('Неуспешно зареждане на задачите')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Възникна грешка при зареждането на задачите')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          updates
        })
      })

      if (!response.ok) {
        throw new Error('Неуспешно обновяване на задачата')
      }

      toast.success('Задачата е обновена успешно')
      loadTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Възникна грешка при обновяването на задачата')
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази задача?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tasks?taskId=${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Неуспешно изтриване на задачата')
      }

      toast.success('Задачата е изтрита успешно')
      loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Възникна грешка при изтриването на задачата')
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedTasks.length === 0) {
      toast.error('Моля, изберете поне една задача')
      return
    }

    try {
      for (const taskId of selectedTasks) {
        if (action === 'activate') {
          await handleTaskUpdate(taskId, { status: 'active' })
        } else if (action === 'complete') {
          await handleTaskUpdate(taskId, { status: 'completed' })
        } else if (action === 'cancel') {
          await handleTaskUpdate(taskId, { status: 'cancelled' })
        }
      }

      toast.success(`${action} приложено успешно към ${selectedTasks.length} задачи`)
      setSelectedTasks([])
    } catch (error) {
      console.error('Error performing bulk action:', error)
      toast.error('Възникна грешка при изпълнението на действието')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasks.map(task => task.id))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} className="text-blue-600" />
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />
      case 'in_progress':
        return <AlertCircle size={16} className="text-yellow-600" />
      default:
        return <Clock size={16} className="text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активна'
      case 'completed':
        return 'Завършена'
      case 'cancelled':
        return 'Отказана'
      case 'in_progress':
        return 'В процес'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Управление на задачи</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Търси задачи..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Всички статуси</option>
            <option value="active">Активни</option>
            <option value="in_progress">В процес</option>
            <option value="completed">Завършени</option>
            <option value="cancelled">Отказани</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Всички категории</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              Избрани {selectedTasks.length} задачи
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Активирай
              </button>
              <button
                onClick={() => handleBulkAction('complete')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Завърши
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Откажи
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Зареждане на задачи...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedTasks.length === tasks.length && tasks.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Задача
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Потребител
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Създадена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {task.title}
                            </h4>
                            {task.urgent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Спешно
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">{task.category}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={12} />
                              {task.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            {task.profiles?.avatar_url ? (
                              <img
                                className="h-8 w-8 rounded-full"
                                src={task.profiles.avatar_url}
                                alt={task.profiles.full_name}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <User size={12} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {task.profiles?.full_name || 'Анонимен'}
                            </div>
                            <div className="text-xs text-gray-500">{task.profiles?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="text-sm text-gray-900">{getStatusText(task.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {task.price} лв
                          </span>
                          <span className="text-xs text-gray-500">
                            ({task.price_type === 'hourly' ? 'на час' : 'общо'})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(task.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTaskUpdate(task.id, { 
                              status: task.status === 'active' ? 'cancelled' : 'active' 
                            })}
                            className={`p-2 rounded-lg transition-colors ${
                              task.status === 'active' 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={task.status === 'active' ? 'Откажи задача' : 'Активирай задача'}
                          >
                            {task.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleTaskDelete(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Изтрий задача"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Предишна
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Следваща
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Показване на{' '}
                        <span className="font-medium">
                          {((pagination.page - 1) * pagination.limit) + 1}
                        </span>{' '}
                        до{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        от{' '}
                        <span className="font-medium">{pagination.total}</span>{' '}
                        резултата
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          {pagination.page} от {pagination.totalPages}
                        </span>
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

