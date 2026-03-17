import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SpeakerHigh, SpeakerSlash, MusicNote, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MediaItem } from '@/lib/mediaStorage'

interface BackgroundAudioProps {
  audioItems: MediaItem[]
}

export function BackgroundAudio({ audioItems }: BackgroundAudioProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentAudio = audioItems[currentIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentAudio) return

    const src = currentAudio.dataUrl || currentAudio.url
    if (!src) return

    audio.src = src
    audio.loop = audioItems.length === 1
    audio.volume = 0.4
    audio.muted = isMuted

    const handleEnded = () => {
      if (audioItems.length > 1) {
        setCurrentIndex(prev => (prev + 1) % audioItems.length)
      }
    }

    audio.addEventListener('ended', handleEnded)
    audio.play().catch(() => {})

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentIndex, currentAudio, audioItems.length, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  if (!currentAudio) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed bottom-28 right-6 z-40"
        >
          <div className="volumetric-card rounded-2xl px-4 py-3 flex items-center gap-3 bg-card/90 backdrop-blur-md shadow-lg">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MusicNote size={18} weight="duotone" className="text-primary" />
            </div>
            <div className="max-w-[140px]">
              <p className="font-ui text-xs uppercase tracking-wide text-muted-foreground">
                Звучить
              </p>
              <p className="font-body text-sm text-foreground truncate">
                {currentAudio.title || 'Фонова музика'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(m => !m)}
              className="rounded-full w-8 h-8 hover:bg-primary/10"
            >
              {isMuted ? (
                <SpeakerSlash size={18} className="text-muted-foreground" />
              ) : (
                <SpeakerHigh size={18} className="text-primary" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="rounded-full w-7 h-7 hover:bg-muted"
            >
              <X size={14} className="text-muted-foreground" />
            </Button>
          </div>
          <audio ref={audioRef} preload="auto" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
