'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  X, 
  Upload, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useTasksAPI, CreateTaskData } from '@/hooks/useTasksAPI'

interface TaskFormData {
  title: string
  description: string
  category: string
  location: string
  price: string
  priceType: 'fixed' | 'hourly'
  deadline: string
  urgent: boolean
  remote: boolean
  photos: File[]
  conditions: string
}

const categories = [
  'Почистване',
  'Ремонт',
  'Градинарство',
  'Преместване',
  'Доставка',
  'Сглобяване',
  'Авто услуги',
  'IT услуги',
  'Обучение',
  'Фотография',
  'Маркетинг',
  'Друго'
]

const steps = [
  { id: 1, title: 'Категория и детайли', description: 'Изберете категория и опишете задачата' },
  { id: 2, title: 'Бюджет и срок', description: 'Задайте бюджет и срок за изпълнение' },
  { id: 3, title: 'Локация', description: 'Укажете къде трябва да се изпълни задачата' },
  { id: 4, title: 'Снимки и условия', description: 'Добавете снимки и специални условия' },
  { id: 5, title: 'Преглед', description: 'Прегледайте и публикувайте задачата' }
]

export default function PostTaskPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const { createTask } = useTasksAPI()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    price: '',
    priceType: 'fixed',
    deadline: '',
    urgent: false,
    remote: false,
    photos: [],
    conditions: ''
  })

  // Проверка дали потребителят е влязъл
  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да влезете в акаунта си, за да публикувате задача')
      router.push('/login')
    }
  }, [authUser, authLoading, router])

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files].slice(0, 5) // Максимум 5 снимки
      }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.description || !formData.category) {
          toast.error('Моля, попълнете всички полета')
          return false
        }
        if (formData.title.length < 10) {
          toast.error('Заглавието трябва да бъде поне 10 символа')
          return false
        }
        if (formData.description.length < 20) {
          toast.error('Описанието трябва да бъде поне 20 символа')
          return false
        }
        return true
      case 2:
        if (!formData.price || !formData.deadline) {
          toast.error('Моля, попълнете бюджета и срока')
          return false
        }
        if (parseFloat(formData.price) < 5) {
          toast.error('Минималната цена е 5 лв')
          return false
        }
        return true
      case 3:
        if (!formData.location) {
          toast.error('Моля, въведете локация')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    console.log('=== DEBUG: Започва публикуване ===')
    console.log('FormData преди валидация:', formData)
    console.log('AuthUser:', authUser)
    
    setIsSubmitting(true)
    
    try {
      // Валидация на всички стъпки
      for (let i = 1; i <= 4; i++) {
        console.log(`Валидация на стъпка ${i}:`, validateStep(i))
        if (!validateStep(i)) {
          console.log(`Валидацията на стъпка ${i} е неуспешна`)
          setCurrentStep(i)
          setIsSubmitting(false)
          return
        }
      }
      
      console.log('Всички валидации са успешни')

      // Подготовка на данните за API
      const taskData: CreateTaskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        price: parseFloat(formData.price),
        priceType: formData.priceType,
        deadline: formData.deadline || undefined,
        urgent: formData.urgent,
        remote: formData.remote,
        conditions: formData.conditions
      }

      console.log('Изпращане на данни към API:', taskData)

      // Публикуване на задачата чрез API
      const newTask = await createTask(taskData)

      console.log('=== DEBUG: Задача публикувана успешно ===')
      console.log('Нова задача:', newTask)

      toast.success('Задачата е публикувана успешно!')
      
      setTimeout(() => {
        router.push('/tasks')
      }, 1000)

    } catch (error) {
      console.error('=== DEBUG: Грешка при публикуване ===', error)
      toast.error(error instanceof Error ? error.message : 'Възникна грешка при публикуването')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Изберете категория</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие на задачата *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Например: Почистване на апартамент в София"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 символа
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание на задачата *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишете детайлно какво трябва да се направи, какви са изискванията и очакванията..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 символа
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Бюджет *
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  min="5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.priceType}
                  onChange={(e) => handleInputChange('priceType', e.target.value as 'fixed' | 'hourly')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Фиксирана сума</option>
                  <option value="hourly">На час</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.priceType === 'fixed' ? 'Обща сума за задачата' : 'Сума на час'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок за изпълнение *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="urgent"
                checked={formData.urgent}
                onChange={(e) => handleInputChange('urgent', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
                Спешна задача (допълнителна такса)
              </label>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Локация *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Например: София, Център или София, Младост"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Съвети за локацията:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Бъдете конкретни - посочете квартал или район</li>
                <li>• Ако е в сграда, посочете етаж и апартамент</li>
                <li>• За паркинг задачи, посочете адрес</li>
              </ul>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Снимки (по избор)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Кликнете за качване на снимки
                  </p>
                  <p className="text-xs text-gray-500">
                    Максимум 5 снимки, до 5MB всяка
                  </p>
                </label>
              </div>
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Специални условия (по избор)
              </label>
              <textarea
                value={formData.conditions}
                onChange={(e) => handleInputChange('conditions', e.target.value)}
                placeholder="Допълнителни изисквания, условия или бележки..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Преглед на задачата</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{formData.title}</h4>
                  <p className="text-sm text-gray-600">{formData.category}</p>
                </div>
                
                <div>
                  <p className="text-gray-700">{formData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Бюджет:</span>
                    <p>{formData.price} лв {formData.priceType === 'hourly' ? '/час' : ''}</p>
                  </div>
                  <div>
                    <span className="font-medium">Срок:</span>
                    <p>{new Date(formData.deadline).toLocaleDateString('bg-BG')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Локация:</span>
                    <p>{formData.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">Спешна:</span>
                    <p>{formData.urgent ? 'Да' : 'Не'}</p>
                  </div>
                </div>
                
                {formData.conditions && (
                  <div>
                    <span className="font-medium">Специални условия:</span>
                    <p className="text-gray-700">{formData.conditions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Назад
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Публикуване на задача
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Назад
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => {
                if (validateStep(currentStep)) {
                  nextStep()
                }
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Напред
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Публикуване...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Публикувай задачата
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 