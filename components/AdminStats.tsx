'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  MapPin,
  Star
} from 'lucide-react'
import StatsCard from './StatsCard'

interface AdminStatsProps {
  period?: 'today' | 'week' | 'month' | 'year'
}

export default function AdminStats({ period = 'month' }: AdminStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [period])

  const loadStats = () => {
    // Симулация на данни от API
    const sampleStats = {
      users: {
        total: 1247,
        new: 23,
        active: 892,
        verified: 1156
      },
      tasks: {
        total: 892,
        active: 156,
        completed: 736,
        urgent: 45
      },
      revenue: {
        total: 45680,
        thisMonth: 12340,
        average: 62.5,
        growth: 12.5
      },
      engagement: {
        applications: 2341,
        messages: 5678,
        reviews: 892,
        rating: 4.6
      },
      locations: {
        sofia: 456,
        plovdiv: 234,
        varna: 189,
        burgas: 156,
        other: 247
      }
    }

    setStats(sampleStats)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      {/* Основни статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Общо потребители"
          value={stats.users.total.toLocaleString()}
          change={12.5}
          changeType="increase"
          icon={<Users size={24} className="text-blue-600" />}
          color="bg-blue-100 dark:bg-blue-900/20"
        />
        
        <StatsCard
          title="Активни задачи"
          value={stats.tasks.active}
          change={-5.2}
          changeType="decrease"
          icon={<Briefcase size={24} className="text-green-600" />}
          color="bg-green-100 dark:bg-green-900/20"
        />
        
        <StatsCard
          title="Общо приходи"
          value={`${stats.revenue.total.toLocaleString()} лв`}
          change={8.7}
          changeType="increase"
          icon={<DollarSign size={24} className="text-yellow-600" />}
          color="bg-yellow-100 dark:bg-yellow-900/20"
        />
        
        <StatsCard
          title="Среден рейтинг"
          value={stats.engagement.rating}
          change={0.2}
          changeType="increase"
          icon={<Star size={24} className="text-purple-600" />}
          color="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>

      {/* Детайлни статистики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Потребители */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Потребители
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Нови този месец</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.users.new}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Активни потребители</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.users.active}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Верифицирани</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.users.verified}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(stats.users.verified / stats.users.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Задачи */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Задачи
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Завършени</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.tasks.completed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Спешни</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.tasks.urgent}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Процент завършени</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {Math.round((stats.tasks.completed / stats.tasks.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.tasks.completed / stats.tasks.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Локации */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-gray-600" />
          Активност по градове
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.locations).map(([city, count]) => (
            <div key={city} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {count as number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {city === 'other' ? 'Други' : city}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 