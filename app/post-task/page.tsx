'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  DollarSign,
  CheckCircle,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import ErrorBoundary from '@/components/ErrorBoundary'

const categories = [
  { value: 'repair', label: 'Ремонт' },
  { value: 'cleaning', label: 'Почистване' },
  { value: 'delivery', label: 'Доставка' },
  { value: 'tutoring', label: 'Обучение' },
  { value: 'garden', label: 'Градинарство' },
  { value: 'it-services', label: 'IT услуги' },
  { value: 'moving', label: 'Преместване' },
  { value: 'assembly', label: 'Сглобяване' },
  { value: 'care', label: 'Грижа' },
  { value: 'other', label: 'Друго' }
]

const locations = [
  { value: 'София', label: 'София' },
  { value: 'Пловдив', label: 'Пловдив' },
  { value: 'Варна', label: 'Варна' },
  { value: 'Бургас', label: 'Бургас' },
  { value: 'Русе', label: 'Русе' },
  { value: 'Стара Загора', label: 'Стара Загора' },
  { value: 'Плевен', label: 'Плевен' },
  { value: 'Друго', label: 'Друго' }
]

function PostTaskPageContent() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: '',
  location: '',
  price: '',
    priceType: 'fixed' as 'fixed' | 'hourly',
  urgent: false,
    deadline: ''
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // File upload handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error('Файлът е твърде голям. Максималният размер е 5MB.')
          return false
        }
        if (!file.type.startsWith('image/')) {
          toast.error('Моля, качете само изображения.')
          return false
        }
        return true
      })
      
      if (images.length + validFiles.length > 5) {
        toast.error('Можете да качите максимум 5 снимки.')
        return
      }
      
      setImages(prev => [...prev, ...validFiles])
      
      // Create preview URLs
      validFiles.forEach(file => {
        const url = URL.createObjectURL(file)
        setImageUrls(prev => [...prev, url])
      })
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index)
      URL.revokeObjectURL(prev[index]) // Clean up memory
      return newUrls
    })
  }

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    // Check for duplicate parameters
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('duplicate') === 'true') {
      setFormData({
        title: urlParams.get('title') || '',
        description: urlParams.get('description') || '',
        category: urlParams.get('category') || '',
        location: urlParams.get('location') || '',
        price: urlParams.get('price') || '',
        priceType: (urlParams.get('price_type') as 'fixed' | 'hourly') || 'fixed',
        urgent: urlParams.get('urgent') === 'true',
        deadline: urlParams.get('deadline') || ''
      })
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [user, authLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    // Валидация
    if (!formData.title.trim() || formData.title.length < 5) {
      toast.error('Заглавието трябва да е поне 5 символа')
      return
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      toast.error('Описанието трябва да е поне 20 символа')
      return
    }

    if (!formData.category) {
      toast.error('Моля, изберете категория')
      return
    }

    if (!formData.location) {
      toast.error('Моля, изберете локация')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Моля, въведете валидна цена')
      return
    }

    setIsSubmitting(true)

    try {
      // Качване на снимки в Supabase Storage
      let imageUrls: string[] = []
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          // Clean filename - remove special characters and use only ASCII
          const cleanFileName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace non-ASCII chars with underscore
            .toLowerCase()
          const fileName = `${user.id}/${Date.now()}-${i}-${cleanFileName}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('task-images')
            .upload(fileName, file)
          
          if (uploadError) {
            console.error('Upload error:', uploadError)
            toast.error(`Грешка при качване на снимка ${i + 1}`)
            continue
          }
          
          // Получаване на public URL
          const { data: urlData } = supabase.storage
            .from('task-images')
            .getPublicUrl(fileName)
          
          imageUrls.push(urlData.publicUrl)
        }
      }

      // Създаване на задачата в Supabase
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Важно: изпраща cookies за автентикация
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: formData.location,
          price: parseFloat(formData.price),
          priceType: formData.priceType,
          urgent: formData.urgent,
          deadline: formData.deadline || null,
          images: imageUrls
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Грешка при публикуването на задачата')
      }

      const createdTask = result?.task
      const moderationStatus = result?.moderation?.status || createdTask?.status
      const moderationIssues = result?.moderation?.issues || []

      if (moderationStatus === 'pending') {
        toast.success('Задачата е изпратена за преглед. Ще я публикуваме след проверка.')
        moderationIssues.slice(0, 2).forEach((issue: string) =>
          toast(issue, { icon: 'ℹ️', duration: 5000 })
        )
        router.push('/profile?tab=taskGiver')
      } else if (createdTask?.id) {
        toast.success('Задачата е публикувана успешно!')
        router.push(`/task/${createdTask.id}`)
      } else {
        toast.success('Задачата е записана.')
        router.push('/profile?tab=taskGiver')
      }
    } catch (error: any) {
      console.error('Error creating task:', error)
      toast.error(error.message || 'Грешка при публикуването на задачата')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Назад
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Публикувай нова задача
        </h1>
        <p className="text-gray-600 mt-2">
          Попълнете формата за да публикувате вашата задача
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          
          {/* Заглавие */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Заглавие на задачата *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Напр: Почистване на апартамент 80кв.м"
              required
            />
          </div>

          {/* Описание */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Опишете подробно какво трябва да се направи..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} символа (минимум 20)
            </p>
          </div>

          {/* Снимки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Снимки (по избор)
            </label>
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Кликнете за да качите снимки или ги плъзнете тук
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Максимум 5 снимки, до 5MB всяка
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Категория и Локация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Избери категория</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Локация *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Избери град</option>
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Цена */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Цена (лв) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="priceType" className="block text-sm font-medium text-gray-700 mb-2">
                Тип на цената *
              </label>
              <select
                id="priceType"
                name="priceType"
                value={formData.priceType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fixed">Фиксирана цена</option>
                <option value="hourly">Цена на час</option>
              </select>
            </div>
          </div>

          {/* Срок */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Краен срок (опционално)
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Спешно */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="urgent"
              name="urgent"
              checked={formData.urgent}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
              Това е спешна задача
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Откажи
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Публикуване...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Публикувай задачата
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PostTaskPage() {
  return (
    <ErrorBoundary>
      <PostTaskPageContent />
    </ErrorBoundary>
  )
} 
