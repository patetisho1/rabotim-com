'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Clock, 
  MessageCircle, 
  Star, 
  CheckCircle,
  Send,
  Calendar,
  MapPin,
  User,
  Award
} from 'lucide-react'

interface Bid {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userRating: number
  userCompletedTasks: number
  userIsVerified: boolean
  amount: number
  message: string
  estimatedTime: string
  proposedDate: string
  isAccepted: boolean
  isRejected: boolean
  createdAt: string
  attachments: string[]
}

interface BiddingSystemProps {
  taskId: string
  taskTitle: string
  taskBudget: {
    min: number
    max: number
    type: 'hourly' | 'fixed'
  }
  onBidSubmit: (bid: Omit<Bid, 'id' | 'createdAt'>) => void
  onBidAccept: (bidId: string) => void
  onBidReject: (bidId: string) => void
}

export default function BiddingSystem({ 
  taskId, 
  taskTitle, 
  taskBudget, 
  onBidSubmit, 
  onBidAccept, 
  onBidReject 
}: BiddingSystemProps) {
  const [bids, setBids] = useState<Bid[]>([])
  const [showBidForm, setShowBidForm] = useState(false)
  const [newBid, setNewBid] = useState({
    amount: taskBudget.min,
    message: '',
    estimatedTime: '',
    proposedDate: '',
    attachments: [] as File[]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Симулираме зареждане на оферти
    const mockBids: Bid[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Иван Петров',
        userAvatar: '/api/placeholder/40/40',
        userRating: 4.8,
        userCompletedTasks: 156,
        userIsVerified: true,
        amount: 450,
        message: 'Здравейте! Имам голям опит в ремонтни дейности. Мога да започна работа утре и да завърша в рамките на 2-3 дни. Работя качествено и навреме.',
        estimatedTime: '2-3 дни',
        proposedDate: '2024-03-20',
        isAccepted: false,
        isRejected: false,
        createdAt: '2024-03-18T10:30:00Z',
        attachments: []
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Петър Димитров',
        userAvatar: '/api/placeholder/40/40',
        userRating: 4.6,
        userCompletedTasks: 89,
        userIsVerified: true,
        amount: 380,
        message: 'Добър ден! Специализиран съм в електрически инсталации. Мога да започна следващата седмица.',
        estimatedTime: '1-2 дни',
        proposedDate: '2024-03-25',
        isAccepted: false,
        isRejected: false,
        createdAt: '2024-03-18T11:15:00Z',
        attachments: []
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Георги Стоянов',
        userAvatar: '/api/placeholder/40/40',
        userRating: 4.9,
        userCompletedTasks: 234,
        userIsVerified: true,
        amount: 520,
        message: 'Здравейте! Имам 15+ години опит. Гарантирам качествена работа и мога да започна веднага.',
        estimatedTime: '3-4 дни',
        proposedDate: '2024-03-19',
        isAccepted: false,
        isRejected: false,
        createdAt: '2024-03-18T12:00:00Z',
        attachments: []
      }
    ]
    setBids(mockBids)
  }, [])

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Симулираме изпращане на оферта
      await new Promise(resolve => setTimeout(resolve, 1000))

      const bidData = {
        userId: 'current-user',
        userName: 'Текущ потребител',
        userAvatar: '/api/placeholder/40/40',
        userRating: 4.7,
        userCompletedTasks: 45,
        userIsVerified: true,
        amount: newBid.amount,
        message: newBid.message,
        estimatedTime: newBid.estimatedTime,
        proposedDate: newBid.proposedDate,
        isAccepted: false,
        isRejected: false,
        attachments: newBid.attachments.map(f => f.name)
      }

      onBidSubmit(bidData)
      
      // Добавяме новата оферта към списъка
      const newBidWithId: Bid = {
        ...bidData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      setBids(prev => [newBidWithId, ...prev])
      setShowBidForm(false)
      setNewBid({
        amount: taskBudget.min,
        message: '',
        estimatedTime: '',
        proposedDate: '',
        attachments: []
      })
    } catch (error) {
      console.error('Error submitting bid:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptBid = (bidId: string) => {
    setBids(prev => prev.map(bid => 
      bid.id === bidId 
        ? { ...bid, isAccepted: true, isRejected: false }
        : { ...bid, isAccepted: false, isRejected: false }
    ))
    onBidAccept(bidId)
  }

  const handleRejectBid = (bidId: string) => {
    setBids(prev => prev.map(bid => 
      bid.id === bidId 
        ? { ...bid, isRejected: true, isAccepted: false }
        : bid
    ))
    onBidReject(bidId)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Оферти за задачата
          </h2>
          <button
            onClick={() => setShowBidForm(!showBidForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showBidForm ? 'Откажи' : 'Направи оферта'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bids.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Общо оферти
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bids.length > 0 ? Math.min(...bids.map(b => b.amount)) : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Най-ниска оферта (лв.)
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Най-висока оферта (лв.)
            </div>
          </div>
        </div>
      </div>

      {/* Bid Form */}
      {showBidForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Направи оферта за "{taskTitle}"
          </h3>
          
          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Вашата цена (лв.)
                </label>
                <input
                  type="number"
                  value={newBid.amount}
                  onChange={(e) => setNewBid(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min={taskBudget.min}
                  max={taskBudget.max}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Бюджет: {taskBudget.min} - {taskBudget.max} лв.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Предполагаемо време
                </label>
                <input
                  type="text"
                  value={newBid.estimatedTime}
                  onChange={(e) => setNewBid(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="напр. 2-3 дни"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Предлагана дата за започване
              </label>
              <input
                type="date"
                value={newBid.proposedDate}
                onChange={(e) => setNewBid(prev => ({ ...prev, proposedDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Съобщение към клиента
              </label>
              <textarea
                value={newBid.message}
                onChange={(e) => setNewBid(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Опишете защо сте подходящ за тази задача, вашия опит, подход и т.н."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Откажи
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Изпращане...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Изпрати оферта
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bids List */}
      <div className="space-y-4">
        {bids.map(bid => (
          <div
            key={bid.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-2 ${
              bid.isAccepted 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : bid.isRejected 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={bid.userAvatar}
                  alt={bid.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {bid.userName}
                    </h4>
                    {bid.userIsVerified && (
                      <CheckCircle size={16} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      {renderStars(bid.userRating)}
                      <span>{bid.userRating}</span>
                    </div>
                    <span>•</span>
                    <span>{bid.userCompletedTasks} задачи</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bid.amount} лв.
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {taskBudget.type === 'hourly' ? 'на час' : 'общо'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock size={16} />
                <span>Време: {bid.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>Започва: {new Date(bid.proposedDate).toLocaleDateString('bg-BG')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle size={16} />
                <span>{formatDate(bid.createdAt)}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                {bid.message}
              </p>
            </div>

            {!bid.isAccepted && !bid.isRejected && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleRejectBid(bid.id)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Откажи
                </button>
                <button
                  onClick={() => handleAcceptBid(bid.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Приеми оферта
                </button>
              </div>
            )}

            {bid.isAccepted && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle size={20} />
                <span className="font-medium">Офертата е приета!</span>
              </div>
            )}

            {bid.isRejected && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="font-medium">Офертата е отказана</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {bids.length === 0 && !showBidForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Все още няма оферти
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Бъдете първият, който ще направи оферта за тази задача!
          </p>
          <button
            onClick={() => setShowBidForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Направи оферта
          </button>
        </div>
      )}
    </div>
  )
}

