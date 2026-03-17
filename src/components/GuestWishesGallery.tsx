import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Users, Heart } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MediaItem } from '@/lib/mediaStorage'

interface GuestWishesGalleryProps {
  items: MediaItem[]
  className?: string
}

export function GuestWishesGallery({ items, className = '' }: GuestWishesGalleryProps) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)

  if (items.length === 0) {
    return (
      <Card className="volumetric-card p-12 text-center">
        <Users size={48} weight="duotone" className="mx-auto mb-4 text-primary" />
        <p className="font-body text-lg text-muted-foreground">
          Поки що немає фотографій гостей
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Card
              className="volumetric-card overflow-hidden cursor-pointer group relative"
              onClick={() => setActiveItem(item)}
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={item.dataUrl || item.url}
                  alt={item.title || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <p className="font-body text-white text-sm drop-shadow truncate max-w-[80%]">
                    {item.title || 'Натисніть для побажань'}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart size={16} weight="fill" className="text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setActiveItem(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative z-10 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <Card className="volumetric-card overflow-hidden">
                <div className="relative">
                  <img
                    src={activeItem.dataUrl || activeItem.url}
                    alt={activeItem.title || ''}
                    className="w-full max-h-[50vh] object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-black/40 hover:bg-black/60 text-white w-8 h-8"
                    onClick={() => setActiveItem(null)}
                  >
                    <X size={18} weight="bold" />
                  </Button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart size={20} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {activeItem.title || 'Гість'}
                      </h3>
                      {activeItem.metadata && (
                        <p className="font-ui text-xs text-muted-foreground uppercase tracking-wide">
                          Побажання
                        </p>
                      )}
                    </div>
                  </div>

                  {activeItem.description ? (
                    <p className="font-body text-lg leading-relaxed text-foreground italic">
                      "{activeItem.description}"
                    </p>
                  ) : (
                    <p className="font-body text-base text-muted-foreground italic">
                      Щасливих вам спільних миттєвостей і незабутніх спогадів!
                    </p>
                  )}

                  {activeItem.tags && activeItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {activeItem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary font-ui text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
