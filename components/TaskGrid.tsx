'use client'

import { useState, useEffect } from 'react'
import TaskCard from '@/components/TaskCard'
import { Task } from '@/hooks/useTasksAPI'

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
      
      // Use tasks from localStorage
      setTasks(savedTasks.slice(0, 6))
    } catch (error) {
      console.error('Грешка при зареждането на задачите:', error)
      setTasks([])
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-32 sm:h-48 bg-gray-200 dark:bg-gray-700 animate-shimmer"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-shimmer"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-shimmer"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
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