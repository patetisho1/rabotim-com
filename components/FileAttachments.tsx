'use client'

import { File, Image, FileText, Download, ExternalLink } from 'lucide-react'

interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

interface FileAttachmentsProps {
  attachments: Attachment[]
  title?: string
}

export default function FileAttachments({ attachments, title = "Прикачени файлове" }: FileAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null
  }

  const getFileIcon = (type: string, name: string) => {
    if (type.startsWith('image/')) {
      return <Image size={20} className="text-blue-500" />
    }
    if (type.includes('pdf') || name.toLowerCase().endsWith('.pdf')) {
      return <FileText size={20} className="text-red-500" />
    }
    if (type.includes('document') || name.toLowerCase().endsWith('.doc') || name.toLowerCase().endsWith('.docx')) {
      return <FileText size={20} className="text-blue-600" />
    }
    return <File size={20} className="text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = (attachment: Attachment) => {
    if (attachment.type.startsWith('image/')) {
      window.open(attachment.url, '_blank')
    } else {
      handleDownload(attachment)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        {title} ({attachments.length})
      </h3>
      
      <div className="space-y-2">
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(attachment.type, attachment.name)}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePreview(attachment)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title={attachment.type.startsWith('image/') ? 'Преглед' : 'Изтегли'}
              >
                {attachment.type.startsWith('image/') ? (
                  <ExternalLink size={16} className="text-gray-500" />
                ) : (
                  <Download size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 