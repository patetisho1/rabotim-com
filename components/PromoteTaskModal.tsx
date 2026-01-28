'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X, 
  Rocket, 
  TrendingUp, 
  Eye, 
  Star, 
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react'

interface PromoteTaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  taskTitle: string
}

const promotionPackages = [
  {
    id: 'boost',
    name: 'Буст',
    price: 2.99,
    duration: '24 часа',
    icon: Rocket,
    color: 'blue',
    features: [
      'Обявата ти се показва най-отгоре',
      'До 3x повече прегледи',
      'Маркирана с "🚀 Промотирана"'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: 4.99,
    duration: '3 дни',
    icon: Star,
    color: 'yellow',
    features: [
      'Всичко от Буст',
      'Показва се в началната страница',
      'Приоритетно разглеждане от изпълнители',
      'До 5x повече кандидатури'
    ],
    popular: true
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 9.99,
    duration: '7 дни',
    icon: Zap,
    color: 'purple',
    features: [
      'Всичко от Премиум',
      'VIP значка на обявата',
      'Изпращане на уведомления до изпълнители',
      'Гарантирано виждане от 100+ потребители'
    ],
    popular: false
  }
]

export default function PromoteTaskModal({ 
  isOpen, 
  onClose, 
  taskId, 
  taskTitle 
}: PromoteTaskModalProps) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handlePromote = async () => {
    if (!selectedPackage) return
    
    setIsProcessing(true)
    // For now, redirect to a payment page (will be integrated with Stripe later)
    router.push(`/task/${taskId}/promote?package=${selectedPackage}`)
  }

  const handleSkip = () => {
    onClose()
    router.push(`/task/${taskId}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-8 text-white">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🎉 Задачата е публикувана!</h2>
              <p className="text-white/80 text-sm">{taskTitle}</p>
            </div>
          </div>
          
          <p className="text-white/90">
            Искаш ли повече кандидати? Промотирай обявата си и я виждат <strong>до 5x повече изпълнители</strong>!
          </p>
        </div>

        {/* Packages */}
        <div className="p-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {promotionPackages.map((pkg) => {
              const Icon = pkg.icon
              const isSelected = selectedPackage === pkg.id
              
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      Популярен
                    </span>
                  )}
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    pkg.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    pkg.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{pkg.name}</h3>
                  
                  <div className="flex items-baseline gap-1 mt-1 mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pkg.price}€</span>
                    <span className="text-sm text-gray-500">/ {pkg.duration}</span>
                  </div>
                  
                  <ul className="space-y-1">
                    {pkg.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle size={20} className="text-blue-500 fill-current" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 py-4 border-y border-gray-200 dark:border-gray-700 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                <Eye size={20} className="text-blue-500" />
                5x
              </div>
              <p className="text-xs text-gray-500">повече прегледи</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                <TrendingUp size={20} className="text-green-500" />
                3x
              </div>
              <p className="text-xs text-gray-500">повече кандидати</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                <Clock size={20} className="text-orange-500" />
                2x
              </div>
              <p className="text-xs text-gray-500">по-бързо затваряне</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePromote}
              disabled={!selectedPackage || isProcessing}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedPackage 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Rocket size={18} />
              {isProcessing ? 'Обработване...' : 'Промотирай сега'}
            </button>
            <button
              onClick={handleSkip}
              className="sm:flex-1 py-3 px-6 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Пропусни засега
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Можеш да промотираш задачата и по-късно от нейната страница
          </p>
        </div>
      </div>
    </div>
  )
}

