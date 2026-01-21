'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget: number
  created_at: string
  images?: string[]
}

interface RelatedTasksProps {
  currentTaskId: string
  category: string
  location?: string
  limit?: number
  className?: string
}

const categoryLabels: Record<string, string> = {
  'cleaning': 'Почистване',
  'handyman': 'Майсторски услуги',
  'moving': 'Преместване',
  'delivery': 'Доставки',
  'gardening': 'Градинарство',
  'assembly': 'Сглобяване',
  'painting': 'Боядисване',
  'plumbing': 'ВиК услуги',
  'electrical': 'Електро услуги',
  'tutoring': 'Уроци',
  'pet-care': 'Грижа за домашни любимци',
  'tech-help': 'Техническа помощ',
  'other': 'Други',
}

export default function RelatedTasks({
  currentTaskId,
  category,
  location,
  limit = 4,
  className = ''
}: RelatedTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedTasks() {
      try {
        // Build query params
        const params = new URLSearchParams({
          category,
          limit: String(limit + 1), // Fetch one extra in case current task is included
          status: 'open'
        })
        
        if (location) {
          params.append('location', location)
        }

        const response = await fetch(`/api/tasks?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        
        // Filter out current task and limit to requested amount
        const filtered = (data.tasks || data)
          .filter((task: Task) => task.id !== currentTaskId)
          .slice(0, limit)
        
        setTasks(filtered)
      } catch (error) {
        logger.error('Error fetching related tasks', error as Error)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedTasks()
  }, [currentTaskId, category, location, limit])

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Подобни задачи
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return null
  }

  const categoryLabel = categoryLabels[category] || category

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Подобни задачи в {categoryLabel}
        </h3>
        <Link 
          href={`/tasks?category=${category}`}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
        >
          Виж всички
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all overflow-hidden"
          >
            <div className="flex">
              {/* Image */}
              {task.images && task.images[0] && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={task.images[0]}
                    alt={task.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="p-3 flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {task.title}
                </h4>
                
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {task.location}
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {task.budget} €
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* SEO: Additional category links */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Търсите друго? Разгледайте още:
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels)
            .filter(([key]) => key !== category)
            .slice(0, 5)
            .map(([key, label]) => (
              <Link
                key={key}
                href={`/tasks?category=${key}`}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}

// Compact version for sidebars
export function RelatedTasksCompact({
  currentTaskId,
  category,
  limit = 3,
  className = ''
}: Omit<RelatedTasksProps, 'location'>) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedTasks() {
      try {
        const response = await fetch(`/api/tasks?category=${category}&limit=${limit + 1}&status=open`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        const filtered = (data.tasks || data)
          .filter((task: Task) => task.id !== currentTaskId)
          .slice(0, limit)
        
        setTasks(filtered)
      } catch (error) {
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedTasks()
  }, [currentTaskId, category, limit])

  if (loading || tasks.length === 0) return null

  return (
    <div className={`${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Още задачи
      </h4>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link
              href={`/tasks/${task.id}`}
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
            >
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

