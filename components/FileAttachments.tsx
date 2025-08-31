'use client'

import { useState } from 'react'
import { Download, Eye, X, Image, File, Video, Music, FileText, ExternalLink } from 'lucide-react'

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnail?: string
}

interface FileAttachmentsProps {
  attachments: Attachment[]
  onRemove?: (id: string) => void
  showActions?: boolean
  maxDisplay?: number
  className?: string
}

export default function FileAttachments({
  attachments,
  onRemove,
  showActions = true,
  maxDisplay = 3,
  className = ''
}: FileAttachmentsProps) {
  const [showAll, setShowAll] = useState(false)
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} className="text-blue-600" />
    if (type.startsWith('video/')) return <Video size={16} className="text-purple-600" />
    if (type.startsWith('audio/')) return <Music size={16} className="text-green-600" />
    if (type === 'application/pdf') return <FileText size={16} className="text-red-600" />
    return <File size={16} className="text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await fetch(attachment.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handlePreview = (attachment: Attachment) => {
    if (attachment.type.startsWith('image/')) {
      setPreviewAttachment(attachment)
    } else {
      // For non-image files, open in new tab
      window.open(attachment.url, '_blank')
    }
  }

  const displayedAttachments = showAll ? attachments : attachments.slice(0, maxDisplay)
  const hasMore = attachments.length > maxDisplay

  if (attachments.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Attachments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedAttachments.map((attachment) => (
          <div
            key={attachment.id}
            className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
          >
            {/* File Preview/Icon */}
            <div className="aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center relative">
              {attachment.thumbnail && attachment.type.startsWith('image/') ? (
                <img
                  src={attachment.thumbnail}
                  alt={attachment.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  {getFileIcon(attachment.type)}
                </div>
              )}
              
              {/* Overlay Actions */}
              {showActions && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(attachment)}
                      className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                      title="Преглед"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                      title="Изтегли"
                    >
                      <Download size={16} />
                    </button>
                    
                    {onRemove && (
                      <button
                        onClick={() => onRemove(attachment.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                        title="Премахни"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                
                {/* Mobile Actions */}
                <div className="flex items-center gap-1 sm:hidden">
                  <button
                    onClick={() => handlePreview(attachment)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Download size={14} />
                  </button>
                  
                  {onRemove && (
                    <button
                      onClick={() => onRemove(attachment.id)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors min-h-[44px] px-4 touch-manipulation"
          >
            {showAll ? 'Покажи по-малко' : `Покажи още ${attachments.length - maxDisplay} файла`}
          </button>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewAttachment && previewAttachment.type.startsWith('image/') && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewAttachment(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
            >
              <X size={20} />
            </button>
            
            <img
              src={previewAttachment.url}
              alt={previewAttachment.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <p className="font-medium">{previewAttachment.name}</p>
              <p className="text-sm opacity-75">{formatFileSize(previewAttachment.size)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Compact List View for Mobile */}
      <div className="sm:hidden space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-shrink-0">
              {attachment.thumbnail && attachment.type.startsWith('image/') ? (
                <img
                  src={attachment.thumbnail}
                  alt={attachment.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  {getFileIcon(attachment.type)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {attachment.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(attachment.size)}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePreview(attachment)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Eye size={16} />
              </button>
              
              <button
                onClick={() => handleDownload(attachment)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Download size={16} />
              </button>
              
              {onRemove && (
                <button
                  onClick={() => onRemove(attachment.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 