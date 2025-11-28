'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, CheckCircle, ArrowRight, User, Briefcase, MapPin } from 'lucide-react'
import { haptics } from '@/lib/haptics'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  onStartTour?: () => void
}

const steps = [
  {
    icon: User,
    title: 'Създай профил',
    description: 'Допълни профила си с информация, за да изглеждаш по-достоверен',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Briefcase,
    title: 'Публикувай или кандидатствай',
    description: 'Публикувай задача или кандидатствай за съществуващи',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: MapPin,
    title: 'Свържи се с хората',
    description: 'Комуникирай директно и договаряй условия',
    color: 'text-purple-600 bg-purple-100'
  }
]

export default function WelcomeModal({
  isOpen,
  onClose,
  userName = 'Потребител',
  onStartTour
}: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)

  useEffect(() => {
    // Check if user has seen welcome before
    const seen = localStorage.getItem('hasSeenWelcome')
    setHasSeenWelcome(seen === 'true')
  }, [])

  if (!isOpen || hasSeenWelcome) return null

  const handleComplete = () => {
    haptics.success()
    localStorage.setItem('hasSeenWelcome', 'true')
    setHasSeenWelcome(true)
    onClose()
    onStartTour?.()
  }

  const handleNext = () => {
    haptics.light()
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    haptics.light()
    localStorage.setItem('hasSeenWelcome', 'true')
    setHasSeenWelcome(true)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Добре дошъл!</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            Здравей, {userName}! 👋
          </h2>
          <p className="opacity-90">
            Нека ти покажем как работи Rabotim.com
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 py-4 bg-gray-50 dark:bg-gray-900/50">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-blue-600'
                  : index < currentStep
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${steps[currentStep].color}`}>
              {(() => {
                const Icon = steps[currentStep].icon
                return <Icon className="h-8 w-8" />
              })()}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {steps[currentStep].title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Features list */}
          <div className="mt-8 space-y-3">
            {currentStep === 0 && (
              <>
                <Feature text="Добави снимка за профила" />
                <Feature text="Напиши кратко описание" />
                <Feature text="Добави умения и опит" />
              </>
            )}
            {currentStep === 1 && (
              <>
                <Feature text="Безплатни обяви за всички" />
                <Feature text="Без комисионни" />
                <Feature text="VIP и TOP опции за повече видимост" />
              </>
            )}
            {currentStep === 2 && (
              <>
                <Feature text="Вграден чат" />
                <Feature text="Оценки и ревюта" />
                <Feature text="Сигурна комуникация" />
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation"
          >
            Пропусни
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors touch-manipulation flex items-center justify-center gap-2"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Напред
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Започни
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  )
}

