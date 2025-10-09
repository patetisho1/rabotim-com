'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  full_name: string
  phone: string
  avatar_url: string
  bio: string
  location: string
  is_verified: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    loadUsers()
  }, [pagination.page, search, statusFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        throw new Error('Неуспешно зареждане на потребителите')
      }

      const data = await response.json()
      setUsers(data.users || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Възникна грешка при зареждането на потребителите')
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates
        })
      })

      if (!response.ok) {
        throw new Error('Неуспешно обновяване на потребителя')
      }

      toast.success('Потребителят е обновен успешно')
      loadUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Възникна грешка при обновяването на потребителя')
    }
  }

  const handleUserDelete = async (userId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Неуспешно изтриване на потребителя')
      }

      toast.success('Потребителят е изтрит успешно')
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Възникна грешка при изтриването на потребителя')
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Моля, изберете поне един потребител')
      return
    }

    try {
      for (const userId of selectedUsers) {
        if (action === 'verify') {
          await handleUserUpdate(userId, { is_verified: true })
        } else if (action === 'unverify') {
          await handleUserUpdate(userId, { is_verified: false })
        } else if (action === 'makeAdmin') {
          await handleUserUpdate(userId, { is_admin: true })
        } else if (action === 'removeAdmin') {
          await handleUserUpdate(userId, { is_admin: false })
        }
      }

      toast.success(`${action} приложено успешно към ${selectedUsers.length} потребители`)
      setSelectedUsers([])
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

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Управление на потребители</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Търси потребители..."
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
            <option value="">Всички потребители</option>
            <option value="verified">Потвърдени</option>
            <option value="unverified">Непотвърдени</option>
            <option value="admin">Админи</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              Избрани {selectedUsers.length} потребители
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Потвърди
              </button>
              <button
                onClick={() => handleBulkAction('unverify')}
                className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Отмени потвърждение
              </button>
              <button
                onClick={() => handleBulkAction('makeAdmin')}
                className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Направи админ
              </button>
              <button
                onClick={() => handleBulkAction('removeAdmin')}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Премахни админ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Зареждане на потребители...</p>
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
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Потребител
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Регистриран
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar_url ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.avatar_url}
                                alt={user.full_name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.full_name?.charAt(0) || user.email.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name || 'Анонимен'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.is_verified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Потвърден
                            </span>
                          )}
                          {user.is_admin && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Shield size={12} className="mr-1" />
                              Админ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUserUpdate(user.id, { is_verified: !user.is_verified })}
                            className={`p-2 rounded-lg transition-colors ${
                              user.is_verified 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={user.is_verified ? 'Отмени потвърждение' : 'Потвърди'}
                          >
                            {user.is_verified ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleUserUpdate(user.id, { is_admin: !user.is_admin })}
                            className={`p-2 rounded-lg transition-colors ${
                              user.is_admin 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-purple-600 hover:bg-purple-50'
                            }`}
                            title={user.is_admin ? 'Премахни админ права' : 'Направи админ'}
                          >
                            {user.is_admin ? <ShieldOff size={16} /> : <Shield size={16} />}
                          </button>
                          <button
                            onClick={() => handleUserDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Изтрий потребителя"
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

