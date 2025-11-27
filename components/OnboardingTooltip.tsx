'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'
import { haptics } from '@/lib/haptics'

interface TooltipStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTooltipProps {
  steps: TooltipStep[]
  storageKey: string
  onComplete?: () => void
}

export default function OnboardingTooltip({
  steps,
  storageKey,
  onComplete
}: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user has completed this tour
    const completed = localStorage.getItem(`onboarding_${storageKey}`)
    if (!completed) {
      setIsVisible(true)
    }
  }, [storageKey])

  useEffect(() => {
    if (!isVisible || !steps[currentStep]?.target) return

    const target = document.querySelector(steps[currentStep].target!)
    if (!target) return

    const rect = target.getBoundingClientRect()
    const pos = steps[currentStep].position || 'bottom'

    // Calculate position based on target element
    let top = 0
    let left = 0

    switch (pos) {
      case 'top':
        top = rect.top - 10
        left = rect.left + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + 10
        left = rect.left + rect.width / 2
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - 10
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + 10
        break
    }

    setPosition({ top, left })

    // Add highlight to target
    target.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'z-[60]', 'relative')

    return () => {
      target.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'z-[60]', 'relative')
    }
  }, [currentStep, isVisible, steps])

  if (!isVisible) return null

  const handleNext = () => {
    haptics.light()
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    haptics.light()
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    haptics.success()
    localStorage.setItem(`onboarding_${storageKey}`, 'true')
    setIsVisible(false)
    onComplete?.()
  }

  const handleSkip = () => {
    haptics.light()
    localStorage.setItem(`onboarding_${storageKey}`, 'true')
    setIsVisible(false)
  }

  const step = steps[currentStep]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[55]"
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[60] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{
          top: position.top || '50%',
          left: position.left || '50%',
          transform: step.target ? 'translateX(-50%)' : 'translate(-50%, -50%)'
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Съвет {currentStep + 1} от {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
          >
            <X className="h-4 w-4 text-blue-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {step.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Напред
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              'Готово'
            )}
          </button>
        </div>
      </div>
    </>
  )
}

// Predefined tours
export const homepageTour: TooltipStep[] = [
  {
    id: 'search',
    title: 'Търси задачи',
    description: 'Използвай търсачката за да намериш задачи в твоя район',
    target: '[data-tour="search"]',
    position: 'bottom'
  },
  {
    id: 'categories',
    title: 'Разгледай категории',
    description: 'Избери категория за да видиш свързани задачи',
    target: '[data-tour="categories"]',
    position: 'bottom'
  },
  {
    id: 'post',
    title: 'Публикувай задача',
    description: 'Имаш нужда от помощ? Публикувай безплатна обява',
    target: '[data-tour="post-task"]',
    position: 'left'
  }
]

export const tasksTour: TooltipStep[] = [
  {
    id: 'filters',
    title: 'Филтрирай резултати',
    description: 'Използвай филтрите за да стесниш търсенето',
    target: '[data-tour="filters"]',
    position: 'bottom'
  },
  {
    id: 'apply',
    title: 'Кандидатствай',
    description: 'Натисни върху задача за да видиш детайли и да кандидатстваш',
    position: 'bottom'
  }
]

export const profileTour: TooltipStep[] = [
  {
    id: 'edit',
    title: 'Редактирай профила',
    description: 'Попълни профила си за да изглеждаш по-достоверен',
    target: '[data-tour="edit-profile"]',
    position: 'bottom'
  },
  {
    id: 'tasks',
    title: 'Твоите задачи',
    description: 'Тук ще виждаш задачите, които си публикувал',
    target: '[data-tour="my-tasks"]',
    position: 'bottom'
  }
]

