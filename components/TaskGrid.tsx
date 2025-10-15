'use client'

import { useState, useEffect } from 'react'
import TaskCard from '@/components/TaskCard'
import SkeletonCard from '@/components/SkeletonCard'
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
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