'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  MapPin, 
  Calendar, 
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react'

interface TaskFormData {
  // Стъпка 1: Категория
  category: string
  subcategory: string
  
  // Стъпка 2: Детайли
  title: string
  description: string
  requirements: string
  
  // Стъпка 3: Бюджет и срок
  budget: {
    min: number
    max: number
    type: 'hourly' | 'fixed'
  }
  deadline: string
  urgency: 'low' | 'medium' | 'high'
  
  // Стъпка 4: Локация
  location: {
    city: string
    address: string
    isRemote: boolean
  }
  
  // Стъпка 5: Медии и условия
  images: File[]
  conditions: string[]
  contactPhone: string
  contactEmail: string
}

const categories = [
  { id: 'repair', name: 'Ремонт и поддръжка', icon: '🔧' },
  { id: 'cleaning', name: 'Почистване', icon: '🧹' },
  { id: 'care', name: 'Грижа и помощ', icon: '👥' },
  { id: 'delivery', name: 'Доставка', icon: '📦' },
  { id: 'garden', name: 'Градинарство', icon: '🌱' },
  { id: 'transport', name: 'Транспорт', icon: '🚗' },
  { id: 'education', name: 'Обучение', icon: '📚' },
  { id: 'other', name: 'Други', icon: '✨' }
]

const urgencyLevels = [
  { id: 'low', name: 'Не е спешно', color: 'text-green-600' },
  { id: 'medium', name: 'Средна спешност', color: 'text-yellow-600' },
  { id: 'high', name: 'Много спешно', color: 'text-red-600' }
]

const commonConditions = [
  'Изпитване на кандидати',
  'Договор за работа',
  'Застраховка',
  'Материали включени',
  'Материали за сметка на изпълнителя',
  'Транспорт включен',
  'Транспорт за сметка на изпълнителя'
]

export default function PostTask() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TaskFormData>({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    requirements: '',
    budget: {
      min: 0,
      max: 0,
      type: 'hourly'
    },
    deadline: '',
    urgency: 'medium',
    location: {
      city: '',
      address: '',
      isRemote: false
    },
    images: [],
    conditions: [],
    contactPhone: '',
    contactEmail: ''
  })

  const steps = [
    { id: 1, title: 'Категория', icon: Tag },
    { id: 2, title: 'Детайли', icon: FileText },
    { id: 3, title: 'Бюджет & Срок', icon: DollarSign },
    { id: 4, title: 'Локация', icon: MapPin },
    { id: 5, title: 'Медии & Условия', icon: ImageIcon }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBudgetChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: value
      }
    }))
  }

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const toggleCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
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

  const handleSubmit = async () => {
    try {
      // Тук ще се добави логика за запазване в базата данни
      console.log('Submitting task:', formData)
      
      // Симулираме успешно запазване
      alert('Задачата е публикувана успешно!')
      router.push('/tasks')
    } catch (error) {
      console.error('Error submitting task:', error)
      alert('Грешка при публикуване на задачата')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Изберете категория</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleInputChange('category', category.id)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Заглавие на задачата *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Напр. Нужен е майстор за ремонт на баня"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Опишете подробно какво трябва да се направи..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Изисквания към изпълнителя
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Опит, квалификации, инструменти..."
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Тип на заплащането
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="hourly"
                    checked={formData.budget.type === 'hourly'}
                    onChange={(e) => handleInputChange('budget', { ...formData.budget, type: e.target.value })}
                    className="mr-2"
                  />
                  На час
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="fixed"
                    checked={formData.budget.type === 'fixed'}
                    onChange={(e) => handleInputChange('budget', { ...formData.budget, type: e.target.value })}
                    className="mr-2"
                  />
                  Фиксирана сума
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Минимална цена (лв.)
                </label>
                <input
                  type="number"
                  value={formData.budget.min}
                  onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Максимална цена (лв.)
                </label>
                <input
                  type="number"
                  value={formData.budget.max}
                  onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Краен срок
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Спешност
              </label>
              <div className="space-y-2">
                {urgencyLevels.map(level => (
                  <label key={level.id} className="flex items-center">
                    <input
                      type="radio"
                      value={level.id}
                      checked={formData.urgency === level.id}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="mr-2"
                    />
                    <span className={level.color}>{level.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Град *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="София, Пловдив, Варна..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Адрес
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Улица, номер, район..."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.location.isRemote}
                  onChange={(e) => handleLocationChange('isRemote', e.target.checked)}
                  className="mr-2"
                />
                Работата може да се извърши от разстояние
              </label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Снимки (по желание)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Кликнете за качване на снимки
                  </p>
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Условия за работа
              </label>
              <div className="space-y-2">
                {commonConditions.map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.conditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="mr-2"
                    />
                    {condition}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Телефон за контакт
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0888 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Имейл за контакт
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Публикувай нова задача
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Попълнете детайлите за вашата задача и намерете подходящ изпълнител
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} className="mr-2" />
              Назад
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Продължи
                <ChevronRight size={20} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Публикувай задачата
                <CheckCircle size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 