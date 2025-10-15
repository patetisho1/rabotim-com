'use client'

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Image skeleton */}
      <div className="h-32 sm:h-48 bg-gray-200 dark:bg-gray-700 animate-shimmer relative">
        {/* Heart icon skeleton */}
        <div className="absolute bottom-2 right-2">
          <div className="w-11 h-11 bg-gray-300 dark:bg-gray-600 rounded-full animate-shimmer" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-shimmer" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-shimmer" />
        
        {/* Price and location */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
        </div>
        
        {/* Details */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-shimmer" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-shimmer" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          </div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

