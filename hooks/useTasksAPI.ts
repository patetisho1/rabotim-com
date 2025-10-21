import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0'

let supabase: any = null
try {
  supabase = createClient(supabaseUrl, supabaseKey)
} catch (error) {
  console.warn('Supabase client not initialized:', error)
}

export interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  price_type: 'fixed' | 'hourly'
  deadline?: string
  urgent: boolean
  remote: boolean
  status: 'active' | 'assigned' | 'completed' | 'cancelled'
  views: number
  applications: number
  rating: number
  review_count: number
  posted_by: string
  posted_by_email: string
  created_at: string
  updated_at: string
  images?: string[]
  is_archived?: boolean
  archived_at?: string
  profiles?: {
    id: string
    full_name: string
    avatar_url?: string
    is_verified: boolean
  }
}

export interface CreateTaskData {
  title: string
  description: string
  category: string
  location: string
  price: number
  priceType: 'fixed' | 'hourly'
  deadline?: string
  urgent?: boolean
  remote?: boolean
  conditions?: string
}

export function useTasksAPI() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  
  console.log('useTasksAPI: Supabase client:', supabase ? 'initialized' : 'not initialized')
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (filters?: {
    category?: string
    location?: string
    priceMin?: number
    priceMax?: number
    status?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      // If no Supabase client, return empty array
      if (!supabase) {
        console.warn('Supabase client not initialized - fetchTasks returning empty array')
        setTasks([])
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }
      if (filters?.location && filters.location !== 'all') {
        params.append('location', filters.location)
      }
      if (filters?.priceMin) {
        params.append('priceMin', filters.priceMin.toString())
      }
      if (filters?.priceMax) {
        params.append('priceMax', filters.priceMax.toString())
      }
      if (filters?.status) {
        params.append('status', filters.status)
      }

      const response = await fetch(`/api/tasks?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      setError(null)

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task')
      }

      const data = await response.json()
      
      // Добавяме новата задача в списъка
      setTasks(prev => [data.task, ...prev])
      
      return data.task
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    try {
      setError(null)

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update task')
      }

      const data = await response.json()
      
      // Обновяваме задачата в списъка
      setTasks(prev => prev.map(task => 
        task.id === taskId ? data.task : task
      ))
      
      return data.task
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    }
  }

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      setError(null)

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete task')
      }

      // Премахваме задачата от списъка
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    }
  }

  const getUserTasks = async (userId: string): Promise<Task[]> => {
    try {
      setError(null)

      // Check if Supabase is configured (use fallback values from lib/supabase.ts)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co'
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0'
      
      console.log('getUserTasks: Using Supabase URL:', supabaseUrl)

      const response = await fetch(`/api/tasks?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user tasks')
      }

      const data = await response.json()
      console.log('getUserTasks API response:', { userId, data })
      return data.tasks || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Error fetching user tasks:', err)
      
      return []
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getUserTasks,
  }
}

