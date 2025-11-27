'use client'

import { X, Filter, Check } from 'lucide-react'
import { useEffect } from 'react'
import { haptics } from '@/lib/haptics'

interface MobileFiltersSheetProps {
  isOpen: boolean
  onClose: () => void
  categories: Array<{ name: string; value: string; icon: any }>
  locations: string[]
  priceRanges: string[]
  sortOptions: string[]
  selectedCategory: string
  selectedLocation: string
  selectedPriceRange: string
  selectedSort: string
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onPriceRangeChange: (value: string) => void
  onSortChange: (value: string) => void
  onReset: () => void
}

export default function MobileFiltersSheet({
  isOpen,
  onClose,
  categories,
  locations,
  priceRanges,
  sortOptions,
  selectedCategory,
  selectedLocation,
  selectedPriceRange,
  selectedSort,
  onCategoryChange,
  onLocationChange,
  onPriceRangeChange,
  onSortChange,
  onReset
}: MobileFiltersSheetProps) {
  
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden animate-slide-up">
        <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Филтри
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Категория
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isSelected = selectedCategory === category.name
                  
                  return (
                    <button
                      key={category.value}
                      onClick={() => { haptics.selection(); onCategoryChange(category.name) }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all touch-manipulation min-h-[44px] active:scale-[0.98] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium truncate">{category.name}</span>
                      {isSelected && <Check size={16} className="ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Локация
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => {
                  const isSelected = selectedLocation === location
                  
                  return (
                    <button
                      key={location}
                      onClick={() => { haptics.selection(); onLocationChange(location) }}
                      className={`px-3 py-2.5 rounded-lg border-2 transition-all touch-manipulation min-h-[44px] active:scale-[0.98] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{location}</span>
                      {isSelected && <Check size={16} className="inline ml-1" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Ценови диапазон
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => {
                  const isSelected = selectedPriceRange === range
                  
                  return (
                    <button
                      key={range}
                      onClick={() => { haptics.selection(); onPriceRangeChange(range) }}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left touch-manipulation min-h-[48px] active:scale-[0.98] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{range}</span>
                        {isSelected && <Check size={18} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Сортиране
              </h3>
              <div className="space-y-2">
                {sortOptions.map((option) => {
                  const isSelected = selectedSort === option
                  
                  return (
                    <button
                      key={option}
                      onClick={() => onSortChange(option)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left touch-manipulation ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{option}</span>
                        {isSelected && <Check size={18} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 safe-area-inset-bottom">
            <div className="flex gap-3">
              <button
                onClick={onReset}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium touch-manipulation"
              >
                Изчисти
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium touch-manipulation"
              >
                Приложи
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}




