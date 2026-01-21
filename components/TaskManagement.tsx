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
  User,
  Shield,
  Activity
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
  const [logsModalTask, setLogsModalTask] = useState<Task | null>(null)
  const [logs, setLogs] = useState<ModerationLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | null>(null)

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

  const handleTaskUpdate = async (
    taskId: string,
    updates: Partial<Task>,
    options?: { notes?: string; issues?: string[]; skipReload?: boolean }
  ) => {
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          updates,
          notes: options?.notes,
          issues: options?.issues
        })
      })

      if (!response.ok) {
        throw new Error('Неуспешно обновяване на задачата')
      }

      toast.success('Задачата е обновена успешно')
      if (!options?.skipReload) {
        loadTasks()
      }
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
          await handleTaskUpdate(taskId, { status: 'active' }, { notes: 'Администратор активира задачата', skipReload: true })
        } else if (action === 'complete') {
          await handleTaskUpdate(taskId, { status: 'completed' }, { notes: 'Администратор маркира задачата като завършена', skipReload: true })
        } else if (action === 'cancel') {
          await handleTaskUpdate(taskId, { status: 'cancelled' }, { notes: 'Администратор отказа задачата', skipReload: true })
        }
      }

      toast.success(`${action} приложено успешно към ${selectedTasks.length} задачи`)
      setSelectedTasks([])
      loadTasks()
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
      case 'pending':
        return <Clock size={16} className="text-orange-500" />
      default:
        return <Clock size={16} className="text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активна'
      case 'pending':
        return 'Изчаква преглед'
      case 'completed':
        return 'Завършена'
      case 'cancelled':
        return 'Отказана'
      case 'in_progress':
        return 'В процес'
      case 'assigned':
        return 'Назначена'
      default:
        return status
    }
  }

  const openLogsModal = async (task: Task) => {
    setLogsModalTask(task)
    setLogsLoading(true)
    setLogsError(null)
    try {
      const response = await fetch(`/api/admin/tasks/logs?taskId=${task.id}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Неуспешно зареждане на модерационната история')
      }
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error loading moderation logs:', error)
      setLogsError(error instanceof Error ? error.message : 'Възникна грешка при зареждането на историята')
    } finally {
      setLogsLoading(false)
    }
  }

  const closeLogsModal = () => {
    setLogsModalTask(null)
    setLogs([])
    setLogsError(null)
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
            <Clock size={12} />
            Изчаква преглед
          </span>
        )
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            <Clock size={12} />
            Активна
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            <CheckCircle size={12} />
            Завършена
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            <XCircle size={12} />
            Отказана
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
            <AlertCircle size={12} />
            В процес
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
            <Clock size={12} />
            {status}
          </span>
        )
    }
  }

  const renderTaskActions = (task: Task) => {
    const isPending = task.status === 'pending'
    const isActive = task.status === 'active'

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openLogsModal(task)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="История на модерацията"
        >
          <Activity size={16} />
        </button>

        {isPending ? (
          <>
            <button
              onClick={() =>
                handleTaskUpdate(task.id, { status: 'active' }, { notes: 'Администратор одобри задачата' })
              }
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Одобри
            </button>
            <button
              onClick={() =>
                handleTaskUpdate(task.id, { status: 'cancelled' }, { notes: 'Администратор отхвърли задачата' })
              }
              className="px-3 py-1 text-xs font-semibold rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
            >
              Откажи
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() =>
                handleTaskUpdate(
                  task.id,
                  { status: isActive ? 'cancelled' : 'active' },
                  { notes: isActive ? 'Администратор отказа задачата' : 'Администратор активира задачата' }
                )
              }
              className={`p-2 rounded-lg transition-colors ${
                isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
              }`}
              title={isActive ? 'Откажи задача' : 'Активирай задача'}
            >
              {isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
            </button>
            <button
              onClick={() => handleTaskDelete(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Изтрий задача"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    )
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
            <option value="pending">Изчаква преглед</option>
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
                          {renderStatusBadge(task.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {task.price} €
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
                        {renderTaskActions(task)}
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
      {/* Logs Modal */}
      {logsModalTask && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6">
          <div className="w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">История на модерацията</h3>
                <p className="text-sm text-gray-500">Задача: {logsModalTask.title}</p>
              </div>
              <button
                onClick={closeLogsModal}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
              {logsLoading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  Зареждане на историята...
                </div>
              ) : logsError ? (
                <div className="py-8 text-center text-red-600 text-sm">{logsError}</div>
              ) : logs.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Няма записана модерационна история за тази задача.
                </div>
              ) : (
                <ul className="space-y-4">
                  {logs.map((log) => (
                    <li key={log.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                          <Activity size={16} className="text-blue-600" />
                          {renderLogActionText(log.action)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString('bg-BG')}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {log.status_after && renderStatusBadge(log.status_after)}
                        {log.moderator && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                            <User size={12} />
                            {log.moderator.full_name || log.moderator.email || 'Система'}
                          </span>
                        )}
                        {!log.moderator && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                            <Shield size={12} />
                            Автоматична проверка
                          </span>
                        )}
                      </div>
                      {log.notes && (
                        <p className="mt-3 text-sm text-gray-700">{log.notes}</p>
                      )}
                      {log.issues && log.issues.length > 0 && (
                        <div className="mt-3 rounded-lg bg-white border border-orange-200 px-3 py-2">
                          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                            Потенциални проблеми
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-orange-700">
                            {log.issues.map((issue, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircle size={14} className="mt-1 flex-shrink-0" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-3 text-right">
              <button
                onClick={closeLogsModal}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ModerationLog {
  id: string
  task_id: string
  action: string
  status_after: string | null
  issues: string[] | null
  notes: string | null
  created_at: string
  moderator?: {
    id: string
    full_name?: string | null
    email?: string | null
  } | null
}

const renderLogActionText = (action: string) => {
  switch (action) {
    case 'auto_review':
      return 'Автоматична проверка'
    case 'auto_approved':
      return 'Автоматично одобрена'
    case 'manual_status_update':
      return 'Ръчна промяна на статуса'
    case 'manual_update':
      return 'Ръчна актуализация'
    default:
      return action
  }
}

