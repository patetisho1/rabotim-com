'use client'

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'image' | 'avatar'
  width?: string | number
  height?: string | number
  className?: string
  count?: number
}

/**
 * Skeleton Loader Component
 * Provides loading placeholders for better UX
 */
export default function SkeletonLoader({
  variant = 'rectangular',
  width,
  height,
  className = '',
  count = 1
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    card: 'rounded-lg h-64',
    image: 'rounded-lg',
    avatar: 'rounded-full w-12 h-12'
  }

  const style: React.CSSProperties = {
    width: width || (variant === 'avatar' ? 48 : '100%'),
    height: height || (variant === 'avatar' ? 48 : variant === 'text' ? 16 : variant === 'card' ? 256 : 200)
  }

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
    >
      <span className="sr-only">Зареждане...</span>
    </div>
  )
}

/**
 * Task Card Skeleton
 * Specific skeleton for task cards
 */
export function TaskCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <SkeletonLoader variant="image" height={224} className="w-full" />
      <div className="p-4 sm:p-6 space-y-3">
        <SkeletonLoader variant="text" width="80%" height={24} />
        <SkeletonLoader variant="text" width="60%" height={20} />
        <div className="flex items-center justify-between">
          <SkeletonLoader variant="text" width={100} height={20} />
          <SkeletonLoader variant="text" width={80} height={20} />
        </div>
      </div>
    </div>
  )
}

/**
 * Image Gallery Skeleton
 * Specific skeleton for image galleries
 */
export function ImageGallerySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader
          key={index}
          variant="image"
          height={192}
          className="w-full rounded-lg"
        />
      ))}
    </div>
  )
}

/**
 * User Avatar Skeleton
 * Specific skeleton for user avatars
 */
export function UserAvatarSkeleton({ size = 48 }: { size?: number }) {
  return (
    <SkeletonLoader
      variant="avatar"
      width={size}
      height={size}
      className="flex-shrink-0"
    />
  )
}

/**
 * List Skeleton
 * Specific skeleton for lists
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <SkeletonLoader variant="avatar" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="60%" />
            <SkeletonLoader variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

