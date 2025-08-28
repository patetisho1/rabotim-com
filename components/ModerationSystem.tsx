'use client'

import { useState } from 'react'
import { 
  Flag, 
  AlertTriangle, 
  Shield, 
  Send,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  MessageSquare,
  User,
  DollarSign,
  Calendar
} from 'lucide-react'

interface Report {
  id: string
  reporterId: string
  reporterName: string
  reportedItemId: string
  reportedItemType: 'task' | 'user' | 'message' | 'review'
  reportedItemTitle: string
  reason: string
  description: string
  evidence: string[]
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  moderatorId?: string
  moderatorName?: string
  moderatorNotes?: string
  createdAt: string
  resolvedAt?: string
}

interface ModerationSystemProps {
  itemId: string
  itemType: 'task' | 'user' | 'message' | 'review'
  itemTitle: string
  onReport: (report: Omit<Report, 'id' | 'createdAt'>) => void
  onClose: () => void
  isOpen: boolean
}

const reportReasons = {
  task: [
    'Спам или реклама',
    'Неподходящо съдържание',
    'Незаконна дейност',
    'Фалшива информация',
    'Дублирана обява',
    'Неправилна категория',
    'Друго'
  ],
  user: [
    'Фалшив профил',
    'Спам или реклама',
    'Неподходящо поведение',
    'Измама или изнудване',
    'Нарушаване на правилата',
    'Друго'
  ],
  message: [
    'Спам или реклама',
    'Неподходящо съдържание',
    'Изнудване',
    'Обиди или тормоз',
    'Друго'
  ],
  review: [
    'Фалшив отзив',
    'Неподходящо съдържание',
    'Обиди или тормоз',
    'Спам',
    'Друго'
  ]
}

export default function ModerationSystem({
  itemId,
  itemType,
  itemTitle,
  onReport,
  onClose,
  isOpen
}: ModerationSystemProps) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [evidence, setEvidence] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) return

    setLoading(true)

    try {
      const reportData = {
        reporterId: 'current-user',
        reporterName: 'Текущ потребител',
        reportedItemId: itemId,
        reportedItemType: itemType,
        reportedItemTitle: itemTitle,
        reason,
        description,
        evidence: evidence ? [evidence] : [],
        status: 'pending' as const
      }

      onReport(reportData)
      
      // Reset form
      setReason('')
      setDescription('')
      setEvidence('')
      
      onClose()
    } catch (error) {
      console.error('Error submitting report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Flag size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Докладвай проблем
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Помогнете ни да поддържаме качеството на платформата
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                {itemType === 'task' && <DollarSign size={16} className="text-blue-600 dark:text-blue-400" />}
                {itemType === 'user' && <User size={16} className="text-blue-600 dark:text-blue-400" />}
                {itemType === 'message' && <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />}
                {itemType === 'review' && <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {itemTitle}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Тип: {
                    itemType === 'task' ? 'Задача' :
                    itemType === 'user' ? 'Потребител' :
                    itemType === 'message' ? 'Съобщение' :
                    'Отзив'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Причина за докладване *
            </label>
            <div className="space-y-2">
              {reportReasons[itemType].map((reportReason) => (
                <label key={reportReason} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="reason"
                    value={reportReason}
                    checked={reason === reportReason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reportReason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Описание на проблема
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Опишете подробно защо докладвате този елемент. Това ще ни помогне да разберем проблема по-добре."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Бъдете конкретни и обективни
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {description.length}/1000
              </span>
            </div>
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Допълнителна информация (по желание)
            </label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={3}
              placeholder="Линкове, скрийншоти или друга информация, която може да помогне при разследването."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Можете да прикачите линкове към изображения или документи
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Вашата сигурност е важна
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Всички доклади се обработват конфиденциално. Нашият екип ще разгледа проблема в рамките на 24 часа.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Откажи
            </button>
            <button
              type="submit"
              disabled={!reason || loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Изпращане...
                </>
              ) : (
                <>
                  <Flag size={16} />
                  Докладвай
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

