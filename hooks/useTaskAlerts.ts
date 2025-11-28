'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export interface TaskAlert {
  id: string
  user_id: string
  name: string
  categories: string[]
  locations: string[]
  min_budget: number
  max_budget: number
  keywords: string[]
  email_enabled: boolean
  push_enabled: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
  is_active: boolean
  matches_count: number
  last_notified_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateTaskAlertInput {
  name?: string
  categories?: string[]
  locations?: string[]
  min_budget?: number
  max_budget?: number
  keywords?: string[]
  email_enabled?: boolean
  push_enabled?: boolean
  frequency?: 'immediate' | 'daily' | 'weekly'
}

export function useTaskAlerts(userId?: string) {
  const [alerts, setAlerts] = useState<TaskAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/task-alerts?userId=${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при зареждане')
      }

      setAlerts(data.alerts || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Грешка при зареждане'
      setError(message)
      console.error('Fetch alerts error:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Create alert
  const createAlert = useCallback(async (input: CreateTaskAlertInput): Promise<TaskAlert | null> => {
    if (!userId) {
      toast.error('Моля влезте в профила си')
      return null
    }

    try {
      const response = await fetch('/api/task-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ...input
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при създаване')
      }

      toast.success(data.message || 'Известието е създадено!')
      
      // Refresh alerts list
      await fetchAlerts()
      
      return data.alert
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Грешка при създаване'
      toast.error(message)
      return null
    }
  }, [userId, fetchAlerts])

  // Update alert
  const updateAlert = useCallback(async (
    alertId: string, 
    updates: Partial<CreateTaskAlertInput & { is_active: boolean }>
  ): Promise<boolean> => {
    if (!userId) return false

    try {
      const response = await fetch('/api/task-alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: alertId,
          user_id: userId,
          ...updates
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при обновяване')
      }

      toast.success('Известието е обновено')
      await fetchAlerts()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Грешка при обновяване'
      toast.error(message)
      return false
    }
  }, [userId, fetchAlerts])

  // Toggle alert active status
  const toggleAlert = useCallback(async (alertId: string, isActive: boolean): Promise<boolean> => {
    return updateAlert(alertId, { is_active: isActive })
  }, [updateAlert])

  // Delete alert
  const deleteAlert = useCallback(async (alertId: string): Promise<boolean> => {
    if (!userId) return false

    try {
      const response = await fetch(`/api/task-alerts?id=${alertId}&userId=${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при изтриване')
      }

      toast.success('Известието е изтрито')
      await fetchAlerts()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Грешка при изтриване'
      toast.error(message)
      return false
    }
  }, [userId, fetchAlerts])

  // Load alerts on mount
  useEffect(() => {
    if (userId) {
      fetchAlerts()
    }
  }, [userId, fetchAlerts])

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    toggleAlert,
    deleteAlert,
    hasAlerts: alerts.length > 0,
    activeAlertsCount: alerts.filter(a => a.is_active).length
  }
}

// Quick subscribe hook for simple use cases
export function useQuickSubscribe(userId?: string) {
  const [subscribing, setSubscribing] = useState(false)

  const subscribe = useCallback(async (options: {
    category?: string
    location?: string
    minBudget?: number
    maxBudget?: number
  }): Promise<boolean> => {
    if (!userId) {
      toast.error('Моля влезте в профила си за да се абонирате')
      return false
    }

    setSubscribing(true)

    try {
      const response = await fetch('/api/task-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          categories: options.category ? [options.category] : [],
          locations: options.location ? [options.location] : [],
          min_budget: options.minBudget || 0,
          max_budget: options.maxBudget || 999999,
          email_enabled: true,
          frequency: 'immediate'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Грешка')
      }

      toast.success('🔔 Ще получите известие при нова подходяща задача!')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Грешка при абониране'
      toast.error(message)
      return false
    } finally {
      setSubscribing(false)
    }
  }, [userId])

  return { subscribe, subscribing }
}

