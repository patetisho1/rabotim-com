'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { Task } from '@/hooks/useTasksAPI'

interface GoogleMapProps {
  tasks: Task[]
  selectedLocation?: string
  onTaskClick?: (taskId: string) => void
}

export default function GoogleMap({ tasks, selectedLocation, onTaskClick }: GoogleMapProps) {
  const urgentTasks = tasks.filter(task => task.urgent)
  const regularTasks = tasks.filter(task => !task.urgent)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Карта с задачи</h3>
      
      {/* Fallback UI вместо Google Maps */}
      <div className="bg-gray-50 rounded-lg p-6 text-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Карта с задачи</h4>
        <p className="text-gray-600 text-sm mb-4">
          Визуализирайте задачите по локация и намерете перфектната възможност близо до вас
        </p>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-blue-800 text-sm font-medium">Функцията ще бъде добавена скоро!</p>
          <p className="text-blue-600 text-xs mt-1">Използвайте филтрите за намиране на задачи</p>
        </div>
      </div>

      {/* Статистики */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Общо задачи:</span>
          <span className="font-semibold">{tasks.length}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">В избрания район:</span>
          <span className="font-semibold">{selectedLocation || 'Всички'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Спешни задачи:</span>
          <span className="font-semibold text-red-600">{urgentTasks.length}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Обикновени задачи:</span>
          <span className="font-semibold text-blue-600">{regularTasks.length}</span>
        </div>
      </div>

      {/* Легенда */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Легенда:</h5>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Обикновени задачи</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Спешни задачи</span>
          </div>
        </div>
      </div>

      {/* Съвети */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 text-xs">
          💡 <strong>Съвет:</strong> Използвайте филтрите по локация и категория за по-бързо намиране на подходящи задачи
        </p>
      </div>
    </div>
  )
}
