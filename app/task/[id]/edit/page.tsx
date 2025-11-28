'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

// Динамичен placeholder за описанието според категорията
const getDescriptionPlaceholder = (category: string): string => {
  const placeholders: Record<string, string> = {
    'repair': 'Какъв ремонт ви трябва? Колко стаи, колко квадрата и сложност според вас. Бъдете възможно най-изчерпателни.',
    'cleaning': 'Опишете площта, брой стаи и тип почистване (голямо/редовно). Моля, бъдете конкретни.',
    'delivery': 'От къде до къде, какво се доставя и разстоянието. Трябва ли трета ръка?',
    'tutoring': 'Какъв предмет/навык искате да се научи? За кого е (възраст/клас) и колко пъти седмично?',
    'garden': 'Каква дейност ви трябва? Площ на градината, какво точно искате да се направи.',
    'it-services': 'Какъв тип услуга ви трябва? (уеб сайт, софтуер, поддръжка, уроци) Опишете кратко проекта.',
    'moving': 'От къде до къде, какво се премества и колко е обемът? Нужни ли са опаковъчни материали?',
    'assembly': 'Какво трябва да се сглоби? (мебели, техника и т.н.) Имате ли инструкции?',
    'care': 'Какъв тип грижа ви трябва? За кого е и колко часа на ден/седмица?',
    'other': 'Опишете подробно какво ви трябва. Бъдете конкретни за да получите най-добрите предложения.'
  }
  
  return placeholders[category] || 'Опишете подробно какво трябва да се направи. Бъдете възможно най-изчерпателни за да получите най-добрите предложения.'
}

function EditTaskPageContent() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user, loading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
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
  const [existingImages, setExistingImages] = useState<string[]>([])

  // Зареждане на задачата
  useEffect(() => {
    if (taskId && user && !authLoading) {
      loadTask()
    }
  }, [taskId, user, authLoading])

  const loadTask = async () => {
    if (!user) {
      console.error('User not loaded yet')
      return
    }
    
    try {
      setIsLoading(true)
      console.log('Loading task:', taskId, 'for user:', user.id)
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        credentials: 'include'
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error:', errorData)
        throw new Error(errorData.userMessage || 'Грешка при зареждането на задачата')
      }

      const data = await response.json()
      const task = data.task
      
      console.log('Task loaded:', task.id, 'owner:', task.user_id, 'current user:', user.id)

      // Проверка дали потребителят е собственик на задачата
      if (task.user_id !== user.id) {
        toast.error('Нямате права да редактирате тази задача')
        router.push(`/task/${taskId}`)
        return
      }

      // Проверка дали задачата може да се редактира (само active или pending)
      if (task.status !== 'active' && task.status !== 'pending') {
        toast.error('Можете да редактирате само активни или очакващи одобрение задачи')
        router.push(`/task/${taskId}`)
        return
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        location: task.location || '',
        price: task.price?.toString() || '',
        priceType: task.price_type || 'fixed',
        urgent: task.urgent || false,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
      })

      if (task.images && task.images.length > 0) {
        setExistingImages(task.images)
      }
    } catch (error: any) {
      console.error('Error loading task:', error)
      toast.error(error.message || 'Грешка при зареждането на задачата')
    } finally {
      setIsLoading(false)
    }
  }

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
      
      if (images.length + existingImages.length + validFiles.length > 5) {
        toast.error('Можете да качите максимум 5 снимки общо.')
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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
    }
  }, [authLoading, user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Client-side validation
  const validateForm = (): string[] => {
    const issues: string[] = []
    const MIN_TITLE_LENGTH = 10
    const MIN_DESCRIPTION_LENGTH = 50
    const MIN_PRICE_VALUE = 5

    if (formData.title.trim().length < MIN_TITLE_LENGTH) {
      issues.push(`Заглавието е твърде кратко (минимум ${MIN_TITLE_LENGTH} символа, имате ${formData.title.trim().length})`)
    }

    if (formData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
      issues.push(`Описанието е твърде кратко (минимум ${MIN_DESCRIPTION_LENGTH} символа, имате ${formData.description.trim().length})`)
    }

    const price = Number(formData.price)
    if (isNaN(price) || price < MIN_PRICE_VALUE) {
      issues.push('Посочената цена е подозрително ниска (минимум 5 лв)')
    }

    const bannedPatterns = [
      /https?:\/\//i,
      /\bтелефон\b/i,
      /\bwhatsapp\b/i,
      /\bviber\b/i,
      /\bemail\b/i
    ]

    if (bannedPatterns.some((pattern) => pattern.test(formData.title) || pattern.test(formData.description))) {
      issues.push('Не се допускат линкове или контакти в описанието')
    }

    return issues
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('handleSubmit called', { formData, user: user?.id, taskId })

    // Client-side validation
    const validationIssues = validateForm()
    console.log('Validation issues:', validationIssues)
    if (validationIssues.length > 0) {
      validationIssues.forEach(issue => {
        toast.error(issue)
      })
      return
    }

    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload new images if any
      const uploadedImageUrls: string[] = []
      
      for (const file of images) {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('task-images')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('task-images')
          .getPublicUrl(uploadData.path)

        uploadedImageUrls.push(publicUrl)
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...uploadedImageUrls]

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location,
        price: Number(formData.price),
        price_type: formData.priceType,
        urgent: formData.urgent,
        deadline: formData.deadline || null,
        images: allImages.length > 0 ? allImages : null
      }

      // Get current session for auth header
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session for update:', { hasSession: !!session, hasToken: !!session?.access_token })
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.error || result.message || 'Грешка при обновяването на задачата'
        throw new Error(errorMessage)
      }

      toast.success('Задачата е обновена успешно!')
      router.push(`/task/${taskId}`)
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast.error(error?.message || 'Грешка при обновяването на задачата')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
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
          Редактирай задача
        </h1>
        <p className="text-gray-600 mt-2">
          Променете информацията за вашата задача
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          
          {/* Категория - ПЪРВО */}
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

          {/* Описание с динамичен placeholder */}
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
              placeholder={getDescriptionPlaceholder(formData.category)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} символа (минимум 50)
            </p>
          </div>

          {/* Снимки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Снимки (по избор)
            </label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Images */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
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
                  Максимум 5 снимки общо, до 5MB всяка
                </p>
              </label>
            </div>

            {/* New Image Previews */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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

          {/* Локация */}
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

          {/* Цена */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Цена *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="5"
                  step="0.01"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  лв
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="priceType" className="block text-sm font-medium text-gray-700 mb-2">
                Тип цена *
              </label>
              <select
                id="priceType"
                name="priceType"
                value={formData.priceType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fixed">Фиксирана</option>
                <option value="hourly">На час</option>
              </select>
            </div>
          </div>

          {/* Допълнителни опции */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="urgent"
                name="urgent"
                checked={formData.urgent}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="urgent" className="ml-2 block text-sm text-gray-700">
                Спешно
              </label>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Срок (по избор)
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
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
                  Запазване...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Запази промените
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditTaskPage() {
  return (
    <ErrorBoundary>
      <EditTaskPageContent />
    </ErrorBoundary>
  )
}
