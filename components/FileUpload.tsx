'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, File, Video, Music, FileText, Camera, Trash2, Eye, Download } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  onFilesUploaded?: (uploadedFiles: any[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  showPreview?: boolean
  multiple?: boolean
  className?: string
  autoUpload?: boolean
  folder?: string
}

interface FileWithPreview extends File {
  id: string
  preview?: string
  uploadProgress?: number
  error?: string
}

export default function FileUpload({
  onFilesSelected,
  onFilesUploaded,
  maxFiles = 5,
  maxFileSize = 10, // 10MB
  acceptedTypes = ['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  showPreview = true,
  multiple = true,
  className = '',
  autoUpload = false,
  folder = 'uploads'
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadFiles, uploading, uploadProgress } = useFileUpload({
    folder,
    onUploadComplete: (uploadedFiles) => {
      onFilesUploaded?.(uploadedFiles)
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
    }
  })

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={20} className="text-blue-600" />
    if (file.type.startsWith('video/')) return <Video size={20} className="text-purple-600" />
    if (file.type.startsWith('audio/')) return <Music size={20} className="text-green-600" />
    if (file.type === 'application/pdf') return <FileText size={20} className="text-red-600" />
    return <File size={20} className="text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Файлът е твърде голям. Максималният размер е ${maxFileSize}MB`
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isAccepted) {
      return 'Този тип файл не се поддържа'
    }

    return null
  }

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        resolve('')
      }
    })
  }

  const handleFiles = useCallback(async (selectedFiles: FileList) => {
    const newFiles: FileWithPreview[] = []
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const error = validateFile(file)
      
      if (error) {
        // Show error toast or alert
        console.error(error)
        continue
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        id: `${Date.now()}-${i}`,
        uploadProgress: 0
      }

      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = await createFilePreview(file)
      }

      newFiles.push(fileWithPreview)
    }

    const updatedFiles = multiple 
      ? [...files, ...newFiles].slice(0, maxFiles)
      : newFiles.slice(0, 1)

    setFiles(updatedFiles)
    onFilesSelected(updatedFiles)
  }, [files, multiple, maxFiles, onFilesSelected])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      handleFiles(selectedFiles)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles) {
      handleFiles(droppedFiles)
    }
  }, [handleFiles])

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    onFilesSelected(updatedFiles)
  }

  const openFilePreview = (file: FileWithPreview) => {
    if (file.preview) {
      window.open(file.preview, '_blank')
    } else {
      // For non-image files, create a download link
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const takePhoto = () => {
    if (navigator.mediaDevices) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        if (target.files) {
          handleFiles(target.files)
        }
      }
      input.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Upload size={24} className="text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Дръпни файлове тук или кликни за избор
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Максимум {maxFiles} файла, до {maxFileSize}MB всеки
            </p>
          </div>

          {/* Mobile Camera Button */}
          <div className="flex justify-center gap-3">
            <button
              onClick={takePhoto}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors min-h-[44px] touch-manipulation"
            >
              <Camera size={18} />
              Снимай снимка
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Избрани файлове ({files.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {file.preview && showPreview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                  {file.error && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {file.error}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openFilePreview(file)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Преглед"
                  >
                    <Eye size={16} />
                  </button>
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    title="Премахни"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {file.uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.uploadProgress || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accepted File Types Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-1">Поддържани типове файлове:</p>
        <div className="flex flex-wrap gap-1">
          {acceptedTypes.map((type, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 