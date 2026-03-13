import type { MediaItem } from './mediaStorage'
export const MARKERS_SCHEMA = {
  m_scene: ['ceremony', 'vows', 'rings', 'kiss', 'first_dance', 'guests', 'party', 'walk', 'details', 'portraits', 'group', 'decor'] as const,
  m_mood: ['romantic', 'joyful', 'tender', 'solemn', 'funny', 'nostalgic', 'energetic'] as const,
  m_role: ['hero', 'spread', 'grid', 'slider', 'quote_block', 'calendar_memory'] as const,
  m_quality: ['ok', 'warn_blur', 'warn_dark', 'warn_noise', 'reject'] as const,
}

// Section to marker mapping
export const SECTION_MARKERS: Record<string, { scenes: string[], moods: string[], tempo: 'slow' | 'medium' | 'fast' }> = {
  ayakscho:       { scenes: ['walk', 'details', 'decor'],              moods: ['nostalgic', 'tender'],    tempo: 'slow' },
  razom:          { scenes: ['ceremony', 'vows', 'rings', 'kiss'],     moods: ['solemn', 'romantic'],     tempo: 'medium' },
  lyubyty:        { scenes: ['kiss', 'portraits', 'walk'],             moods: ['romantic', 'tender'],     tempo: 'slow' },
  zhyttya:        { scenes: ['guests', 'party', 'group'],              moods: ['joyful', 'funny'],        tempo: 'medium' },
  pospravzhnomu:  { scenes: ['guests', 'party', 'group'],              moods: ['joyful', 'energetic'],    tempo: 'medium' },
  radity:         { scenes: ['first_dance', 'party', 'group'],         moods: ['energetic', 'joyful'],    tempo: 'fast' },
  mriyaty:        { scenes: ['details', 'decor', 'portraits'],         moods: ['nostalgic', 'romantic'],  tempo: 'slow' },
}

export interface PhotoMarkers {
  m_scene: string
  m_mood: string
  m_role: string
  m_quality: string
}

export interface AlbumMediaEntry {
  id: string
  filename: string
  title: string
  section: string
  date?: string
  ratio?: string
  markers: PhotoMarkers
  tags: string[]
  quality_score: number
  series_id?: string
  paths: {
    thumb: string
    medium: string
    hero: string
    art?: string
  }
}

export interface AlbumVideoEntry {
  id: string
  title: string
  section: string
  src: string
  poster?: string
  duration?: number
  scene: string
  mood: string
  tags: string[]
  audio_mode: 'original' | 'mixed' | 'music_only'
  origin: 'raw' | 'montage_generated'
  quality_score: number
  confidence: number
}

// Assign section based on tags/filename heuristic
export function inferSection(tags: string[] = [], filename: string = ''): string {
  const lower = filename.toLowerCase()
  const allTags = [...tags, lower]

  if (allTags.some(t => ['ceremony', 'vow', 'ring', 'church', 'register'].some(k => t.includes(k)))) return 'razom'
  if (allTags.some(t => ['kiss', 'couple', 'romantic', 'love', 'portrait'].some(k => t.includes(k)))) return 'lyubyty'
  if (allTags.some(t => ['dance', 'party', 'emotion', 'laugh', 'cry', 'first_dance'].some(k => t.includes(k)))) return 'radity'
  if (allTags.some(t => ['guest', 'family', 'friend', 'toast'].some(k => t.includes(k)))) return 'pospravzhnomu'
  if (allTags.some(t => ['casual', 'informal', 'fun', 'walk', 'life'].some(k => t.includes(k)))) return 'zhyttya'
  if (allTags.some(t => ['future', 'dream', 'wish', 'plan'].some(k => t.includes(k)))) return 'mriyaty'
  if (allTags.some(t => ['prepare', 'before', 'dress', 'flower', 'decor', 'detail'].some(k => t.includes(k)))) return 'ayakscho'

  return 'unassigned'
}

// Assign scene marker based on tags
export function inferScene(tags: string[] = [], section: string = ''): string {
  const allTags = tags.join(' ').toLowerCase()
  if (allTags.includes('kiss')) return 'kiss'
  if (allTags.includes('ring')) return 'rings'
  if (allTags.includes('vow')) return 'vows'
  if (allTags.includes('ceremony')) return 'ceremony'
  if (allTags.includes('dance')) return 'first_dance'
  if (allTags.includes('guest') || allTags.includes('family')) return 'guests'
  if (allTags.includes('party') || allTags.includes('toast')) return 'party'
  if (allTags.includes('walk') || allTags.includes('outdoor')) return 'walk'
  if (allTags.includes('detail') || allTags.includes('decor') || allTags.includes('flower')) return 'details'
  if (allTags.includes('portrait') || allTags.includes('couple')) return 'portraits'
  if (allTags.includes('group')) return 'group'
  // Fall back to section default
  const sectionMarkers = SECTION_MARKERS[section]
  return sectionMarkers?.scenes[0] || 'details'
}

// Assign mood marker
export function inferMood(tags: string[] = [], section: string = ''): string {
  const allTags = tags.join(' ').toLowerCase()
  if (allTags.includes('romantic') || allTags.includes('love')) return 'romantic'
  if (allTags.includes('joyful') || allTags.includes('laugh') || allTags.includes('happy')) return 'joyful'
  if (allTags.includes('tender') || allTags.includes('sweet')) return 'tender'
  if (allTags.includes('solemn') || allTags.includes('serious')) return 'solemn'
  if (allTags.includes('funny') || allTags.includes('fun')) return 'funny'
  if (allTags.includes('nostalgic') || allTags.includes('memory')) return 'nostalgic'
  if (allTags.includes('energetic') || allTags.includes('dance')) return 'energetic'
  const sectionMarkers = SECTION_MARKERS[section]
  return sectionMarkers?.moods[0] || 'joyful'
}

// Assign role based on aspect ratio and position
export function inferRole(index: number, total: number, aspectRatio?: number): string {
  if (index === 0 && total > 3) return 'hero'
  if (aspectRatio && aspectRatio > 1.5) return 'spread'
  if (total > 6 && index % 5 === 0) return 'quote_block'
  return 'grid'
}

// Generate quality score (0-1) - basic heuristic from metadata
export function estimateQuality(metadata?: { width?: number; height?: number; size?: number }): { score: number; quality: string } {
  if (!metadata) return { score: 0.7, quality: 'ok' }
  const { width = 0, height = 0 } = metadata
  const pixels = width * height
  if (pixels === 0) return { score: 0.7, quality: 'ok' }
  if (pixels < 640 * 480) return { score: 0.3, quality: 'warn_blur' }
  if (pixels < 1280 * 720) return { score: 0.5, quality: 'ok' }
  if (pixels >= 1920 * 1080) return { score: 0.9, quality: 'ok' }
  return { score: 0.75, quality: 'ok' }
}

// Process a media item and attach markers
export function processMediaItem(item: MediaItem): MediaItem & { markers?: PhotoMarkers } {
  const section = item.section !== 'unassigned' ? item.section : inferSection(item.tags, item.title)
  const scene = inferScene(item.tags, section)
  const mood = inferMood(item.tags, section)
  const { quality } = estimateQuality(item.metadata)

  const markers: PhotoMarkers = {
    m_scene: scene,
    m_mood: mood,
    m_role: 'grid',
    m_quality: quality,
  }

  return { ...item, section, markers }
}

// Video section profiles
export const VIDEO_SECTION_PROFILES: Record<string, { tempo: 'slow' | 'medium' | 'fast'; mood: string; description: string }> = {
  ayakscho:       { tempo: 'slow',   mood: 'tender',     description: 'Підготовка, перші кроки, теплий настрій' },
  razom:          { tempo: 'medium', mood: 'solemn',     description: 'Урочистість церемонії' },
  lyubyty:        { tempo: 'slow',   mood: 'romantic',   description: 'Близькість, романтика' },
  zhyttya:        { tempo: 'medium', mood: 'joyful',     description: 'Легкість, неформальні моменти' },
  pospravzhnomu:  { tempo: 'medium', mood: 'energetic',  description: 'Гості, тости, святкування' },
  radity:         { tempo: 'fast',   mood: 'energetic',  description: 'Танці, піки емоцій' },
  mriyaty:        { tempo: 'slow',   mood: 'nostalgic',  description: 'Мрії, майбутнє' },
}
