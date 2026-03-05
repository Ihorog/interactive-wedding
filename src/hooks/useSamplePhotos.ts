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

// 🎵 Щоб додати аудіо до розділу "Любити" — помістіть аудіофайли
// у папку src/assets/audio/ і вони автоматично відтворюватимуться фоном.
// Підтримувані формати: MP3, WAV, OGG, M4A
const audioModules = import.meta.glob(
  '../assets/audio/*.{mp3,MP3,wav,WAV,ogg,OGG,m4a,M4A,aac,AAC}',
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

function buildSampleAudio(): MediaItem[] {
  const audioEntries = Object.entries(audioModules)
  if (audioEntries.length === 0) return []

  return audioEntries.map(([path, module], index) => {
    const filename = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || `audio-${index + 1}`

    return {
      id: `audio-${filename}-${index}`,
      type: 'audio' as const,
      section: 'lyubyty',
      title: filename,
      description: '',
      dataUrl: module.default,
      uploadedAt: Date.now() - (audioEntries.length - index) * 10000,
      tags: ['romantic'],
    }
  })
}

export function useSamplePhotos() {
  const [mediaItems, setMediaItems] = useKV<MediaItem[]>('wedding-media', [])

  useEffect(() => {
    if (!mediaItems || mediaItems.length === 0) {
      const samplePhotos = buildSamplePhotos()
      const sampleAudio = buildSampleAudio()
      const all = [...samplePhotos, ...sampleAudio]
      if (all.length > 0) {
        setMediaItems(all)
      }
    }
  }, [mediaItems, setMediaItems])

  return { mediaItems, setMediaItems }
}
