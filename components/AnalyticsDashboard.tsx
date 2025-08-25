'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar,
  Users,
  Briefcase,
  MessageCircle,
  Star,
  TrendingUp,
  MapPin,
  DollarSign
} from 'lucide-react'

interface AnalyticsData {
  period: string
  users: {
    total: number
    new: number
    active: number
    verified: number
  }
  tasks: {
    total: number
    active: number
    completed: number
    urgent: number
  }
  engagement: {
    applications: number
    messages: number
    reviews: number
    rating: number
  }
  revenue: {
    total: number
    thisMonth: number
    average: number
    growth: number
  }
  locations: {
    sofia: number
    plovdiv: number
    varna: number
    burgas: number
    other: number
  }
  categories: {
    name: string
    count: number
    percentage: number
  }[]
  timeline: {
    date: string
    tasks: number
    users: number
    applications: number
  }[]
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState<'tasks' | 'users' | 'revenue'>('tasks')

  useEffect(() => {
    loadAnalyticsData()
  }, [period])

  const loadAnalyticsData = () => {
    setIsLoading(true)
    
    // Симулация на данни от API
    setTimeout(() => {
      const mockData: AnalyticsData = {
        period: period,
        users: {
          total: 1247,
          new: period === '7d' ? 23 : period === '30d' ? 89 : 234,
          active: 892,
          verified: 1156
        },
        tasks: {
          total: 892,
          active: 156,
          completed: 736,
          urgent: 45
        },
        engagement: {
          applications: 2341,
          messages: 5678,
          reviews: 892,
          rating: 4.6
        },
        revenue: {
          total: 45680,
          thisMonth: period === '7d' ? 12340 : period === '30d' ? 45680 : 89000,
          average: 62.5,
          growth: 12.5
        },
        locations: {
          sofia: 456,
          plovdiv: 234,
          varna: 189,
          burgas: 156,
          other: 247
        },
        categories: [
          { name: 'Домакинство', count: 234, percentage: 26.2 },
          { name: 'Ремонт', count: 189, percentage: 21.2 },
          { name: 'Транспорт', count: 156, percentage: 17.5 },
          { name: 'Образование', count: 123, percentage: 13.8 },
          { name: 'IT услуги', count: 98, percentage: 11.0 },
          { name: 'Други', count: 92, percentage: 10.3 }
        ],
        timeline: generateTimelineData(period)
      }
      
      setData(mockData)
      setIsLoading(false)
    }, 500)
  }

  const generateTimelineData = (period: string) => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        tasks: Math.floor(Math.random() * 20) + 5,
        users: Math.floor(Math.random() * 15) + 3,
        applications: Math.floor(Math.random() * 50) + 10
      })
    }
    
    return data
  }

  const exportToCSV = (type: 'tasks' | 'users' | 'revenue' | 'all') => {
    if (!data) return

    let csvContent = ''
    let filename = ''

    switch (type) {
      case 'tasks':
        csvContent = `Дата,Задачи,Активни,Завършени,Спешни\n`
        data.timeline.forEach(item => {
          csvContent += `${item.date},${item.tasks},${Math.floor(item.tasks * 0.8)},${Math.floor(item.tasks * 0.6)},${Math.floor(item.tasks * 0.1)}\n`
        })
        filename = `tasks_analytics_${period}.csv`
        break
      
      case 'users':
        csvContent = `Дата,Нови потребители,Активни,Верифицирани\n`
        data.timeline.forEach(item => {
          csvContent += `${item.date},${item.users},${Math.floor(item.users * 0.7)},${Math.floor(item.users * 0.9)}\n`
        })
        filename = `users_analytics_${period}.csv`
        break
      
      case 'revenue':
        csvContent = `Дата,Приходи,Средна стойност,Растеж\n`
        data.timeline.forEach(item => {
          const revenue = item.tasks * (Math.random() * 50 + 30)
          csvContent += `${item.date},${revenue.toFixed(2)},${(revenue / item.tasks).toFixed(2)},${(Math.random() * 20 - 10).toFixed(1)}%\n`
        })
        filename = `revenue_analytics_${period}.csv`
        break
      
      case 'all':
        csvContent = `Метрика,Стойност,Период\n`
        csvContent += `Общо потребители,${data.users.total},${period}\n`
        csvContent += `Нови потребители,${data.users.new},${period}\n`
        csvContent += `Активни потребители,${data.users.active},${period}\n`
        csvContent += `Общо задачи,${data.tasks.total},${period}\n`
        csvContent += `Активни задачи,${data.tasks.active},${period}\n`
        csvContent += `Завършени задачи,${data.tasks.completed},${period}\n`
        csvContent += `Общо кандидатури,${data.engagement.applications},${period}\n`
        csvContent += `Общо съобщения,${data.engagement.messages},${period}\n`
        csvContent += `Среден рейтинг,${data.engagement.rating},${period}\n`
        csvContent += `Общо приходи,${data.revenue.total},${period}\n`
        filename = `full_analytics_${period}.csv`
        break
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Аналитика</h2>
          <p className="text-gray-600">Преглед на ключовите метрики и тенденции</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Последните 7 дни</option>
            <option value="30d">Последните 30 дни</option>
            <option value="90d">Последните 90 дни</option>
            <option value="1y">Последната година</option>
          </select>
          
          <button
            onClick={() => exportToCSV('all')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Експорт CSV
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общо потребители</p>
              <p className="text-2xl font-bold text-gray-900">{data.users.total.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{data.users.new} нови</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общо задачи</p>
              <p className="text-2xl font-bold text-gray-900">{data.tasks.total.toLocaleString()}</p>
              <p className="text-sm text-blue-600">{data.tasks.active} активни</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Кандидатури</p>
              <p className="text-2xl font-bold text-gray-900">{data.engagement.applications.toLocaleString()}</p>
              <p className="text-sm text-purple-600">{data.engagement.messages} съобщения</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageCircle size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Среден рейтинг</p>
              <p className="text-2xl font-bold text-gray-900">{data.engagement.rating}</p>
              <p className="text-sm text-yellow-600">{data.engagement.reviews} отзива</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Тенденции</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedChart('tasks')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedChart === 'tasks' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Задачи
              </button>
              <button
                onClick={() => setSelectedChart('users')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedChart === 'users' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Потребители
              </button>
              <button
                onClick={() => setSelectedChart('revenue')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedChart === 'revenue' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Приходи
              </button>
            </div>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Графика за {selectedChart}</p>
              <p className="text-sm text-gray-500">Период: {period}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => exportToCSV(selectedChart)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Download size={14} />
              Експорт данни
            </button>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Категории</h3>
            <button
              onClick={() => exportToCSV('tasks')}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Download size={14} />
              Експорт
            </button>
          </div>
          
          <div className="space-y-4">
            {data.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Разпределение по градове</h3>
          <MapPin size={20} className="text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(data.locations).map(([city, count]) => (
            <div key={city} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{city}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
