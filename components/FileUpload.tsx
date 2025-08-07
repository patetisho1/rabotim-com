'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image, FileText, Paperclip } from 'lucide-react'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // в MB
  acceptedTypes?: string[]
  label?: string
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  label = 'Прикачи файлове'
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Проверка на размера
    if (file.size > maxSize * 1024 * 1024) {
      return `Файлът ${file.name} е твърде голям. Максимален размер: ${maxSize}MB`
    }

    // Проверка на типа
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type)
      }
      if (type.includes('*')) {
        const baseType = type.split('/')[0]
        return file.type.startsWith(baseType)
      }
      return file.type === type
    })

    if (!isValidType) {
      return `Файлът ${file.name} не е от поддържан тип`
    }

    return null
  }

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: File[] = []
    const errors: string[] = []

    // Проверка на броя файлове
    if (files.length + fileArray.length > maxFiles) {
      setError(`Максимален брой файлове: ${maxFiles}`)
      return
    }

    fileArray.forEach(file => {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(validationError)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)
      setError(null)
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={20} className="text-blue-500" />
    }
    if (file.type.includes('pdf')) {
      return <FileText size={20} className="text-red-500" />
    }
    if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
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

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Upload size={24} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Плъзнете файлове тук или кликнете за избор
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Максимум {maxFiles} файла, {maxSize}MB всеки
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary text-sm"
          >
            Избери файлове
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Прикачени файлове ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 