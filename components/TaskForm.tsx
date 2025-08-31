'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, X, MapPin, DollarSign, Calendar, Clock, Tag, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import FileUpload from './FileUpload'
import LocationPicker from './LocationPicker'

interface TaskFormData {
  title: string
  description: string
  category: string
  location: string
  budget: {
    type: 'fixed' | 'hourly' | 'negotiable'
    amount: number | ''
    maxAmount?: number | ''
  }
  deadline: string
  urgent: boolean
  images: File[]
  tags: string[]
  contactPhone: string
  contactEmail: string
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>
  initialData?: Partial<TaskFormData>
  isEditing?: boolean
  className?: string
}

export default function TaskForm({
  onSubmit,
  initialData,
  isEditing = false,
  className = ''
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    budget: initialData?.budget || {
      type: 'fixed',
      amount: '',
      maxAmount: ''
    },
    deadline: initialData?.deadline || '',
    urgent: initialData?.urgent || false,
    images: initialData?.images || [],
    tags: initialData?.tags || [],
    contactPhone: initialData?.contactPhone || '',
    contactEmail: initialData?.contactEmail || ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const categories = [
    { value: 'cleaning', label: 'Почистване', icon: '🧹' },
    { value: 'handyman', label: 'Майсторски услуги', icon: '🔧' },
    { value: 'transport', label: 'Транспорт', icon: '🚚' },
    { value: 'design', label: 'Дизайн', icon: '🎨' },
    { value: 'education', label: 'Обучение', icon: '📚' },
    { value: 'it', label: 'IT услуги', icon: '💻' },
    { value: 'gardening', label: 'Градинарство', icon: '🌱' },
    { value: 'pet-care', label: 'Грижа за домашни любимци', icon: '🐕' },
    { value: 'catering', label: 'Кетъринг', icon: '🍽️' },
    { value: 'other', label: 'Друго', icon: '📋' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Заглавието е задължително'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Заглавието трябва да е поне 10 символа'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описанието е задължително'
    } else if (formData.description.length < 30) {
      newErrors.description = 'Описанието трябва да е поне 30 символа'
    }

    if (!formData.category) {
      newErrors.category = 'Изберете категория'
    }

    if (!formData.location) {
      newErrors.location = 'Изберете локация'
    }

    if (formData.budget.type !== 'negotiable' && !formData.budget.amount) {
      newErrors.budget = 'Въведете бюджет'
    }

    if (formData.budget.type === 'fixed' && formData.budget.amount && formData.budget.amount < 5) {
      newErrors.budget = 'Минималният бюджет е 5 лв'
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Изберете срок'
    }

    if (!formData.contactPhone && !formData.contactEmail) {
      newErrors.contactPhone = 'Въведете телефон или имейл'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBudgetChange = (field: keyof typeof formData.budget, value: any) => {
    setFormData(prev => ({
      ...prev,
      budget: { ...prev.budget, [field]: value }
    }))
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: undefined }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleFilesSelected = useCallback((files: File[]) => {
    handleInputChange('images', files)
  }, [])

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Основна информация'
      case 2: return 'Детайли и бюджет'
      case 3: return 'Контакти и файлове'
      default: return ''
    }
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Редактирай задача' : 'Публикувай нова задача'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Стъпка {currentStep} от 3
          </span>
        </div>
        
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 transition-colors ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {getStepTitle(currentStep)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Заглавие на задачата *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Напр. Трябва ми майстор за ремонт на баня"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишете подробно какво трябва да се свърши, когато, къде и какви са изискванията..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.description}
                  </p>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Категория *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleInputChange('category', category.value)}
                    className={`p-3 border rounded-lg text-left transition-colors min-h-[60px] touch-manipulation ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Локация *
              </label>
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className={`w-full px-4 py-3 border rounded-lg text-left flex items-center gap-2 transition-colors ${
                  formData.location
                    ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                } ${errors.location ? 'border-red-500' : ''}`}
              >
                <MapPin size={20} className="text-gray-400" />
                {formData.location || 'Изберете локация'}
              </button>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.location}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Details and Budget */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Budget Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тип на плащането
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'fixed', label: 'Фиксирана цена', icon: '💰' },
                  { value: 'hourly', label: 'Почасова', icon: '⏰' },
                  { value: 'negotiable', label: 'Договорна', icon: '🤝' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleBudgetChange('type', type.value)}
                    className={`p-3 border rounded-lg text-center transition-colors min-h-[60px] touch-manipulation ${
                      formData.budget.type === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Amount */}
            {formData.budget.type !== 'negotiable' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Бюджет (лв) *
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="От"
                      value={formData.budget.amount}
                      onChange={(e) => handleBudgetChange('amount', e.target.value ? parseInt(e.target.value) : '')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base ${
                        errors.budget ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {formData.budget.type === 'fixed' && (
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="До (опционално)"
                        value={formData.budget.maxAmount || ''}
                        onChange={(e) => handleBudgetChange('maxAmount', e.target.value ? parseInt(e.target.value) : '')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                      />
                    </div>
                  )}
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.budget}
                  </p>
                )}
              </div>
            )}

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Срок за изпълнение *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Urgent */}
            <div>
              <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={(e) => handleInputChange('urgent', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Спешна задача</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Ще се показва с приоритет и ще струва повече
                  </div>
                </div>
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тагове (опционално)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Добави таг"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim() || formData.tags.length >= 5}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                >
                  Добави
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                    >
                      <Tag size={14} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Максимум 5 тага
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Contacts and Files */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+359 888 123 456"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имейл
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                />
              </div>
            </div>
            
            {(errors.contactPhone || errors.contactEmail) && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.contactPhone || errors.contactEmail}
              </p>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Снимки (опционално)
              </label>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                maxFiles={5}
                maxFileSize={5}
                acceptedTypes={['image/*']}
                showPreview={true}
                multiple={true}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Максимум 5 снимки, до 5MB всяка
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Назад
            </button>
          ) : (
            <div />
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Напред
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Публикуване...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditing ? 'Запази промените' : 'Публикувай задача'}
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={(location) => {
            handleInputChange('location', location)
            setShowLocationPicker(false)
          }}
          onClose={() => setShowLocationPicker(false)}
          currentLocation={formData.location}
        />
      )}
    </div>
  )
}
