import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CaretLeft, CaretRight, Image } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { MediaItem } from '@/lib/mediaStorage'

interface PhotoSliderProps {
  items: MediaItem[]
  autoPlayInterval?: number
  className?: string
}

export function PhotoSlider({ items, autoPlayInterval = 3500, className = '' }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % items.length)
  }, [items.length])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (isHovered || items.length <= 1) return
    const timer = setInterval(goNext, autoPlayInterval)
    return () => clearInterval(timer)
  }, [goNext, autoPlayInterval, isHovered, items.length])

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

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const current = items[currentIndex]

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[16/9] relative bg-muted">
          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setSelectedItem(current)}
            >
              <img
                src={current.dataUrl || current.url}
                alt={current.title || ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {current.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
                  <p className="font-body text-white text-lg drop-shadow-lg">
                    {current.title}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white w-10 h-10"
            >
              <CaretLeft size={20} weight="bold" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white w-10 h-10"
            >
              <CaretRight size={20} weight="bold" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1)
                    setCurrentIndex(idx)
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
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
                </div>
              )}
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
