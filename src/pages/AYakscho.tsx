import { Card } from '@/components/ui/card'
import { MediaGallery } from '@/components/MediaGallery'
import { VideoShowcase } from '@/components/VideoShowcase'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Sparkle, Video, Clock } from '@phosphor-icons/react'
import { useContext } from 'react'
import { ManifestContext } from '@/hooks/useManifest'

const timelineSteps = [
    { emoji: '💍', label: 'Заручини', description: 'Початок нашої спільної мандрівки' },
    { emoji: '📋', label: 'Підготовка', description: 'Плануємо найважливіший день' },
    { emoji: '💐', label: 'Квіти', description: 'Деталі, що роблять день особливим' },
    { emoji: '👗', label: 'Образи', description: 'Вбрання нареченої та нареченого' },
    { emoji: '🎊', label: 'Готові!', description: 'Назустріч нашому святу' },
]

export function AYakscho() {
    const mediaItems = useContext(ManifestContext)
    
    const sectionMedia = mediaItems.filter(item => item.section === 'А якщо')

    const videos = sectionMedia.filter(item => item.type === 'video')
    const photos = sectionMedia.filter(item => item.type === 'image')

    return (
        <div className="min-h-screen pt-28 pb-32 px-6">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                        <Sparkle size={32} weight="duotone" className="text-primary" />
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-primary mb-4">
                        А якщо
                    </h1>
                    <p className="font-body text-xl text-muted-foreground">
                        Початок нашої історії
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-6 justify-center">
                        <Clock size={22} weight="duotone" className="text-primary" />
                        <h2 className="font-display text-2xl font-bold text-primary">
                            Шлях до свята
                        </h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
                        <div className="space-y-6 md:space-y-0">
                            {timelineSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.12 }}
                                    className={`flex items-center gap-4 md:gap-8 ${
                                        idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <Card className="volumetric-card p-4 inline-block max-w-xs">
                                            <p className="font-display text-lg font-bold text-foreground">
                                                {step.label}
                                            </p>
                                            <p className="font-body text-sm text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </Card>
                                    </div>
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-2xl z-10">
                                        {step.emoji}
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {sectionMedia.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Card className="volumetric-card p-12 text-center">
                            <Video size={64} weight="duotone" className="mx-auto mb-6 text-primary" />
                            <p className="font-body text-lg text-muted-foreground mb-4">
                                Перші кроки та підготовка до найважливішого дня
                            </p>
                            <p className="font-body text-sm text-muted-foreground italic">
                                Використайте AI-помічник для додавання фото та відео у цей розділ
                            </p>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {videos.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <VideoShowcase
                                    videos={videos}
                                    title="Підготовка до свята"
                                    description="Перші хвилюючі моменти"
                                />
                            </motion.div>
                        )}

                        {videos.length > 0 && photos.length > 0 && (
                            <div className="flex items-center gap-4">
                                <Separator className="flex-1" />
                                <span className="font-ui text-xs uppercase text-muted-foreground tracking-wide">
                                    Фотографії
                                </span>
                                <Separator className="flex-1" />
                            </div>
                        )}

                        {photos.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <MediaGallery items={photos} columns={3} />
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}