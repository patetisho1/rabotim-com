'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Task {
  id: number
  title: string
  location: string
  price: number
  priceType: 'fixed' | 'hourly'
  urgent: boolean
  remote: boolean
  category: string
  lat?: number
  lng?: number
}

interface GoogleMapProps {
  tasks: Task[]
  selectedLocation?: string
  onTaskClick?: (taskId: number) => void
}

// Mock координати за български градове
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'София': { lat: 42.6977, lng: 23.3219 },
  'Пловдив': { lat: 42.1354, lng: 24.7453 },
  'Варна': { lat: 43.2141, lng: 27.9147 },
  'Бургас': { lat: 42.5048, lng: 27.4626 },
  'Русе': { lat: 43.8564, lng: 25.9708 },
  'Стара Загора': { lat: 42.4257, lng: 25.6345 },
  'Плевен': { lat: 43.4167, lng: 24.6167 },
  'Сливен': { lat: 42.6814, lng: 26.3294 },
  'Добрич': { lat: 43.5722, lng: 27.8272 },
  'Шумен': { lat: 43.2706, lng: 26.9229 }
}

export default function GoogleMap({ tasks, selectedLocation, onTaskClick }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        })

        const google = await loader.load()
        
        if (!mapRef.current) return

        // Център на България
        const center = { lat: 42.7339, lng: 25.4858 }
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom: 7,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        setMap(mapInstance)
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading Google Maps:', err)
        setError('Грешка при зареждането на картата')
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (!map) return

    // Изчистване на съществуващи маркери
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Добавяне на маркери за задачите
    tasks.forEach(task => {
      // Извличане на град от локацията
      const city = Object.keys(cityCoordinates).find(city => 
        task.location.includes(city)
      )

      if (city && cityCoordinates[city]) {
        const position = cityCoordinates[city]
        
        // Създаване на маркер
        const marker = new google.maps.Marker({
          position,
          map,
          title: task.title,
          icon: {
            url: task.urgent 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">!</text>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
                </svg>
              `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }
        })

        // Info Window за маркера
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${task.title}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${task.location}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${task.category}</p>
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #3b82f6;">
                ${task.price} ${task.priceType === 'hourly' ? 'лв/час' : 'лв'}
              </p>
              ${task.urgent ? '<span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Спешно</span>' : ''}
              ${task.remote ? '<span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">Дистанционно</span>' : ''}
            </div>
          `
        })

        // Click event за маркера
        marker.addListener('click', () => {
          infoWindow.open(map, marker)
          if (onTaskClick) {
            onTaskClick(task.id)
          }
        })

        newMarkers.push(marker)
      }
    })

    setMarkers(newMarkers)

    // Центриране на картата ако е избрана локация
    if (selectedLocation && selectedLocation !== 'Всички локации' && cityCoordinates[selectedLocation]) {
      map.setCenter(cityCoordinates[selectedLocation])
      map.setZoom(10)
    }
  }, [map, tasks, selectedLocation, onTaskClick])

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-center">
          <div className="text-red-600 font-medium mb-2">Грешка при зареждането на картата</div>
          <div className="text-red-500 text-sm">{error}</div>
          <div className="text-red-400 text-xs mt-2">
            Проверете дали Google Maps API ключът е конфигуриран правилно
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Зареждане на картата...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Карта с задачи</h3>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg"
        style={{ minHeight: '384px' }}
      />
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Активни задачи:</span>
          <span className="font-semibold">{tasks.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">В избрания район:</span>
          <span className="font-semibold">{selectedLocation || 'Всички'}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Обикновени</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Спешни</span>
          </div>
        </div>
      </div>
    </div>
  )
}
