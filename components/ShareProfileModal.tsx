'use client'

import { useEffect } from 'react'
import { X, PartyPopper, Share2, ArrowRight } from 'lucide-react'
import ShareButtons from './ShareButtons'

interface ShareProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profileUrl: string
  userName: string
  onSkip?: () => void
}

export default function ShareProfileModal({
  isOpen,
  onClose,
  profileUrl,
  userName,
  onSkip
}: ShareProfileModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const shareTitle = `Намерих страхотна платформа за услуги! Вижте моя профил в Rabotim.com`
  const shareDescription = `${userName} е в Rabotim.com - платформата за намиране на работа и услуги в България. Присъединете се и вие!`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header with celebration */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 py-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-4">
              <PartyPopper size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Добре дошли, {userName}! 🎉
          </h2>
          <p className="text-white/90">
            Профилът ви е създаден успешно!
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Споделете профила си
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Споделете с приятели и познати, за да ви намерят по-лесно и да получите първите си задачи!
            </p>
          </div>

          {/* Share buttons */}
          <ShareButtons
            url={profileUrl}
            title={shareTitle}
            description={shareDescription}
            showLabel={false}
          />

          {/* Profile URL display */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Вашият профил:</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-mono break-all">
              {profileUrl}
            </p>
          </div>

          {/* Tip */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 <strong>Съвет:</strong> Споделете профила си в социалните мрежи, за да ви намерят повече клиенти!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onSkip || onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            По-късно
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Продължи
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

