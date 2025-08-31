'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2, RotateCw } from 'lucide-react'

interface Image {
  id: string
  src: string
  alt: string
  thumbnail?: string
}

interface ImageGalleryProps {
  images: Image[]
  initialIndex?: number
  onClose?: () => void
  showThumbnails?: boolean
  allowDownload?: boolean
  allowShare?: boolean
}

export default function ImageGallery({ 
  images, 
  initialIndex = 0, 
  onClose, 
  showThumbnails = true,
  allowDownload = true,
  allowShare = true
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(true)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-hide controls on mobile
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    setShowControls(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    const minSwipeDistance = 50

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        // Swipe left - next image
        nextImage()
      } else {
        // Swipe right - previous image
        previousImage()
      }
    } else if (Math.abs(distanceY) > minSwipeDistance && !isZoomed) {
      // Vertical swipe - close gallery
      onClose?.()
    }

    setTouchStart({ x: 0, y: 0 })
    setTouchEnd({ x: 0, y: 0 })
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    resetImageTransform()
  }

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    resetImageTransform()
  }

  const resetImageTransform = () => {
    setIsZoomed(false)
    setZoomLevel(1)
    setRotation(0)
  }

  const handleZoom = () => {
    if (isZoomed) {
      setZoomLevel(1)
      setIsZoomed(false)
    } else {
      setZoomLevel(2)
      setIsZoomed(true)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex].src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image-${currentIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: images[currentIndex].alt,
          text: 'Разгледай тази снимка',
          url: images[currentIndex].src
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(images[currentIndex].src)
        // Show success message
      } catch (error) {
        console.error('Copy failed:', error)
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        previousImage()
        break
      case 'ArrowRight':
        e.preventDefault()
        nextImage()
        break
      case 'Escape':
        e.preventDefault()
        onClose?.()
        break
      case '+':
      case '=':
        e.preventDefault()
        if (!isZoomed) handleZoom()
        break
      case '-':
        e.preventDefault()
        if (isZoomed) handleZoom()
        break
      case 'r':
        e.preventDefault()
        handleRotate()
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])

  if (images.length === 0) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={() => setShowControls(!showControls)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          ref={imageRef}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className={`max-w-full max-h-full object-contain transition-all duration-300 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            e.stopPropagation()
            handleZoom()
          }}
        />
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2">
            <button
              onClick={handleZoom}
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>

            <button
              onClick={handleRotate}
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
            >
              <RotateCw size={20} />
            </button>

            {allowDownload && (
              <button
                onClick={handleDownload}
                className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
              >
                <Download size={20} />
              </button>
            )}

            {allowShare && (
              <button
                onClick={handleShare}
                className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
              >
                <Share2 size={20} />
              </button>
            )}
          </div>
        </>
      )}

      {/* Thumbnails */}
      {showThumbnails && showControls && images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 bg-black bg-opacity-50 rounded-full p-2 max-w-full overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index)
                  resetImageTransform()
                }}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-white'
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Gesture Hints */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 md:hidden">
        <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-xs">
          Свайп за навигация • Докосни за приближаване
        </div>
      </div>
    </div>
  )
} 