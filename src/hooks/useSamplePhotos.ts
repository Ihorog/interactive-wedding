import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { MediaItem } from '@/lib/mediaStorage'

// 📸 Щоб додати фотографії до альбому — помістіть файли зображень
// у папку src/assets/images/ і вони автоматично з'являться в альбомі.
// Підтримувані формати: JPG, JPEG, PNG, GIF, WebP
const imageModules = import.meta.glob(
  '../assets/images/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WebP}',
  { eager: true }
) as Record<string, { default: string }>

const SECTIONS = ['ayakscho', 'razom', 'lyubyty', 'zhyttya', 'pospravzhnomu', 'radity', 'mriyaty'] as const

function buildSamplePhotos(): MediaItem[] {
  const imageEntries = Object.entries(imageModules)
  if (imageEntries.length === 0) return []

  return imageEntries.map(([path, module], index) => {
    const filename = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || `photo-${index + 1}`
    const section = SECTIONS[index % SECTIONS.length]

    return {
      id: `sample-${filename}-${index}`,
      type: 'image' as const,
      section,
      title: filename,
      description: '',
      dataUrl: module.default,
      uploadedAt: Date.now() - (imageEntries.length - index) * 10000,
      tags: [],
    }
  })
}

export function useSamplePhotos() {
  const [mediaItems, setMediaItems] = useKV<MediaItem[]>('wedding-media', [])

  useEffect(() => {
    if (!mediaItems || mediaItems.length === 0) {
      const samplePhotos = buildSamplePhotos()
      if (samplePhotos.length > 0) {
        setMediaItems(samplePhotos)
      }
    }
  }, [mediaItems, setMediaItems])

  return { mediaItems, setMediaItems }
}
