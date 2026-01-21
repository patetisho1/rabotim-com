'use client'

import React, { useEffect, useState } from 'react'
import { MapPin, Navigation, Layers } from 'lucide-react'
import { Task } from '@/hooks/useTasksAPI'
import dynamic from 'next/dynamic'

// Динамично зареждане на картата за да избегнем SSR проблеми
const MapContainerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
) as any

const TileLayerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
) as any

const MarkerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
) as any

const PopupDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
) as any

interface TasksMapProps {
  tasks: Task[]
  selectedLocation?: string
  onTaskClick?: (taskId: string) => void
  height?: string
}

// Координати на градовете в България
const cityCoordinates: { [key: string]: [number, number] } = {
  'София': [42.6977, 23.3219],
  'Пловдив': [42.1354, 24.7453],
  'Варна': [43.2141, 27.9147],
  'Бургас': [42.5048, 27.4626],
  'Русе': [43.8564, 25.9656],
  'Стара Загора': [42.4258, 25.6342],
  'Плевен': [43.4170, 24.6167],
  'Сливен': [42.6824, 26.3150],
  'Добрич': [43.5667, 27.8333],
  'Шумен': [43.2706, 26.9247]
}

export default function TasksMap({ tasks, selectedLocation, onTaskClick, height = '500px' }: TasksMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [mapView, setMapView] = useState<'map' | 'list'>('list')

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Групиране на задачите по локация
  const tasksByLocation = tasks.reduce((acc, task) => {
    const city = task.location.split(',')[0].trim()
    if (!acc[city]) {
      acc[city] = []
    }
    acc[city].push(task)
    return acc
  }, {} as { [key: string]: Task[] })

  // Центриране на картата
  const getMapCenter = (): [number, number] => {
    if (selectedLocation && cityCoordinates[selectedLocation]) {
      return cityCoordinates[selectedLocation]
    }
    return [42.6977, 23.3219] // София по подразбиране
  }

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'hourly') return `${price} €/час`
    return `${price} €`
  }

  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Карта с задачи
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapView('list')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mapView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Списък
            </button>
            <button
              onClick={() => setMapView('map')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                mapView === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Layers className="h-4 w-4 inline mr-1" />
              Карта
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {mapView === 'map' ? (
        <div style={{ height }}>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <MapContainerDynamic
            center={getMapCenter()}
            zoom={selectedLocation ? 12 : 7}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayerDynamic
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Object.entries(tasksByLocation).map(([city, cityTasks]) => {
              const coords = cityCoordinates[city]
              if (!coords) return null

              return cityTasks.map((task, index) => {
                // Малко отместване за да не се припокриват маркерите
                const offset = index * 0.002
                const position: [number, number] = [coords[0] + offset, coords[1] + offset]

                return (
                  <MarkerDynamic key={task.id} position={position}>
                    <PopupDynamic>
                      <div className="p-2 min-w-[200px]">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500">{task.location}</span>
                          <span className="font-semibold text-blue-600">
                            {formatPrice(task.price, task.price_type)}
                          </span>
                        </div>
                        {task.urgent && (
                          <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full mb-2">
                            Спешно
                          </span>
                        )}
                        <button
                          onClick={() => onTaskClick && onTaskClick(task.id)}
                          className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Виж детайли
                        </button>
                      </div>
                    </PopupDynamic>
                  </MarkerDynamic>
                )
              })
            })}
          </MapContainerDynamic>
        </div>
      ) : (
        /* List View */
        <div className="p-4" style={{ maxHeight: height, overflowY: 'auto' }}>
          <div className="space-y-3">
            {Object.entries(tasksByLocation).map(([city, cityTasks]) => (
              <div key={city} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{city}</h4>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {cityTasks.length} {cityTasks.length === 1 ? 'задача' : 'задачи'}
                  </span>
                </div>
                <div className="space-y-2">
                  {cityTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick && onTaskClick(task.id)}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.urgent && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded-full">
                            Спешно
                          </span>
                        )}
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {formatPrice(task.price, task.price_type)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {cityTasks.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                      + още {cityTasks.length - 3} {cityTasks.length - 3 === 1 ? 'задача' : 'задачи'}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {Object.keys(tasksByLocation).length === 0 && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Няма задачи за показване</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Общо задачи</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {tasks.filter(t => t.urgent).length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Спешни</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.keys(tasksByLocation).length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Градове</p>
          </div>
        </div>
      </div>
    </div>
  )
}

