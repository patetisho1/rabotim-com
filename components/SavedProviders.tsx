'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  MessageCircle,
  Calendar,
  CheckCircle,
  X,
  Search,
  Filter,
  Plus,
  User,
  Phone
} from 'lucide-react'

interface SavedProvider {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userRating: number
  userCompletedTasks: number
  userIsVerified: boolean
  userLocation: string
  userSkills: string[]
  lastWorkedWith: string
  lastTaskAmount: number
  lastTaskTitle: string
  totalWorkedHours: number
  totalEarnings: number
  isAvailable: boolean
  savedAt: string
  notes: string
}

interface SavedProvidersProps {
  onProviderSelect: (provider: SavedProvider) => void
  onRemoveProvider: (providerId: string) => void
  onAddNote: (providerId: string, note: string) => void
}

export default function SavedProviders({
  onProviderSelect,
  onRemoveProvider,
  onAddNote
}: SavedProvidersProps) {
  const [providers, setProviders] = useState<SavedProvider[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddNote, setShowAddNote] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    // Симулираме зареждане на запазени изпълнители
    const mockProviders: SavedProvider[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Иван Петров',
        userAvatar: '/api/placeholder/60/60',
        userRating: 4.8,
        userCompletedTasks: 156,
        userIsVerified: true,
        userLocation: 'София',
        userSkills: ['Ремонт', 'Електрика', 'Водопровод'],
        lastWorkedWith: '2024-02-15',
        lastTaskAmount: 450,
        lastTaskTitle: 'Ремонт на баня',
        totalWorkedHours: 24,
        totalEarnings: 1800,
        isAvailable: true,
        savedAt: '2024-01-10',
        notes: 'Отличен майстор, работи качествено и навреме. Препоръчвам за сложни ремонти.'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Мария Георгиева',
        userAvatar: '/api/placeholder/60/60',
        userRating: 4.9,
        userCompletedTasks: 89,
        userIsVerified: true,
        userLocation: 'София',
        userSkills: ['Почистване', 'Грижа за деца', 'Готвене'],
        lastWorkedWith: '2024-03-01',
        lastTaskAmount: 120,
        lastTaskTitle: 'Почистване на апартамент',
        totalWorkedHours: 12,
        totalEarnings: 480,
        isAvailable: true,
        savedAt: '2024-02-20',
        notes: 'Много внимателна и прецизна. Идеална за редовно почистване.'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Петър Димитров',
        userAvatar: '/api/placeholder/60/60',
        userRating: 4.6,
        userCompletedTasks: 234,
        userIsVerified: true,
        userLocation: 'София',
        userSkills: ['Транспорт', 'Доставка', 'Преместване'],
        lastWorkedWith: '2024-01-25',
        lastTaskAmount: 200,
        lastTaskTitle: 'Преместване на мебели',
        totalWorkedHours: 8,
        totalEarnings: 400,
        isAvailable: false,
        savedAt: '2024-01-05',
        notes: 'Надежден за транспортни услуги. Има собствен автомобил.'
      }
    ]
    setProviders(mockProviders)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const handleAddNote = (providerId: string) => {
    if (newNote.trim()) {
      onAddNote(providerId, newNote)
      setProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, notes: newNote }
          : provider
      ))
      setNewNote('')
      setShowAddNote(null)
    }
  }

  const handleRemoveProvider = (providerId: string) => {
    onRemoveProvider(providerId)
    setProviders(prev => prev.filter(provider => provider.id !== providerId))
  }

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.userSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || 
                           provider.userSkills.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase()))
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'ремонт', 'почистване', 'транспорт', 'грижа', 'друго']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Запазени изпълнители
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Бързо наемане на проверени изпълнители
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              {providers.length} запазени
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Търси по име или умения..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'Всички' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map(provider => (
          <div
            key={provider.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Provider Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={provider.userAvatar}
                      alt={provider.userName}
                      className="w-12 h-12 rounded-full"
                    />
                    {provider.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {provider.userName}
                      </h3>
                      {provider.userIsVerified && (
                        <CheckCircle size={16} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        {renderStars(provider.userRating)}
                        <span>{provider.userRating}</span>
                      </div>
                      <span>•</span>
                      <span>{provider.userCompletedTasks} задачи</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveProvider(provider.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Provider Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={14} />
                <span>{provider.userLocation}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {provider.userSkills.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
                {provider.userSkills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                    +{provider.userSkills.length - 3}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Последна работа</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(provider.lastWorkedWith).toLocaleDateString('bg-BG')}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Сума</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {provider.lastTaskAmount} лв.
                  </div>
                </div>
              </div>

              {provider.notes && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {provider.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onProviderSelect(provider)}
                  disabled={!provider.isAvailable}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Plus size={14} />
                  Наеми отново
                </button>
                
                <button
                  onClick={() => setShowAddNote(provider.id)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Бележка
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Добави бележка
              </h3>
              
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Добавете бележка за този изпълнител..."
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
              
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowAddNote(null)
                    setNewNote('')
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Откажи
                </button>
                <button
                  onClick={() => handleAddNote(showAddNote)}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Запази
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Няма запазени изпълнители
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Запазете изпълнители, с които сте работили, за бързо наемане в бъдеще.
          </p>
        </div>
      )}
    </div>
  )
}
