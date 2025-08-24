'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bookmark, BookmarkCheck, Trash2, Clock, MapPin, Tag, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface SavedSearch {
  id: string
  name: string
  query: string
  category: string
  location: string
  priceMin?: string
  priceMax?: string
  urgent?: boolean
  rating?: number
  datePosted?: string
  createdAt: string
  lastUsed?: string
  useCount: number
}

interface SavedSearchesProps {
  onSearchSelect?: (search: SavedSearch) => void
  showTitle?: boolean
  maxItems?: number
}

export default function SavedSearches({ onSearchSelect, showTitle = true, maxItems }: SavedSearchesProps) {
  const router = useRouter()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadSavedSearches()
  }, [])

  const loadSavedSearches = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      // Сортиране по последно използване и честота на използване
      const sorted = saved.sort((a: SavedSearch, b: SavedSearch) => {
        if (b.lastUsed && a.lastUsed) {
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        }
        return b.useCount - a.useCount
      })
      setSavedSearches(sorted)
    } catch (error) {
      console.error('Error loading saved searches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSelect = (search: SavedSearch) => {
    // Обновяване на статистиките
    const updated = savedSearches.map(s => {
      if (s.id === search.id) {
        return {
          ...s,
          lastUsed: new Date().toISOString(),
          useCount: s.useCount + 1
        }
      }
      return s
    })
    
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))

    // Създаване на URL параметри
    const params = new URLSearchParams()
    if (search.query) params.append('search', search.query)
    if (search.category) params.append('category', search.category)
    if (search.location) params.append('location', search.location)
    if (search.priceMin) params.append('priceMin', search.priceMin)
    if (search.priceMax) params.append('priceMax', search.priceMax)
    if (search.urgent) params.append('urgent', 'true')
    if (search.rating) params.append('rating', search.rating.toString())
    if (search.datePosted) params.append('datePosted', search.datePosted)

    // Навигация към резултатите
    router.push(`/tasks?${params.toString()}`)
    
    if (onSearchSelect) {
      onSearchSelect(search)
    }

    toast.success(`Търсене "${search.name}" е приложено`)
  }

  const handleDeleteSearch = (searchId: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете това запазено търсене?')) {
      const updated = savedSearches.filter(s => s.id !== searchId)
      setSavedSearches(updated)
      localStorage.setItem('savedSearches', JSON.stringify(updated))
      toast.success('Запазеното търсене е изтрито')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Днес'
    if (diffDays === 2) return 'Вчера'
    if (diffDays <= 7) return `преди ${diffDays - 1} дни`
    
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getCategoryLabel = (category: string) => {
    const categories = [
      { value: 'repair', label: 'Ремонт' },
      { value: 'cleaning', label: 'Почистване' },
      { value: 'care', label: 'Грижа' },
      { value: 'delivery', label: 'Доставка' },
      { value: 'moving', label: 'Преместване' },
      { value: 'garden', label: 'Градинарство' },
      { value: 'dog-care', label: 'Разходка/грижа за куче' },
      { value: 'packaging', label: 'Опаковане' },
      { value: 'other', label: 'Друго' },
    ]
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const displaySearches = maxItems && !showAll ? savedSearches.slice(0, maxItems) : savedSearches

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (savedSearches.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookmarkCheck size={20} className="text-blue-600" />
            Запазени търсения
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {savedSearches.length} търсене{savedSearches.length !== 1 ? 'ния' : ''}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {displaySearches.map((search) => (
          <div
            key={search.id}
            className="group relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
            onClick={() => handleSearchSelect(search)}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteSearch(search.id)
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <Trash2 size={16} />
            </button>

            {/* Search Info */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={16} className="text-blue-600" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {search.name}
                  </h4>
                </div>

                {/* Search Details */}
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {search.query && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Търсене:</span>
                      <span className="truncate">{search.query}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    {search.category && (
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{getCategoryLabel(search.category)}</span>
                      </div>
                    )}
                    
                    {search.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{search.location}</span>
                      </div>
                    )}
                    
                    {(search.priceMin || search.priceMax) && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>
                          {search.priceMin && search.priceMax 
                            ? `${search.priceMin} - ${search.priceMax} лв`
                            : search.priceMin 
                              ? `от ${search.priceMin} лв`
                              : `до ${search.priceMax} лв`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1 mb-1">
                  <Clock size={12} />
                  <span>{formatDate(search.lastUsed || search.createdAt)}</span>
                </div>
                <div>
                  {search.useCount} използване{search.useCount !== 1 ? 'ния' : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {maxItems && savedSearches.length > maxItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors text-sm font-medium"
        >
          {showAll ? 'Покажи по-малко' : `Покажи още ${savedSearches.length - maxItems} търсения`}
        </button>
      )}
    </div>
  )
}

