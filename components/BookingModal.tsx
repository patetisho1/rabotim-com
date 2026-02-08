'use client'

import { useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

interface Service {
  id: string
  name: string
  price?: number
  priceType?: 'fixed' | 'hourly' | 'starting_from' | 'negotiable'
  duration?: number
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
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
}

export default function BookingModal({
  isOpen,
  onClose,
  professionalName
}: BookingModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Затвори"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <MessageCircle size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Резервации
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              За резервации и въпроси моля свържете се директно с {professionalName} чрез бутона „Свържи се“ в профила.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Затвори
          </button>
        </div>
      </div>
    </div>
  )
}
