import { Card } from '@/components/ui/card'
import { VideoPlayer } from '@/components/VideoPlayer'
import { motion } from 'framer-motion'
import { Play } from '@phosphor-icons/react'
import type { MediaItem } from '@/lib/mediaStorage'

interface VideoShowcaseProps {
  videos: MediaItem[]
  title?: string
  description?: string
  featuredIndex?: number
  className?: string
}

export function VideoShowcase({ 
  videos, 
  title, 
  description, 
  featuredIndex = 0,
  className = '' 
}: VideoShowcaseProps) {
  if (videos.length === 0) {
    return null
  }

  const featuredVideo = videos[featuredIndex] || videos[0]
  const otherVideos = videos.filter((_, idx) => idx !== featuredIndex)

  return (
    <div className={`space-y-6 ${className}`}>
      {(title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-3">
              {title}
            </h2>
          )}
          {description && (
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <VideoPlayer
          src={featuredVideo.dataUrl || featuredVideo.url || ''}
          poster={featuredVideo.thumbnail}
          title={featuredVideo.title}
          className="w-full"
        />
      </motion.div>

      {otherVideos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {otherVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <VideoPlayer
                src={video.dataUrl || video.url || ''}
                poster={video.thumbnail}
                title={video.title}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {videos.length === 0 && (
        <Card className="volumetric-card p-12 text-center">
          <div className="text-muted-foreground">
            <Play size={48} weight="duotone" className="mx-auto mb-4 text-primary" />
            <p className="font-body text-lg mb-2">
              Відеомоменти для цього розділу
            </p>
            <p className="font-body text-sm">
              Використайте AI-помічник для додавання відео церемонії
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
