'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions'
import { haptics } from '@/lib/haptics'

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  category?: string
  className?: string
  autoFocus?: boolean
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSearch,
  placeholder = 'Търси задачи...',
  category = '',
  className = '',
  autoFocus = false
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    suggestions,
    isLoading,
    recentSearches,
    fetchSuggestions,
    clearSuggestions,
    addToRecent,
    clearRecent
  } = useSearchSuggestions({ category })

  // Fetch suggestions when value changes
  useEffect(() => {
    if (isOpen) {
      fetchSuggestions(value)
    }
  }, [value, isOpen, fetchSuggestions])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = suggestions.length > 0 ? suggestions : recentSearches.slice(0, 5)
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        )
        haptics.selection()
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        )
        haptics.selection()
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
          handleSelect(items[highlightedIndex])
        } else if (value.trim()) {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }, [suggestions, recentSearches, highlightedIndex, value])

  const handleSelect = (suggestion: string) => {
    haptics.light()
    onChange(suggestion)
    addToRecent(suggestion)
    onSearch(suggestion)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleSearch = () => {
    if (value.trim()) {
      haptics.medium()
      addToRecent(value.trim())
      onSearch(value.trim())
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    haptics.light()
    onChange('')
    clearSuggestions()
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsOpen(true)
    fetchSuggestions(value)
  }

  // Show recent searches if no query, suggestions otherwise
  const showRecent = !value && recentSearches.length > 0
  const displayItems = value ? suggestions : recentSearches.slice(0, 5)

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all touch-manipulation"
        />
        
        {/* Clear/Loading button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : value ? (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && displayItems.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              {showRecent ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Последни търсения</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  <span>Предложения</span>
                </>
              )}
            </div>
            {showRecent && (
              <button
                onClick={() => { haptics.light(); clearRecent() }}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Изчисти
              </button>
            )}
          </div>

          {/* Items */}
          <ul className="py-2 max-h-64 overflow-y-auto">
            {displayItems.map((item, index) => (
              <li key={item}>
                <button
                  onClick={() => handleSelect(item)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors touch-manipulation min-h-[48px] ${
                    index === highlightedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {showRecent ? (
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{item}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Search button */}
          {value && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSearch}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors touch-manipulation flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Търси "{value}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

