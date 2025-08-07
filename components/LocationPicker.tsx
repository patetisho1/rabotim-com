'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Loader2 } from 'lucide-react'

interface LocationPickerProps {
  value: string
  onChange: (location: string) => void
  placeholder?: string
}

export default function LocationPicker({ value, onChange, placeholder = "Изберете локация" }: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locations = [
    { value: '', label: 'Всички локации' },
    { value: 'sofia', label: 'София' },
    { value: 'plovdiv', label: 'Пловдив' },
    { value: 'varna', label: 'Варна' },
    { value: 'burgas', label: 'Бургас' },
    { value: 'ruse', label: 'Русе' },
    { value: 'stara-zagora', label: 'Стара Загора' },
    { value: 'pleven', label: 'Плевен' },
    { value: 'sliven', label: 'Сливен' },
    { value: 'dobrich', label: 'Добрич' },
    { value: 'shumen', label: 'Шумен' },
    { value: 'pernik', label: 'Перник' },
    { value: 'haskovo', label: 'Хасково' },
    { value: 'yambol', label: 'Ямбол' },
    { value: 'pazardzhik', label: 'Пазарджик' },
    { value: 'blagoevgrad', label: 'Благоевград' },
    { value: 'veliko-tarnovo', label: 'Велико Търново' },
    { value: 'vratsa', label: 'Враца' },
    { value: 'gabrovo', label: 'Габрово' },
    { value: 'asenovgrad', label: 'Асеновград' },
    { value: 'vidin', label: 'Видин' },
    { value: 'kardzhali', label: 'Кърджали' },
    { value: 'kyustendil', label: 'Кюстендил' },
    { value: 'montana', label: 'Монтана' },
    { value: 'lovech', label: 'Ловеч' },
    { value: 'razgrad', label: 'Разград' },
    { value: 'silistra', label: 'Силистра' },
    { value: 'targovishte', label: 'Търговище' },
    { value: 'smolyan', label: 'Смолян' },
  ]

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Геолокацията не се поддържа в този браузър')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Симулация на обратно геокодиране
        // В реален проект тук ще се използва Google Maps API или подобна услуга
        setTimeout(() => {
          // Проста логика за определяне на най-близкия град
          const nearestCity = findNearestCity(latitude, longitude)
          onChange(nearestCity)
          setIsLoading(false)
        }, 1000)
      },
      (error) => {
        setIsLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Достъпът до геолокацията е отказан')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Информацията за местоположението не е налична')
            break
          case error.TIMEOUT:
            setError('Времето за заявката изтече')
            break
          default:
            setError('Възникна грешка при определяне на местоположението')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const findNearestCity = (lat: number, lng: number): string => {
    // Прости координати на български градове
    const cities = [
      { name: 'sofia', lat: 42.6977, lng: 23.3219 },
      { name: 'plovdiv', lat: 42.1354, lng: 24.7453 },
      { name: 'varna', lat: 43.2141, lng: 27.9147 },
      { name: 'burgas', lat: 42.5048, lng: 27.4626 },
      { name: 'ruse', lat: 43.8564, lng: 25.9708 },
      { name: 'stara-zagora', lat: 42.4254, lng: 25.6345 },
      { name: 'pleven', lat: 43.4170, lng: 24.6169 },
    ]

    let nearestCity = 'sofia'
    let minDistance = Infinity

    cities.forEach(city => {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestCity = city.name
      }
    })

    return nearestCity
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Определи моята локация"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Navigation size={20} />
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {value && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Избрана локация: {locations.find(loc => loc.value === value)?.label}
        </p>
      )}
    </div>
  )
} 