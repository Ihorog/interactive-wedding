import { useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Image } from '@phosphor-icons/react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MediaItem } from '@/lib/mediaStorage'

interface ParallaxCardProps {
  item: MediaItem
  index: number
  onClick: () => void
}

function ParallaxCard({ item, index, onClick }: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const baseSpeed = index % 3 === 0 ? 0.3 : index % 3 === 1 ? 0.5 : 0.4
  const y = useTransform(scrollYProgress, [0, 1], [-40 * baseSpeed * 100, 40 * baseSpeed * 100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.96])

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl cursor-pointer" onClick={onClick}>
      <motion.div style={{ y, scale }} className="relative">
        <Card className="volumetric-card overflow-hidden group">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            <img
              src={item.dataUrl || item.url}
              alt={item.title || ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {item.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="font-body text-white text-base drop-shadow">
                  {item.title}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

interface ParallaxGalleryProps {
  items: MediaItem[]
  className?: string
}

export function ParallaxGallery({ items, className = '' }: ParallaxGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  if (items.length === 0) {
    return (
      <Card className="volumetric-card p-12 text-center">
        <Image size={48} weight="duotone" className="mx-auto mb-4 text-primary" />
        <p className="font-body text-lg text-muted-foreground">
          Поки що немає фотографій
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {items.map((item, index) => (
          <ParallaxCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl p-0 border-none bg-transparent">
          {selectedItem && (
            <Card className="volumetric-card overflow-hidden">
              <img
                src={selectedItem.dataUrl || selectedItem.url}
                alt={selectedItem.title || 'Image'}
                className="w-full max-h-[80vh] object-contain"
              />
              {(selectedItem.title || selectedItem.description) && (
                <div className="p-6">
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
                </div>
              )}
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
