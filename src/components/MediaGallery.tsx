import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { VideoPlayer } from '@/components/VideoPlayer'
import { Image, Play, MusicNote, ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { MediaItem } from '@/lib/mediaStorage'

interface MediaGalleryProps {
  items: MediaItem[]
  columns?: number
  className?: string
}

export function MediaGallery({ items, columns = 3, className = '' }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null

  const goNext = useCallback(() => {
    if (items.length === 0) return
    setSelectedIndex(prev => prev !== null ? (prev + 1) % items.length : null)
  }, [items.length])

  const goPrev = useCallback(() => {
    if (items.length === 0) return
    setSelectedIndex(prev => prev !== null ? (prev - 1 + items.length) % items.length : null)
  }, [items.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedIndex, goNext, goPrev])

  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (items.length === 0) {
    return (
      <Card className="volumetric-card p-12 text-center">
        <div className="text-muted-foreground">
          <Image size={48} weight="duotone" className="mx-auto mb-4 text-primary" />
          <p className="font-body text-lg mb-2">
            Поки що немає медіафайлів
          </p>
          <p className="font-body text-sm">
            Використайте AI-помічник для додавання фото та відео
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className={`grid ${getGridCols()} gap-6 ${className}`}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card
              className="volumetric-card overflow-hidden cursor-pointer group"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative aspect-video bg-muted">
                {item.type === 'video' ? (
                  <>
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title || 'Video thumbnail'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={48} weight="duotone" className="text-primary" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={32} weight="fill" className="text-primary ml-1" />
                      </div>
                    </div>
                  </>
                ) : item.type === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-primary/5">
                    <MusicNote size={48} weight="duotone" className="text-primary" />
                    <p className="font-ui text-xs text-muted-foreground uppercase tracking-wide">
                      Аудіо
                    </p>
                  </div>
                ) : (
                  <img
                    src={item.dataUrl || item.url}
                    alt={item.title || 'Image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {item.title && (
                <div className="p-4">
                  <h3 className="font-body font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-body text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl p-0 border-none bg-transparent">
          {selectedItem && (
            <div className="space-y-4 relative">
              {/* Navigation arrows */}
              {items.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); goPrev() }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); goNext() }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
                  >
                    <ArrowRight size={20} />
                  </Button>
                </>
              )}

              {/* Counter */}
              {items.length > 1 && selectedIndex !== null && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white font-ui text-xs">
                  {selectedIndex + 1} / {items.length}
                </div>
              )}

              {selectedItem.type === 'video' ? (
                <VideoPlayer
                  src={selectedItem.dataUrl || selectedItem.url || ''}
                  poster={selectedItem.thumbnail}
                  title={selectedItem.title}
                  autoPlay
                  muted={false}
                />
              ) : selectedItem.type === 'audio' ? (
                <Card className="volumetric-card p-8 flex flex-col items-center gap-4">
                  <MusicNote size={64} weight="duotone" className="text-primary" />
                  {selectedItem.title && (
                    <p className="font-display text-xl font-bold text-foreground">
                      {selectedItem.title}
                    </p>
                  )}
                  <audio
                    src={selectedItem.dataUrl || selectedItem.url}
                    controls
                    autoPlay
                    className="w-full max-w-md"
                  />
                </Card>
              ) : (
                <Card className="volumetric-card overflow-hidden">
                  <img
                    src={selectedItem.dataUrl || selectedItem.url}
                    alt={selectedItem.title || 'Image'}
                    className="w-full max-h-[80vh] object-contain"
                  />
                </Card>
              )}

              {(selectedItem.title || selectedItem.description || (selectedItem.tags && selectedItem.tags.length > 0)) && (
                <Card className="volumetric-card p-6">
                  {selectedItem.title && (
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      {selectedItem.title}
                    </h2>
                  )}
                  {selectedItem.description && (
                    <p className="font-body text-muted-foreground">
                      {selectedItem.description}
                    </p>
                  )}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedItem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#F9E7A1]/60 text-[#4D4D4D] font-ui text-xs border border-[#EAD79A]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
