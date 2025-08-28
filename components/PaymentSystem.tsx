'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Shield,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  date: string
  paymentMethod: string
}

interface BoostPurchase {
  id: string
  taskId: string
  taskTitle: string
  boostType: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  date: string
}

export default function PaymentSystem() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [boostPurchases, setBoostPurchases] = useState<BoostPurchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'methods' | 'transactions' | 'boosts'>('methods')

  useEffect(() => {
    loadPaymentData()
  }, [])

  const loadPaymentData = () => {
    setIsLoading(true)
    
    // Симулация на данни
    setTimeout(() => {
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: '2',
          type: 'card',
          last4: '5555',
          brand: 'Mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ]

      const mockTransactions: Transaction[] = [
        {
          id: 'txn_1',
          amount: 15.00,
          currency: 'BGN',
          status: 'completed',
          description: 'Премиум Boost - Помощ при преместване',
          date: '2024-01-15T10:30:00Z',
          paymentMethod: 'Visa ****4242'
        },
        {
          id: 'txn_2',
          amount: 5.00,
          currency: 'BGN',
          status: 'completed',
          description: 'Основен Boost - Ремонт на компютър',
          date: '2024-01-10T14:20:00Z',
          paymentMethod: 'Visa ****4242'
        },
        {
          id: 'txn_3',
          amount: 25.00,
          currency: 'BGN',
          status: 'pending',
          description: 'Спешен Boost - Спешна електро инсталация',
          date: '2024-01-20T09:15:00Z',
          paymentMethod: 'Mastercard ****5555'
        }
      ]

      const mockBoostPurchases: BoostPurchase[] = [
        {
          id: 'boost_1',
          taskId: 'task_123',
          taskTitle: 'Помощ при преместване',
          boostType: 'Премиум Boost',
          amount: 15.00,
          status: 'completed',
          date: '2024-01-15T10:30:00Z'
        },
        {
          id: 'boost_2',
          taskId: 'task_456',
          taskTitle: 'Ремонт на компютър',
          boostType: 'Основен Boost',
          amount: 5.00,
          status: 'completed',
          date: '2024-01-10T14:20:00Z'
        },
        {
          id: 'boost_3',
          taskId: 'task_789',
          taskTitle: 'Спешна електро инсталация',
          boostType: 'Спешен Boost',
          amount: 25.00,
          status: 'pending',
          date: '2024-01-20T09:15:00Z'
        }
      ]

      setPaymentMethods(mockPaymentMethods)
      setTransactions(mockTransactions)
      setBoostPurchases(mockBoostPurchases)
      setIsLoading(false)
    }, 500)
  }

  const handleAddCard = () => {
    setShowAddCard(true)
    // Тук би се интегрирал Stripe Elements
  }

  const handleRemoveCard = (cardId: string) => {
    setPaymentMethods(prev => prev.filter(card => card.id !== cardId))
  }

  const handleSetDefault = (cardId: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'refunded': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />
      case 'pending': return <Clock size={16} />
      case 'failed': return <AlertCircle size={16} />
      case 'refunded': return <AlertCircle size={16} />
      default: return <AlertCircle size={16} />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Плащания</h2>
          <p className="text-gray-600">Управление на методи за плащане и транзакции</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield size={16} />
          <span>Сигурни плащания с Stripe</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('methods')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'methods'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Методи за плащане
        </button>
        <button
          onClick={() => setSelectedTab('transactions')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'transactions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Транзакции
        </button>
        <button
          onClick={() => setSelectedTab('boosts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'boosts'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Boost покупки
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'methods' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Методи за плащане</h3>
            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard size={16} />
              Добави карта
            </button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CreditCard size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Изтича {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  </div>
                  {method.isDefault && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      По подразбиране
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Направи по подразбиране
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveCard(method.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                  >
                    Премахни
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddCard && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Lock size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Stripe интеграция ще бъде добавена</p>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Затвори
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">История на транзакциите</h3>
          
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <DollarSign size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('bg-BG')} • {transaction.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    {transaction.status === 'completed' && 'Завършена'}
                    {transaction.status === 'pending' && 'В обработка'}
                    {transaction.status === 'failed' && 'Неуспешна'}
                    {transaction.status === 'refunded' && 'Върната'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'boosts' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Boost покупки</h3>
          
          <div className="space-y-4">
            {boostPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{purchase.taskTitle}</p>
                    <p className="text-sm text-gray-500">
                      {purchase.boostType} • {new Date(purchase.date).toLocaleDateString('bg-BG')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {purchase.amount.toFixed(2)} BGN
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(purchase.status)}`}>
                    {getStatusIcon(purchase.status)}
                    {purchase.status === 'completed' && 'Активен'}
                    {purchase.status === 'pending' && 'В обработка'}
                    {purchase.status === 'failed' && 'Неуспешен'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

