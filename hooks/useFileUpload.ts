'use client'

import { useState, useCallback } from 'react'

interface UploadedFile {
  id: string
  url: string
  name: string
  size: number
  type: string
}

interface UseFileUploadOptions {
  folder?: string
  onUploadComplete?: (uploadedFiles: UploadedFile[]) => void
  onUploadError?: (error: string) => void
}

export function useFileUpload({ 
  folder = 'uploads', 
  onUploadComplete, 
  onUploadError 
}: UseFileUploadOptions = {}) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFiles: UploadedFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const result = await response.json()
        
        uploadedFiles.push({
          id: result.id || Date.now().toString(),
          url: result.url,
          name: file.name,
          size: file.size,
          type: file.type
        })

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      onUploadComplete?.(uploadedFiles)
      return uploadedFiles

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onUploadError?.(errorMessage)
      throw error
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [folder, onUploadComplete, onUploadError])

  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed'
      onUploadError?.(errorMessage)
      throw error
    }
  }, [onUploadError])

  return {
    uploadFiles,
    deleteFile,
    uploading,
    uploadProgress
  }
}

