export interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  section: string
  title?: string
  description?: string
  url?: string
  dataUrl?: string
  file?: File
  thumbnail?: string
  duration?: number
  uploadedAt: number
  tags?: string[]
  metadata?: {
    width?: number
    height?: number
    size?: number
    format?: string
  }
}

export interface VideoMetadata {
  duration: number
  width: number
  height: number
  size: number
}

export const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size
      })
    }
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'))
    }
    
    video.src = URL.createObjectURL(file)
  })
}

export const generateVideoThumbnail = (file: File, time: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }
    
    video.currentTime = time
    video.preload = 'metadata'
    
    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7)
      URL.revokeObjectURL(video.src)
      resolve(thumbnail)
    }
    
    video.onerror = () => {
      reject(new Error('Failed to generate thumbnail'))
    }
    
    video.src = URL.createObjectURL(file)
  })
}

export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }
    
    img.onload = () => {
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      const compressed = canvas.toDataURL('image/jpeg', quality)
      URL.revokeObjectURL(img.src)
      resolve(compressed)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to compress image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
