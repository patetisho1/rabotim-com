'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, MapPin, Calendar, DollarSign, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import LocationPicker from '../../components/LocationPicker'
import FileUpload from '../../components/FileUpload'

export default function PostTaskPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConvertingFiles, setIsConvertingFiles] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    price: '',
    priceType: 'hourly', // hourly или fixed
    date: '',
    time: '',
    urgent: false,
    attachments: [] as File[]
  })

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

  const locations = [
    { value: 'sofia', label: 'София' },
    { value: 'plovdiv', label: 'Пловдив' },
    { value: 'varna', label: 'Варна' },
    { value: 'burgas', label: 'Бургас' },
    { value: 'ruse', label: 'Русе' },
    { value: 'stara-zagora', label: 'Стара Загора' },
    { value: 'pleven', label: 'Плевен' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Проверка дали потребителят е влязъл
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!isLoggedIn || !user.id) {
        toast.error('Трябва да сте влезли в акаунта си за да публикувате задача')
        router.push('/login')
        return
      }

      // Валидация
      if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.price) {
        toast.error('Моля, попълнете всички задължителни полета')
        return
      }

      // Валидация на заглавието
      if (formData.title.length < 10) {
        toast.error('Заглавието трябва да бъде поне 10 символа')
        return
      }

      if (formData.title.length > 100) {
        toast.error('Заглавието не може да бъде повече от 100 символа')
        return
      }

      // Валидация на описанието
      if (formData.description.length < 20) {
        toast.error('Описанието трябва да бъде поне 20 символа')
        return
      }

      if (formData.description.length > 1000) {
        toast.error('Описанието не може да бъде повече от 1000 символа')
        return
      }

      // Валидация на цената
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        toast.error('Моля, въведете валидна цена')
        return
      }

      if (price > 10000) {
        toast.error('Цената не може да бъде повече от 10,000 лв')
        return
      }

      // Валидация на датата (ако е въведена)
      if (formData.date) {
        const selectedDate = new Date(formData.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
          toast.error('Датата не може да бъде в миналото')
          return
        }
      }

      // Конвертиране на файловете в base64 за запазване в localStorage
      setIsConvertingFiles(true)
      const attachmentsWithBase64 = await Promise.all(
        formData.attachments.map(async (file) => {
          return new Promise<{
            name: string
            size: number
            type: string
            url: string
          }>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                url: reader.result as string // base64 string
              })
            }
            reader.readAsDataURL(file)
          })
        })
      )
      setIsConvertingFiles(false)

      // Създаване на нова задача
      const newTask = {
        id: Date.now(),
        ...formData,
        price: price,
        attachments: attachmentsWithBase64,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          rating: user.rating || 0,
          completedTasks: user.completedTasks || 0,
          avatar: user.avatar || '/api/placeholder/40/40'
        },
        status: 'active',
        applications: [],
        createdAt: new Date().toISOString(),
        urgent: formData.urgent
      }

      // Запазване в localStorage
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      existingTasks.unshift(newTask)
      localStorage.setItem('tasks', JSON.stringify(existingTasks))

      // Добавяне към потребителските задачи
      const userTasks = JSON.parse(localStorage.getItem(`userTasks_${user.id}`) || '[]')
      userTasks.push(newTask.id)
      localStorage.setItem(`userTasks_${user.id}`, JSON.stringify(userTasks))

      toast.success('Задачата е публикувана успешно!')
      
      // Пренасочване към списъка с задачи
      setTimeout(() => {
        router.push('/tasks')
      }, 1500)

    } catch (error) {
      toast.error('Възникна грешка при публикуването')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Публикувай задача
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Основна информация
            </h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заглавие на задачата *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Напр. Помощ при преместване, Почистване на апартамент"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Опишете подробно какво се изисква, колко време ще отнеме, специфични изисквания..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Изберете категория</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Price */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Локация и цена
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Локация *
                </label>
                <LocationPicker
                  value={formData.location}
                  onChange={(location) => handleInputChange('location', location)}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={formData.priceType}
                    onChange={(e) => handleInputChange('priceType', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="hourly">лв/час</option>
                    <option value="fixed">лв</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Дата и час
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Час
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Urgent */}
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={(e) => handleInputChange('urgent', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Спешна задача
                </span>
              </label>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Прикачени файлове
            </h2>
            <FileUpload
              onFilesChange={(files) => handleInputChange('attachments', files)}
              maxFiles={5}
              maxSize={10}
              acceptedTypes={['image/*', '.pdf', '.doc', '.docx']}
              label="Прикачи файлове към задачата"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isConvertingFiles}
              className="btn btn-primary flex items-center gap-2 px-8 py-3 text-lg disabled:opacity-50"
            >
              {isConvertingFiles ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Обработка на файлове...
                </>
              ) : isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Публикуване...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Публикувай задача
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 