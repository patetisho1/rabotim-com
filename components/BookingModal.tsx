'use client'

import { useEffect } from 'react'
import BookingForm from './BookingForm'

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
  professionalId,
  professionalUserId,
  professionalName,
  services = [],
  workingHours = []
}: BookingModalProps) {
  // Close on escape key
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <BookingForm
          professionalId={professionalId}
          professionalUserId={professionalUserId}
          professionalName={professionalName}
          services={services}
          workingHours={workingHours}
          onClose={onClose}
          onSuccess={onClose}
        />
      </div>
    </div>
  )
}

