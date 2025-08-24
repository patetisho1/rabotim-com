'use client'

import { useState, useEffect } from 'react'
import TaskCard from '@/components/TaskCard'

interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  priceType: 'hourly' | 'fixed'
  urgent: boolean
  rating: number
  reviewCount: number
  postedBy: string
  postedDate: string
  views: number
  applications: number
  attachments?: Attachment[]
}

interface TaskGridProps {
  tasks?: Task[]
}

export default function TaskGrid({ tasks: propTasks }: TaskGridProps = {}) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (propTasks) {
      setTasks(propTasks)
    } else {
      loadTasks()
    }
  }, [propTasks])

  const loadTasks = () => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      
      // If no tasks in localStorage, use sample data
      if (savedTasks.length === 0) {
        const sampleTasks: Task[] = [
          {
            id: '1',
            title: 'Почистване на апартамент',
            description: 'Търся надежден човек за почистване на 3-стаен апартамент. Работата включва почистване на всички стаи, баня и кухня. Имам домашни любимци.',
            category: 'cleaning',
            location: 'София, Лозенец',
            price: 25,
            priceType: 'hourly',
            urgent: true,
            rating: 4.8,
            reviewCount: 127,
            postedBy: 'Мария Петрова',
            postedDate: '2024-01-15T10:30:00Z',
            views: 45,
            applications: 8,
            attachments: [
              {
                name: 'apartment1.jpg',
                size: 1024000,
                type: 'image/jpeg',
                url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
              },
              {
                name: 'apartment2.jpg',
                size: 980000,
                type: 'image/jpeg',
                url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
              }
            ]
          },
          {
            id: '2',
            title: 'Ремонт на баня',
            description: 'Нужен е опитен майстор за пълна реконструкция на баня. Включва замяна на плочки, санитария и инсталации.',
            category: 'repair',
            location: 'Пловдив, Център',
            price: 1500,
            priceType: 'fixed',
            urgent: false,
            rating: 4.9,
            reviewCount: 89,
            postedBy: 'Иван Димитров',
            postedDate: '2024-01-14T14:20:00Z',
            views: 32,
            applications: 5,
            attachments: [
              {
                name: 'bathroom1.jpg',
                size: 1200000,
                type: 'image/jpeg',
                url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop'
              }
            ]
          },
          {
            id: '3',
            title: 'Разходка с кучето ми',
            description: 'Търся човек за ежедневна разходка с моя лабрадор. Кучето е спокойно и послушно. Работата е за 1 час дневно.',
            category: 'dog-care',
            location: 'Варна, Морска градина',
            price: 20,
            priceType: 'hourly',
            urgent: false,
            rating: 4.7,
            reviewCount: 156,
            postedBy: 'Елена Стоянова',
            postedDate: '2024-01-13T09:15:00Z',
            views: 28,
            applications: 12,
            attachments: [
              {
                name: 'dog1.jpg',
                size: 850000,
                type: 'image/jpeg',
                url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop'
              },
              {
                name: 'dog2.jpg',
                size: 920000,
                type: 'image/jpeg',
                url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop'
              }
            ]
          }
        ]
        setTasks(sampleTasks.slice(0, 6))
      } else {
        // Transform old task format to new format if needed
        const transformedTasks = savedTasks.map((task: any) => ({
          id: task.id?.toString() || Math.random().toString(),
          title: task.title || 'Задача',
          description: task.description || '',
          category: task.category || 'other',
          location: task.location || 'Неизвестно',
          price: typeof task.price === 'number' ? task.price : parseFloat(task.price?.replace(/[^\d.]/g, '') || '0'),
          priceType: task.priceType || 'hourly',
          urgent: task.urgent || false,
          rating: task.rating || task.user?.rating || 4.5,
          reviewCount: task.reviewCount || Math.floor(Math.random() * 100) + 10,
          postedBy: task.postedBy || task.user?.name || 'Потребител',
          postedDate: task.postedDate || task.createdAt || new Date().toISOString(),
          views: task.views || Math.floor(Math.random() * 50) + 10,
          applications: task.applications || Math.floor(Math.random() * 10) + 1,
          attachments: task.attachments || []
        }))
        setTasks(transformedTasks.slice(0, 6))
      }
    } catch (error) {
      console.error('Грешка при зареждането на задачите:', error)
      // Fallback to sample data
      const fallbackTasks: Task[] = [
        {
          id: 'fallback1',
          title: 'Почистване на апартамент',
          description: 'Търся надежден човек за почистване на 3-стаен апартамент.',
          category: 'cleaning',
          location: 'София',
          price: 25,
          priceType: 'hourly',
          urgent: true,
          rating: 4.8,
          reviewCount: 127,
          postedBy: 'Мария Петрова',
          postedDate: '2024-01-15T10:30:00Z',
          views: 45,
          applications: 8,
          attachments: [
            {
              name: 'apartment1.jpg',
              size: 1024000,
              type: 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
            }
          ]
        }
      ]
      setTasks(fallbackTasks)
    }
  }

  const getCategoryLabel = (categoryValue: string) => {
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
    const category = categories.find(cat => cat.value === categoryValue)
    return category ? category.label : categoryValue
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-shimmer"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-shimmer"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-shimmer"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={{
            ...task,
            category: getCategoryLabel(task.category)
          }}
        />
      ))}
    </div>
  )
} 