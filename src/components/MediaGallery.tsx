import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { VideoPlayer } from '@/components/VideoPlayer'
import { Image, Play } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { MediaItem } from '@/lib/mediaStorage'

interface MediaGalleryProps {
  items: MediaItem[]
  columns?: number
  className?: string
}

export function MediaGallery({ items, columns = 3, className = '' }: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

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
              onClick={() => setSelectedItem(item)}
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

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl p-0 border-none bg-transparent">
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.type === 'video' ? (
                <VideoPlayer
                  src={selectedItem.dataUrl || selectedItem.url || ''}
                  poster={selectedItem.thumbnail}
                  title={selectedItem.title}
                  autoPlay
                  muted={false}
                />
              ) : (
                <Card className="volumetric-card overflow-hidden">
                  <img
                    src={selectedItem.dataUrl || selectedItem.url}
                    alt={selectedItem.title || 'Image'}
                    className="w-full max-h-[80vh] object-contain"
                  />
                </Card>
              )}

              {(selectedItem.title || selectedItem.description) && (
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
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary font-ui text-xs"
                        >
                          {tag}
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
