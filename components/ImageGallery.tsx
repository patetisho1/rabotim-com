'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react'

interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

interface ImageGalleryProps {
  attachments: Attachment[]
  className?: string
}

export default function ImageGallery({ attachments, className = '' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 })
  
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRef = useRef<HTMLDivElement>(null)

  // Filter only image attachments
  const imageAttachments = attachments.filter(att => 
    att.type.startsWith('image/')
  )

  if (imageAttachments.length === 0) {
    return null
  }

  const nextImage = () => {
    setCurrentIndex((prev) => 
      prev === imageAttachments.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? imageAttachments.length - 1 : prev - 1
    )
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextImage()
    }
    if (isRightSwipe) {
      prevImage()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Zoom and pan handlers
  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullscreen) return
    
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta))
    setZoomLevel(newZoom)
    
    if (newZoom <= 1) {
      setIsZoomed(false)
      setPanPosition({ x: 0, y: 0 })
    } else {
      setIsZoomed(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return
    
    const startX = e.clientX - panPosition.x
    const startY = e.clientY - panPosition.y
    
    const handleMouseMove = (e: MouseEvent) => {
      setPanPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      })
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        case 'Escape':
          setIsFullscreen(false)
          setIsZoomed(false)
          setZoomLevel(1)
          setPanPosition({ x: 0, y: 0 })
          break
        case '+':
        case '=':
          setZoomLevel(prev => Math.min(3, prev + 0.1))
          break
        case '-':
          setZoomLevel(prev => Math.max(0.5, prev - 0.1))
          break
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  // Auto-scroll thumbnails to current image
  useEffect(() => {
    if (thumbnailRef.current) {
      const thumbnail = thumbnailRef.current.children[currentIndex] as HTMLElement
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }, [currentIndex])

  const currentImage = imageAttachments[currentIndex]

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative ${className}`}>
        {/* Main Image */}
        <div 
          ref={containerRef}
          className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsFullscreen(true)}
        >
          <img
            ref={imageRef}
            src={currentImage.url}
            alt={currentImage.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Navigation Arrows */}
          {imageAttachments.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {imageAttachments.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {imageAttachments.length}
            </div>
          )}
          
          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFullscreen(true)
            }}
            className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Thumbnail Gallery */}
        {imageAttachments.length > 1 && (
          <div className="mt-3">
            <div 
              ref={thumbnailRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
            >
              {imageAttachments.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsFullscreen(false)
              setIsZoomed(false)
              setZoomLevel(1)
              setPanPosition({ x: 0, y: 0 })
            }}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <X size={20} />
          </button>

          {/* Download Button */}
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = currentImage.url
              link.download = currentImage.name
              link.click()
            }}
            className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <Download size={20} />
          </button>

          {/* Main Image */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          >
            <img
              src={currentImage.url}
              alt={currentImage.name}
              className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
                isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                transformOrigin: 'center'
              }}
              onClick={() => {
                if (!isZoomed) {
                  setZoomLevel(2)
                  setIsZoomed(true)
                } else {
                  setZoomLevel(1)
                  setIsZoomed(false)
                  setPanPosition({ x: 0, y: 0 })
                }
              }}
            />
          </div>

          {/* Navigation Arrows */}
          {imageAttachments.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{currentImage.name}</p>
                <p className="text-sm opacity-75">
                  {(currentImage.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <div className="text-sm opacity-75">
                {currentIndex + 1} / {imageAttachments.length}
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              -
            </button>
            <span className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-sm backdrop-blur-sm">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.1))}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              +
            </button>
          </div>
        </div>
      )}
    </>
  )
} 