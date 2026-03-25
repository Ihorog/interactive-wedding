import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { MediaItem } from '@/lib/mediaStorage'
import { buildSamplePhotos, buildSampleAudio } from '@/lib/sampleMedia'

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
