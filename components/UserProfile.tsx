'use client'

import { useState, useRef, useCallback } from 'react'
import { User, Edit, Camera, Star, MapPin, Phone, Mail, Calendar, Award, Shield, CheckCircle, X, Save, Loader2, AlertCircle } from 'lucide-react'
import FileUpload from './FileUpload'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  bio: string
  skills: string[]
  rating: number
  completedTasks: number
  totalEarnings: number
  memberSince: string
  verified: boolean
  languages: string[]
  availability: 'available' | 'busy' | 'unavailable'
}

interface UserProfileProps {
  user: UserData
  onUpdate: (data: Partial<UserData>) => Promise<void>
  isOwnProfile?: boolean
  className?: string
}

export default function UserProfile({
  user,
  onUpdate,
  isOwnProfile = false,
  className = ''
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editData, setEditData] = useState<UserData>(user)
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({})
  const [newSkill, setNewSkill] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const skills = [
    'Почистване', 'Майсторски услуги', 'Транспорт', 'Дизайн', 'Обучение',
    'IT услуги', 'Градинарство', 'Грижа за домашни любимци', 'Кетъринг',
    'Фотография', 'Видео', 'Преводач', 'Административни услуги'
  ]

  const languages = [
    'Български', 'Английски', 'Немски', 'Френски', 'Испански', 'Италиански',
    'Руски', 'Турски', 'Гръцки', 'Румънски'
  ]

  const availabilityOptions = [
    { value: 'available', label: 'Свободен', color: 'text-green-600' },
    { value: 'busy', label: 'Зает', color: 'text-yellow-600' },
    { value: 'unavailable', label: 'Недостъпен', color: 'text-red-600' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {}

    if (!editData.name.trim()) {
      newErrors.name = 'Името е задължително'
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Имейлът е задължителен'
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Невалиден имейл адрес'
    }

    if (editData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(editData.phone)) {
      newErrors.phone = 'Невалиден телефонен номер'
    }

    if (editData.bio && editData.bio.length > 500) {
      newErrors.bio = 'Биографията не може да надвишава 500 символа'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onUpdate(editData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof UserData, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim()) && editData.skills.length < 10) {
      handleInputChange('skills', [...editData.skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', editData.skills.filter(skill => skill !== skillToRemove))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !editData.languages.includes(newLanguage.trim()) && editData.languages.length < 5) {
      handleInputChange('languages', [...editData.languages, newLanguage.trim()])
      setNewLanguage('')
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    handleInputChange('languages', editData.languages.filter(lang => lang !== languageToRemove))
  }

  const handleAvatarChange = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('avatar', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available': return '🟢'
      case 'busy': return '🟡'
      case 'unavailable': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {isOwnProfile && (
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
              <Camera size={20} />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {editData.avatar ? (
                <img
                  src={editData.avatar}
                  alt={editData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            
            {isOwnProfile && isEditing && (
              <button
                onClick={() => fileUploadRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* Name and Status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editData.name}
                </h1>
                {editData.verified && (
                  <Shield className="text-blue-600" size={20} />
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  {getAvailabilityIcon(editData.availability)}
                  {availabilityOptions.find(opt => opt.value === editData.availability)?.label}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {editData.location || 'Не е посочена локация'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Член от {formatDate(editData.memberSince)}
                </span>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit size={16} />
                {isEditing ? 'Отказ' : 'Редактирай'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editData.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Рейтинг</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${
                      star <= editData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editData.completedTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Завършени задачи</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editData.totalEarnings} €
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Общо печалби</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              За мен
            </h3>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Разкажете за себе си, вашите умения и опит..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none ${
                  errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {editData.bio || 'Няма добавена биография.'}
              </p>
            )}
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.bio}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Умения
            </h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Добави умение"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={addSkill}
                    disabled={!newSkill.trim() || editData.skills.length >= 10}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    Добави
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => !editData.skills.includes(skill) && addSkill()}
                      disabled={editData.skills.includes(skill) || editData.skills.length >= 10}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        editData.skills.includes(skill)
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            
            <div className="flex flex-wrap gap-2">
              {editData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                >
                  <Award size={14} />
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Контакти
            </h3>
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Имейл
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail size={16} />
                    <span>{editData.email}</span>
                  </div>
                  {editData.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone size={16} />
                      <span>{editData.phone}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Езици
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Избери език</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <button
                    onClick={addLanguage}
                    disabled={!newLanguage || editData.languages.includes(newLanguage) || editData.languages.length >= 5}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    Добави
                  </button>
                </div>
              </div>
            ) : null}
            
            <div className="flex flex-wrap gap-2">
              {editData.languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm"
                >
                  <CheckCircle size={14} />
                  {language}
                  {isEditing && (
                    <button
                      onClick={() => removeLanguage(language)}
                      className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          {isOwnProfile && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Статус
              </h3>
              <div className="space-y-2">
                {availabilityOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={editData.availability === option.value}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`font-medium ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Запазване...
              </>
            ) : (
              <>
                <Save size={18} />
                Запази промените
              </>
            )}
          </button>
        </div>
      )}

      {/* Hidden File Upload */}
      <input
        ref={fileUploadRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const files = e.target.files
          if (files && files.length > 0) {
            handleAvatarChange(Array.from(files))
          }
        }}
        className="hidden"
      />
    </div>
  )
}
