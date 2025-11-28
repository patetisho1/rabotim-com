'use client'

import { useState } from 'react'
import { X, Flag, AlertTriangle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { haptics } from '@/lib/haptics'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportedType: 'task' | 'user' | 'message'
  reportedId: string
  reporterId: string
  reportedName?: string
}

const reportReasons = [
  { value: 'spam', label: 'Спам', icon: '📧' },
  { value: 'inappropriate', label: 'Неподходящо съдържание', icon: '🚫' },
  { value: 'scam', label: 'Измама', icon: '⚠️' },
  { value: 'harassment', label: 'Тормоз', icon: '😠' },
  { value: 'fake', label: 'Фалшиво/Невярно', icon: '🎭' },
  { value: 'other', label: 'Друго', icon: '📝' }
]

export default function ReportModal({
  isOpen,
  onClose,
  reportedType,
  reportedId,
  reporterId,
  reportedName
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const getTypeLabel = () => {
    switch (reportedType) {
      case 'task': return 'обявата'
      case 'user': return 'потребителя'
      case 'message': return 'съобщението'
      default: return 'елемента'
    }
  }

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Моля, изберете причина')
      haptics.error()
      return
    }

    setIsSubmitting(true)
    haptics.medium()

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_id: reporterId,
          reported_type: reportedType,
          reported_id: reportedId,
          reason: selectedReason,
          description: description.trim() || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Благодарим за докладването!')
        haptics.success()
        onClose()
        setSelectedReason('')
        setDescription('')
      } else {
        toast.error(data.error || 'Грешка при докладване')
        haptics.error()
      }
    } catch (error) {
      console.error('Report error:', error)
      toast.error('Грешка при изпращане на докладването')
      haptics.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Докладване
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {reportedName && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Докладване на {getTypeLabel()}: <strong>{reportedName}</strong>
            </p>
          )}

          {/* Reason Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Причина за докладване *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reportReasons.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => { haptics.selection(); setSelectedReason(reason.value) }}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all touch-manipulation min-h-[48px] active:scale-[0.98] ${
                    selectedReason === reason.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{reason.icon}</span>
                  <span className="text-sm font-medium">{reason.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Допълнително описание (опционално)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишете проблема по-подробно..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Фалшивите докладвания могат да доведат до ограничения на вашия акаунт.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[48px]"
            >
              Отказ
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Изпращане...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Изпрати
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

