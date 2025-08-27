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
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TaskFormData {
  title: '',
  description: '',
  category: '',
  location: '',
  price: '',
  priceType: 'fixed' | 'hourly',
  deadline: '',
  urgent: false,
  photos: File[],
  conditions: ''
}

const categories = [
  'Електрически услуги',
  'Водопроводни услуги',
  'Почистване',
  'Градинарство',
  'Преместване',
  'Ремонт',
  'Доставка',
  'Сглобяване',
  'Авто услуги',
  'IT услуги',
  'Обучение',
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
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    price: '',
    priceType: 'fixed' as 'fixed' | 'hourly',
    deadline: '',
    urgent: false,
    photos: [] as File[],
    conditions: ''
  })

  useEffect(() => {
    // Проверка дали потребителят е влязъл
    const loginStatus = localStorage.getItem('isLoggedIn')
    if (loginStatus !== 'true') {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    // Проверка дали потребителят е даващ задачи
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      if (!user.roles?.taskGiver) {
        toast.error('Трябва да сте регистрирани като даващ задачи')
        router.push('/profile')
        return
      }
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.photos.length > 5) {
      toast.error('Максимум 5 снимки са позволени')
      return
    }

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }))
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
          toast.error('Моля, попълнете всички задължителни полета')
          return false
        }
        break
      case 2:
        if (!formData.price || !formData.deadline) {
          toast.error('Моля, попълнете бюджета и срока')
          return false
        }
        break
      case 3:
        if (!formData.location) {
          toast.error('Моля, укажете локацията')
          return false
        }
        break
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    if (currentStep < 5) {
      nextStep()
      return
    }

    setIsSubmitting(true)

    try {
      // Симулация на публикуване
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Създаване на задачата
      const taskData = {
        id: Date.now(),
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString(),
        applications: [],
        views: 0,
        userId: JSON.parse(localStorage.getItem('user') || '{}').id
      }

      // Запазване в localStorage
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      existingTasks.push(taskData)
      localStorage.setItem('tasks', JSON.stringify(existingTasks))

      // Обновяване на статистиките на потребителя
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      if (userData.taskGiver) {
        userData.taskGiver.totalTasksPosted += 1
        localStorage.setItem('user', JSON.stringify(userData))
      }

      toast.success('Задачата е публикувана успешно!')
      
      setTimeout(() => {
        router.push('/profile?tab=taskGiver')
      }, 1000)

    } catch (error) {
      toast.error('Възникна грешка при публикуването')
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
                Заглавие на задачата *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Напр. Трябва ми майстор за ремонт на баня"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Изберете категория</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Опишете подробно какво трябва да се направи..."
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бюджет (лв) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип на цената
                </label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Фиксирана цена</option>
                  <option value="hourly">На час</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок за изпълнение *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="urgent"
                checked={formData.urgent}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Маркирай като спешна задача
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
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Напр. София, Лозенец"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Защо е важна локацията?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Това помага на изпълнителите да разберат дали могат да изпълнят задачата и да оценят транспортните разходи.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Снимки (по желание)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Кликнете за да качите снимки</p>
                  <p className="text-xs text-gray-500 mt-1">Максимум 5 снимки</p>
                </label>
              </div>
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Специални условия (по желание)
              </label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Добавете специални изисквания или условия..."
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Преглед на задачата</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{formData.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Категория:</span>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Локация:</span>
                    <p className="font-medium">{formData.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Бюджет:</span>
                    <p className="font-medium">{formData.price} лв ({formData.priceType === 'fixed' ? 'фиксирана' : 'на час'})</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Срок:</span>
                    <p className="font-medium">{formData.deadline}</p>
                  </div>
                </div>

                {formData.urgent && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">Спешна задача</span>
                  </div>
                )}

                {formData.conditions && (
                  <div>
                    <span className="text-gray-600 text-sm">Специални условия:</span>
                    <p className="text-sm mt-1">{formData.conditions}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Готови сте за публикуване!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    След публикуването, изпълнителите ще могат да видят вашата задача и да кандидатстват за нея.
                  </p>
                </div>
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
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Публикувай задача</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-lg font-medium text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Назад
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Публикуване...
                </>
              ) : currentStep === 5 ? (
                <>
                  <CheckCircle size={16} />
                  Публикувай задачата
                </>
              ) : (
                <>
                  Следваща стъпка
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 