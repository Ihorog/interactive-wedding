import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { formatDuration } from '@/lib/mediaStorage'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
}

export function VideoPlayer({ 
  src, 
  poster, 
  title, 
  className = '',
  autoPlay = false,
  muted = true,
  controls = true
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = percent * duration
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Card 
      className={`volumetric-card overflow-hidden relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        className="w-full aspect-video object-cover"
      />

      {controls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || !isPlaying ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all"
            >
              {isPlaying ? (
                <Pause size={32} weight="fill" className="text-white" />
              ) : (
                <Play size={32} weight="fill" className="text-white" />
              )}
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            {title && (
              <p className="font-body text-sm text-white mb-2 drop-shadow-lg">
                {title}
              </p>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                {isMuted ? (
                  <SpeakerSlash size={18} className="text-white" />
                ) : (
                  <SpeakerHigh size={18} className="text-white" />
                )}
              </Button>

              <div className="flex-1 flex items-center gap-2">
                <span className="font-ui text-xs text-white min-w-[40px]">
                  {formatDuration(currentTime)}
                </span>
                
                <div
                  onClick={handleSeek}
                  className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all overflow-hidden"
                >
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <span className="font-ui text-xs text-white min-w-[40px] text-right">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}
