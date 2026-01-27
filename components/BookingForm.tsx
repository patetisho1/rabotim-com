'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface Service {
  id: string
  name: string
  price?: number
  priceType?: 'fixed' | 'hourly' | 'starting_from' | 'negotiable'
  duration?: number
}

interface BookingFormProps {
  professionalId: string
  professionalUserId: string
  professionalName: string
  services?: Service[]
  workingHours?: {
    day: string
    isOpen: boolean
    openTime?: string
    closeTime?: string
  }[]
  onClose?: () => void
  onSuccess?: () => void
}

export default function BookingForm({
  professionalId,
  professionalUserId,
  professionalName,
  services = [],
  workingHours = [],
  onClose,
  onSuccess
}: BookingFormProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    clientName: user?.user_metadata?.full_name || '',
    clientEmail: user?.email || '',
    clientPhone: user?.user_metadata?.phone || '',
    serviceId: '',
    bookingDate: '',
    startTime: '',
    clientNotes: ''
  })

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientName || !formData.clientEmail || !formData.bookingDate || !formData.startTime) {
      toast.error('Моля, попълнете всички задължителни полета')
      return
    }

    setIsSubmitting(true)
    
    try {
      const selectedService = services.find(s => s.id === formData.serviceId)
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId,
          professionalUserId,
          clientUserId: user?.id,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone || undefined,
          serviceId: formData.serviceId || undefined,
          serviceName: selectedService?.name,
          bookingDate: formData.bookingDate,
          startTime: formData.startTime,
          durationMinutes: selectedService?.duration || 60,
          clientNotes: formData.clientNotes || undefined,
          estimatedPrice: selectedService?.price
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при изпращане на резервацията')
      }

      setIsSuccess(true)
      toast.success('Резервацията е изпратена успешно!')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Грешка при изпращане на резервацията')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Резервацията е изпратена!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {professionalName} ще потвърди резервацията скоро. Ще получите известие на имейла си.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-left mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(formData.bookingDate).toLocaleDateString('bg-BG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formData.startTime}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Затвори
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Запази час</h3>
            <p className="text-sm text-blue-100">при {professionalName}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Service selection */}
        {services.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Услуга
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Изберете услуга (опционално)</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} {service.price ? `- ${service.price}€` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Дата *
            </label>
            <input
              type="date"
              required
              min={today}
              value={formData.bookingDate}
              onChange={(e) => setFormData(prev => ({ ...prev, bookingDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Час *
            </label>
            <select
              required
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Изберете час</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Вашето име *
          </label>
          <input
            type="text"
            required
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
            placeholder="Иван Иванов"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Имейл *
          </label>
          <input
            type="email"
            required
            value={formData.clientEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
            placeholder="ivan@example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Телефон
          </label>
          <input
            type="tel"
            value={formData.clientPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
            placeholder="+359 888 123 456"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Бележка (опционално)
          </label>
          <textarea
            value={formData.clientNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, clientNotes: e.target.value }))}
            placeholder="Допълнителна информация за услугата..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Изпращане...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Изпрати заявка за резервация
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Резервацията изисква потвърждение от {professionalName}. 
          Ще получите имейл с потвърждение.
        </p>
      </form>
    </div>
  )
}

