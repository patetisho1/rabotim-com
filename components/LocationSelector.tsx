'use client'

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, X } from 'lucide-react'
import { BULGARIAN_CITIES, getNeighborhoodsByCity } from '@/lib/locations'

interface LocationSelectorProps {
  city: string
  neighborhood: string
  onCityChange: (city: string) => void
  onNeighborhoodChange: (neighborhood: string) => void
  required?: boolean
  showLabel?: boolean
  compact?: boolean
  className?: string
}

export default function LocationSelector({
  city,
  neighborhood,
  onCityChange,
  onNeighborhoodChange,
  required = false,
  showLabel = true,
  compact = false,
  className = ''
}: LocationSelectorProps) {
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])

  useEffect(() => {
    if (city) {
      const cityNeighborhoods = getNeighborhoodsByCity(city)
      setNeighborhoods(cityNeighborhoods)
      // Reset neighborhood if city changed and current neighborhood is not in new city
      if (neighborhood && !cityNeighborhoods.includes(neighborhood)) {
        onNeighborhoodChange('')
      }
    } else {
      setNeighborhoods([])
      if (neighborhood) {
        onNeighborhoodChange('')
      }
    }
  }, [city])

  const clearLocation = () => {
    onCityChange('')
    onNeighborhoodChange('')
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <MapPin size={16} className="text-gray-400 flex-shrink-0" />
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Избери град</option>
          {BULGARIAN_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {city && neighborhoods.length > 0 && (
          <select
            value={neighborhood}
            onChange={(e) => onNeighborhoodChange(e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Избери квартал</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
        {(city || neighborhood) && (
          <button
            type="button"
            onClick={clearLocation}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            Местоположение {required ? '*' : '(по желание)'}
          </div>
          <p className="text-xs text-gray-500 mt-1 font-normal">
            Изберете вашия град и квартал за локални обяви с предимство
          </p>
        </label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* City selector */}
        <div className="relative">
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          >
            <option value="">Изберете град</option>
            {BULGARIAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown 
            size={18} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
          />
        </div>

        {/* Neighborhood selector */}
        <div className="relative">
          <select
            value={neighborhood}
            onChange={(e) => onNeighborhoodChange(e.target.value)}
            disabled={!city || neighborhoods.length === 0}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
              !city ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            }`}
          >
            <option value="">
              {city ? 'Изберете квартал' : 'Първо изберете град'}
            </option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <ChevronDown 
            size={18} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
          />
        </div>
      </div>

      {/* Current selection display */}
      {(city || neighborhood) && (
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md">
            <MapPin size={14} />
            {city}{neighborhood ? `, ${neighborhood}` : ''}
            <button
              type="button"
              onClick={clearLocation}
              className="ml-1 text-blue-500 hover:text-blue-700"
            >
              <X size={14} />
            </button>
          </span>
        </div>
      )}
    </div>
  )
}

