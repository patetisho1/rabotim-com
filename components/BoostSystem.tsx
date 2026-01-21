'use client'

import { useState, useEffect } from 'react'
import { Star, Eye, EyeOff, TrendingUp, DollarSign, Clock, Target } from 'lucide-react'

interface BoostOption {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  icon: React.ReactNode
  isPopular?: boolean
}

interface BoostedTask {
  id: string
  taskTitle: string
  boostType: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled'
  views: number
  clicks: number
}

const boostOptions: BoostOption[] = [
  {
    id: 'basic',
    name: 'Основен Boost',
    description: 'Повишете видимостта на вашата задача',
    price: 5,
    duration: '24 часа',
    features: [
      'Повишена позиция в резултатите',
      'Специален badge "Промотирана"',
      'До 3x повече прегледи'
    ],
    icon: <Star size={20} className="text-yellow-500" />
  },
  {
    id: 'premium',
    name: 'Премиум Boost',
    description: 'Максимална видимост и приоритет',
    price: 15,
    duration: '7 дни',
    features: [
      'Най-висока позиция в резултатите',
      'Златен badge "Премиум"',
      'До 10x повече прегледи',
      'Приоритетна поддръжка',
      'Аналитика на представянето'
    ],
    icon: <TrendingUp size={20} className="text-green-500" />,
    isPopular: true
  },
  {
    id: 'urgent',
    name: 'Спешен Boost',
    description: 'За спешни задачи с висок приоритет',
    price: 25,
    duration: '48 часа',
    features: [
      'Най-висок приоритет',
      'Червен badge "Спешно"',
      'До 15x повече прегледи',
      'Известия до всички изпълнители',
      'Гарантирано внимание'
    ],
    icon: <Target size={20} className="text-red-500" />
  }
]

export default function BoostSystem() {
  const [isVisible, setIsVisible] = useState(true)
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null)
  const [boostedTasks, setBoostedTasks] = useState<BoostedTask[]>([])
  const [showBoostModal, setShowBoostModal] = useState(false)

  useEffect(() => {
    // Зареждане на boost статуса от localStorage
    const boostVisibility = localStorage.getItem('boostSystemVisible')
    if (boostVisibility !== null) {
      setIsVisible(boostVisibility === 'true')
    }

    // Зареждане на boost-натите задачи
    loadBoostedTasks()
  }, [])

  const loadBoostedTasks = () => {
    const sampleBoostedTasks: BoostedTask[] = [
      {
        id: '1',
        taskTitle: 'Помощ при преместване',
        boostType: 'Премиум Boost',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        status: 'active',
        views: 156,
        clicks: 23
      },
      {
        id: '2',
        taskTitle: 'Ремонт на водопровод',
        boostType: 'Спешен Boost',
        startDate: '2024-01-14',
        endDate: '2024-01-16',
        status: 'active',
        views: 89,
        clicks: 15
      },
      {
        id: '3',
        taskTitle: 'Почистване на апартамент',
        boostType: 'Основен Boost',
        startDate: '2024-01-10',
        endDate: '2024-01-11',
        status: 'expired',
        views: 67,
        clicks: 8
      }
    ]
    setBoostedTasks(sampleBoostedTasks)
  }

  const toggleVisibility = () => {
    const newVisibility = !isVisible
    setIsVisible(newVisibility)
    localStorage.setItem('boostSystemVisible', newVisibility.toString())
  }

  const handleBoostSelect = (boostId: string) => {
    setSelectedBoost(boostId)
    setShowBoostModal(true)
  }

  const handleBoostPurchase = () => {
    if (!selectedBoost) return

    const boost = boostOptions.find(b => b.id === selectedBoost)
    if (!boost) return

    // Симулация на покупка
    const newBoostedTask: BoostedTask = {
      id: Date.now().toString(),
      taskTitle: 'Вашата задача',
      boostType: boost.name,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      views: 0,
      clicks: 0
    }

    setBoostedTasks(prev => [newBoostedTask, ...prev])
    setShowBoostModal(false)
    setSelectedBoost(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'expired':
        return 'text-gray-600 bg-gray-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Boost система
          </h2>
        </div>
        <button
          onClick={toggleVisibility}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          {isVisible ? 'Скрий' : 'Покажи'}
        </button>
      </div>

      {/* Boost Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {boostOptions.map((option) => (
          <div
            key={option.id}
            className={`relative p-6 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              option.isPopular 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleBoostSelect(option.id)}
          >
            {option.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Най-популярен
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              {option.icon}
              <h3 className="text-lg font-semibold text-gray-900">
                {option.name}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              {option.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {option.price} €
              </span>
              <span className="text-sm text-gray-500">
                {option.duration}
              </span>
            </div>

            <ul className="space-y-2">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Избери
            </button>
          </div>
        ))}
      </div>

      {/* Boosted Tasks */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Вашите boost-нати задачи
        </h3>
        
        <div className="space-y-4">
          {boostedTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {task.taskTitle}
                </h4>
                <p className="text-sm text-gray-600">
                  {task.boostType}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Прегледи: {task.views}</span>
                  <span>Кликове: {task.clicks}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {task.startDate} - {task.endDate}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status === 'active' ? 'Активен' : 
                     task.status === 'expired' ? 'Изтекъл' : 'Отменен'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Потвърди Boost покупка
            </h3>
            
            {selectedBoost && (
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Искате ли да закупите {boostOptions.find(b => b.id === selectedBoost)?.name}?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">
                    Цена: {boostOptions.find(b => b.id === selectedBoost)?.price} €
                  </p>
                  <p className="text-sm text-gray-600">
                    Продължителност: {boostOptions.find(b => b.id === selectedBoost)?.duration}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowBoostModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={handleBoostPurchase}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Закупи
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

