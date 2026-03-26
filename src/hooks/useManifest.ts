import { useState, useEffect, createContext } from 'react'
import type { MediaItem } from '@/lib/mediaStorage'

export interface ManifestItem {
  section: string
  slug?: string
  file: string
  type: 'video' | 'image'
}

interface ManifestJSON {
  _version?: string
  _generated?: string
  sections?: string[]
  items: ManifestItem[]
}

let _cache: MediaItem[] | null = null

export const ManifestContext = createContext<MediaItem[]>([])

async function loadManifest(signal: AbortSignal): Promise<MediaItem[]> {
  const res = await fetch('./wedding_manifest.json', { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as ManifestJSON
  const now = Date.now()
  return (data.items ?? []).map(raw => ({
    id: `manifest_${raw.section}_${raw.file}`,
    type: raw.type,
    section: raw.section,
    url: `./media/${raw.slug ?? raw.section}/${raw.file}`,
    uploadedAt: now,
  }))
}

export function useManifest() {
  const [items, setItems] = useState<MediaItem[]>(_cache ?? [])
  const [loading, setLoading] = useState<boolean>(_cache === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (_cache !== null) {
      setItems(_cache)
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    loadManifest(controller.signal)
      .then(mapped => {
        _cache = mapped
        setItems(mapped)
        setLoading(false)
      })
      .catch(err => {
        if ((err as DOMException).name === 'AbortError') return
        setError(String(err))
        setItems([])
        setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const refetch = () => {
    _cache = null
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    loadManifest(controller.signal)
      .then(mapped => {
        _cache = mapped
        setItems(mapped)
        setLoading(false)
      })
      .catch(err => {
        setError(String(err))
        setItems([])
        setLoading(false)
      })
  }

  return { items, loading, error, refetch }
}
