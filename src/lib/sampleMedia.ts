import type { MediaItem } from './mediaStorage'

import img1 from '@/assets/images/20241001_203159.jpg'
import img2 from '@/assets/images/_DSC5040.JPG'
import img3 from '@/assets/images/_DSC5146.JPG'
import img4 from '@/assets/images/_DSC5161.JPG'

export function buildSamplePhotos(): MediaItem[] {
  const samples: Array<{ url: string; title: string; section: string; tags: string[] }> = [
    {
      url: img1,
      title: '20241001_203159',
      section: 'zhyttya',
      tags: ['candid', 'natural', 'life'],
    },
    {
      url: img2,
      title: '_DSC5040',
      section: 'razom',
      tags: ['ceremony', 'solemn', 'romantic'],
    },
    {
      url: img3,
      title: '_DSC5146',
      section: 'lyubyty',
      tags: ['portrait', 'tender', 'love'],
    },
    {
      url: img4,
      title: '_DSC5161',
      section: 'mriyaty',
      tags: ['portrait', 'nostalgic', 'dreams'],
    },
  ]

  const SAMPLE_BASE_TIMESTAMP = 1700000000000

  return samples.map((s, i) => ({
    id: `sample-photo-${i + 1}`,
    type: 'image' as const,
    section: s.section,
    title: s.title,
    url: s.url,
    uploadedAt: SAMPLE_BASE_TIMESTAMP + i,
    tags: s.tags,
  }))
}

export function buildSampleAudio(): MediaItem[] {
  return []
}
