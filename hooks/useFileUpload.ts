import { useState, useCallback } from 'react'

interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
  path: string
}

interface UseFileUploadOptions {
  folder?: string
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (options.folder) {
        formData.append('folder', options.folder)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      return result.file
    } catch (error) {
      console.error('Upload error:', error)
      options.onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
      return null
    }
  }, [options])

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    setUploading(true)
    setUploadProgress({})
    setUploadedFiles([])

    const uploadedFiles: UploadedFile[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileId = `${file.name}-${i}`

        // Simulate progress for better UX
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileId] || 0
            if (current < 90) {
              return { ...prev, [fileId]: current + Math.random() * 20 }
            }
            return prev
          })
        }, 200)

        const uploadedFile = await uploadFile(file)
        
        clearInterval(progressInterval)
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))

        if (uploadedFile) {
          uploadedFiles.push(uploadedFile)
        }
      }

      setUploadedFiles(uploadedFiles)
      options.onUploadComplete?.(uploadedFiles)
      
      return uploadedFiles
    } catch (error) {
      console.error('Upload error:', error)
      options.onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
      return []
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }, [uploadFile, options])

  const deleteFile = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/upload?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Delete failed')
      }

      // Remove from uploaded files
      setUploadedFiles(prev => prev.filter(file => file.path !== filePath))
      return true
    } catch (error) {
      console.error('Delete error:', error)
      options.onUploadError?.(error instanceof Error ? error.message : 'Delete failed')
      return false
    }
  }, [options])

  const reset = useCallback(() => {
    setUploading(false)
    setUploadProgress({})
    setUploadedFiles([])
  }, [])

  return {
    uploading,
    uploadProgress,
    uploadedFiles,
    uploadFile,
    uploadFiles,
    deleteFile,
    reset
  }
}
