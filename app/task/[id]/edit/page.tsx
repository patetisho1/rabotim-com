'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  DollarSign,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

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

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { user, loading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  
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
  
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImageUrls, setNewImageUrls] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    loadTask()
  }, [user, authLoading, taskId])

  const loadTask = async () => {
    try {
      setLoading(true)
      
      const { data: taskData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

      if (error) throw error
      
      if (!taskData) {
        toast.error('Задачата не е намерена')
        router.push('/my-tasks')
        return
      }

      // Check if user is owner
      if (taskData.user_id !== user?.id) {
        toast.error('Нямате права да редактирате тази задача')
        router.push(`/task/${taskId}`)
        return
      }

      // Populate form
      setFormData({
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        location: taskData.location,
        price: taskData.price.toString(),
        priceType: taskData.price_type,
        urgent: taskData.urgent || false,
        deadline: taskData.deadline ? new Date(taskData.deadline).toISOString().split('T')[0] : ''
      })

      setExistingImages(taskData.images || [])
    } catch (error: any) {
      console.error('Error loading task:', error)
      toast.error('Грешка при зареждане на задачата')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Файлът е твърде голям. Максималният размер е 5MB.')
          return false
        }
        if (!file.type.startsWith('image/')) {
          toast.error('Моля, качете само изображения.')
          return false
        }
        return true
      })
      
      const totalImages = existingImages.length - imagesToDelete.length + newImages.length + validFiles.length
      if (totalImages > 5) {
        toast.error('Можете да качите максимум 5 снимки.')
        return
      }
      
      setNewImages(prev => [...prev, ...validFiles])
      
      validFiles.forEach(file => {
        const url = URL.createObjectURL(file)
        setNewImageUrls(prev => [...prev, url])
      })
    }
  }

  const removeExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => [...prev, imageUrl])
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImageUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

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

    // Validation
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
      // Upload new images
      let newImageUrls: string[] = []
      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i]
          const cleanFileName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
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
          
          const { data: urlData } = supabase.storage
            .from('task-images')
            .getPublicUrl(fileName)
          
          newImageUrls.push(urlData.publicUrl)
        }
      }

      // Combine existing images (minus deleted) with new images
      const finalImages = [
        ...existingImages.filter(img => !imagesToDelete.includes(img)),
        ...newImageUrls
      ]

      // Update task
      const { error } = await supabase
        .from('tasks')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: formData.location,
          price: parseFloat(formData.price),
          price_type: formData.priceType,
          urgent: formData.urgent,
          deadline: formData.deadline || null,
          images: finalImages
        })
        .eq('id', taskId)

      if (error) throw error

      toast.success('Задачата е обновена успешно!')
      router.push(`/task/${taskId}`)
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast.error(error.message || 'Грешка при обновяване на задачата')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => router.push(`/task/${taskId}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Назад към задачата
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Редактиране на задача
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Заглавие *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Напр. Почистване на апартамент"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Опишете подробно какво трябва да се направи..."
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Изберете категория</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Локация *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Изберете локация</option>
                  {locations.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Цена (лв) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тип цена *
                </label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="fixed">Фиксирана цена</option>
                  <option value="hourly">Цена на час</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Краен срок (опционално)
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Снимки (максимум 5)
              </label>
              
              {/* Existing Images */}
              {existingImages.filter(img => !imagesToDelete.includes(img)).length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {existingImages
                    .filter(img => !imagesToDelete.includes(img))
                    .map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Снимка ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imageUrl)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {/* New Images */}
              {newImageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {newImageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Нова снимка ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                        Нова
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Качи снимки</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Urgent */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="urgent"
                id="urgent"
                checked={formData.urgent}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="urgent" className="text-sm text-gray-700 dark:text-gray-300">
                Маркирай като спешна задача
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push(`/task/${taskId}`)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Отказ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Запазване...' : 'Запази промените'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


