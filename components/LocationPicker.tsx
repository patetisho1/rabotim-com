'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Search, X, CheckCircle, Clock, Star, Home, Building2 } from 'lucide-react'

interface Location {
  id: string
  name: string
  address: string
  distance?: number
  type: 'home' | 'work' | 'favorite' | 'recent'
  coordinates?: {
    lat: number
    lng: number
  }
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void
  onClose?: () => void
  currentLocation?: Location
  showMap?: boolean
}

export default function LocationPicker({ 
  onLocationSelect, 
  onClose, 
  currentLocation,
  showMap = false 
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [recentLocations, setRecentLocations] = useState<Location[]>([])
  const [favoriteLocations, setFavoriteLocations] = useState<Location[]>([])
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [showMapView, setShowMapView] = useState(showMap)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load saved locations from localStorage
    const savedRecent = JSON.parse(localStorage.getItem('recentLocations') || '[]')
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteLocations') || '[]')
    
    setRecentLocations(savedRecent.slice(0, 5))
    setFavoriteLocations(savedFavorites)

    // Focus search input on mobile
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const getCurrentLocation = () => {
    setIsLoading(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          
          // Reverse geocoding to get address
          reverseGeocode(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      console.error('Geolocation not supported')
      setIsLoading(false)
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      const location: Location = {
        id: `current-${Date.now()}`,
        name: 'Текущо местоположение',
        address: data.display_name,
        type: 'recent',
        coordinates: { lat, lng }
      }
      
      addToRecentLocations(location)
      onLocationSelect(location)
      setIsLoading(false)
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      setIsLoading(false)
    }
  }

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    try {
      // Using OpenStreetMap Nominatim API for search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=bg&limit=10`
      )
      const data = await response.json()
      
      const results: Location[] = data.map((item: any, index: number) => ({
        id: `search-${index}`,
        name: item.display_name.split(',')[0],
        address: item.display_name,
        type: 'recent',
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }))
      
      setSearchResults(results)
    } catch (error) {
      console.error('Location search failed:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const addToRecentLocations = (location: Location) => {
    const updated = [location, ...recentLocations.filter(l => l.id !== location.id)].slice(0, 5)
    setRecentLocations(updated)
    localStorage.setItem('recentLocations', JSON.stringify(updated))
  }

  const toggleFavorite = (location: Location) => {
    const isFavorite = favoriteLocations.some(l => l.id === location.id)
    
    if (isFavorite) {
      const updated = favoriteLocations.filter(l => l.id !== location.id)
      setFavoriteLocations(updated)
      localStorage.setItem('favoriteLocations', JSON.stringify(updated))
    } else {
      const updated = [...favoriteLocations, { ...location, type: 'favorite' as const }]
      setFavoriteLocations(updated)
      localStorage.setItem('favoriteLocations', JSON.stringify(updated))
    }
  }

  const handleLocationSelect = (location: Location) => {
    addToRecentLocations(location)
    onLocationSelect(location)
    onClose?.()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocations(searchQuery)
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={16} className="text-blue-600" />
      case 'work':
        return <Building2 size={16} className="text-green-600" />
      case 'favorite':
        return <Star size={16} className="text-yellow-600 fill-current" />
      case 'recent':
        return <Clock size={16} className="text-gray-600" />
      default:
        return <MapPin size={16} className="text-gray-600" />
    }
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    if (distance < 1000) return `${Math.round(distance)}м`
    return `${(distance / 1000).toFixed(1)}км`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Избери локация
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Търси адрес, улица, град..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.trim()) {
                    searchLocations(e.target.value)
                  } else {
                    setSearchResults([])
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
              />
            </div>
            
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors min-h-[48px] touch-manipulation"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Определяне...
                </>
              ) : (
                <>
                  <Navigation size={18} />
                  Използвай текущото местоположение
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Резултати от търсенето
              </h4>
              <div className="space-y-2">
                {searchResults.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[56px] touch-manipulation"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {location.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {location.address}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Locations */}
          {favoriteLocations.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Любими локации
              </h4>
              <div className="space-y-2">
                {favoriteLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[56px] touch-manipulation"
                  >
                    <button
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-start gap-3 flex-1 text-left"
                    >
                      {getLocationIcon(location.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {location.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {location.address}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => toggleFavorite(location)}
                      className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      <Star size={16} className="fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Locations */}
          {recentLocations.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Последни локации
              </h4>
              <div className="space-y-2">
                {recentLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[56px] touch-manipulation"
                  >
                    <button
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-start gap-3 flex-1 text-left"
                    >
                      {getLocationIcon(location.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {location.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {location.address}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => toggleFavorite(location)}
                      className={`p-2 transition-colors ${
                        favoriteLocations.some(l => l.id === location.id)
                          ? 'text-yellow-600'
                          : 'text-gray-400 hover:text-yellow-600'
                      }`}
                    >
                      <Star size={16} className={favoriteLocations.some(l => l.id === location.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Бързи действия
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const homeLocation: Location = {
                    id: 'home',
                    name: 'Дом',
                    address: 'Домашен адрес',
                    type: 'home'
                  }
                  handleLocationSelect(homeLocation)
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[80px] touch-manipulation"
              >
                <Home size={24} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Дом</span>
              </button>
              
              <button
                onClick={() => {
                  const workLocation: Location = {
                    id: 'work',
                    name: 'Работа',
                    address: 'Работен адрес',
                    type: 'work'
                  }
                  handleLocationSelect(workLocation)
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[80px] touch-manipulation"
              >
                <Building2 size={24} className="text-green-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Работа</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 