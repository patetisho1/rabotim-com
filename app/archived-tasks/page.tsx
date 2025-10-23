'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Archive,
  RotateCcw,
  Trash2,
  Calendar,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function ArchivedTasksPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadArchivedTasks()
  }, [authUser, authLoading])

  const loadArchivedTasks = async () => {
    try {
      setLoading(true)
      
      const { data: archivedTasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', authUser?.id)
        .eq('is_archived', true)
        .order('archived_at', { ascending: false })

      if (error) throw error
      
      setTasks(archivedTasks || [])
    } catch (error) {
      console.error('Грешка при зареждане на архивирани задачи:', error)
      toast.error('Грешка при зареждане на архивирани задачи')
    } finally {
      setLoading(false)
    }
  }

  const handleUnarchive = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          is_archived: false,
          archived_at: null
        })
        .eq('id', taskId)

      if (error) throw error

      // Remove from local state
      setTasks(prev => prev.filter(task => task.id !== taskId))
      
      toast.success('Задачата е възстановена успешно')
    } catch (error: any) {
      console.error('Error unarchiving task:', error)
      toast.error('Грешка при възстановяване на задачата')
    }
  }

  const handlePermanentDelete = async (taskId: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази задача ЗАВИНАГИ? Това действие е необратимо!')) {
      return
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      // Remove from local state
      setTasks(prev => prev.filter(task => task.id !== taskId))
      
      toast.success('Задачата е изтрита завинаги')
    } catch (error: any) {
      console.error('Error deleting task:', error)
      toast.error('Грешка при изтриване на задачата')
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Няма срок'
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG')
  }

  if (authLoading || loading) {
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
            <button
              onClick={() => router.push('/my-tasks')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Назад към задачите
            </button>
            
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-gray-700" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Архивирани задачи</h1>
                <p className="text-gray-600 mt-1">
                  {tasks.length} {tasks.length === 1 ? 'задача' : 'задачи'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Archive className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нямате архивирани задачи
            </h3>
            <p className="text-gray-600">
              Архивираните задачи се съхраняват тук
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Архивирана
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Архивирана на {formatDate(task.archived_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {task.views || 0} прегледа
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleUnarchive(task.id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Възстанови"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Изтрий завинаги"
                    >
                      <Trash2 className="h-4 w-4" />
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


