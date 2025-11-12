'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * Optimized Image Component
 * Uses Next.js Image component with WebP/AVIF optimization
 * Includes lazy loading, responsive images, and loading states
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  objectFit = 'cover',
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate blur placeholder if not provided
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    
    // Simple 1x1 pixel transparent PNG as placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  }

  const handleLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    if (onError) onError()
  }

  // Check if source is valid
  if (!src || hasError) {
    // Fallback to regular img tag for errors
    return (
      <div 
        className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}
        style={fill ? {} : { width: width || 400, height: height || 300 }}
      >
        <img
          src={src || '/placeholder-image.png'}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ objectFit }}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    )
  }

  // Use Next.js Image for optimization
  const imageClassName = `transition-opacity duration-300 ${
    isLoading ? 'opacity-0' : 'opacity-100'
  } ${className}`

  const imageStyle: React.CSSProperties = {
    objectFit
  }

  if (fill) {
    // Use fill prop for responsive images
    return (
      <div className={`relative w-full h-full ${isLoading ? 'bg-gray-200 dark:bg-gray-700 animate-pulse' : ''}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClassName}
          style={imageStyle}
          sizes={sizes}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
          onLoad={handleLoad}
          onError={handleError}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    )
  }

  // Use width/height for fixed size images
  return (
    <div className={`relative ${isLoading ? 'bg-gray-200 dark:bg-gray-700 animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={imageClassName}
        style={imageStyle}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
