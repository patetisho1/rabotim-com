import { useState, useEffect } from 'react'

interface Stats {
  tasks: number
  users: number
  cities: number
  completed: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    tasks: 0,
    users: 0,
    cities: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch tasks count
      const tasksResponse = await fetch('/api/tasks?limit=1')
      const tasksData = await tasksResponse.json()
      const tasksCount = tasksData.pagination?.total || 0

      // Fetch users count
      const usersResponse = await fetch('/api/users?limit=1')
      const usersData = await usersResponse.json()
      const usersCount = usersData.length || 0

      // For now, we'll use mock data for cities and completed tasks
      // In a real app, you'd have separate API endpoints for these
      const citiesCount = 12 // Mock value
      const completedCount = Math.floor(tasksCount * 0.85) // 85% completion rate

      setStats({
        tasks: tasksCount,
        users: usersCount,
        cities: citiesCount,
        completed: completedCount
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Fallback to mock data on error
      setStats({
        tasks: 15,
        users: 250,
        cities: 12,
        completed: 13
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
