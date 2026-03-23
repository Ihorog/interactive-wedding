import { Card } from '@/components/ui/card'
import { MediaGallery } from '@/components/MediaGallery'
import { VideoShowcase } from '@/components/VideoShowcase'
import { YouTubeLinksManager, WishesSection } from '@/components/WeddingWishes'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Gift, Video } from '@phosphor-icons/react'
import { useContext } from 'react'
import { ManifestContext } from '@/hooks/useManifest'

export function Mriyaty() {
    const mediaItems = useContext(ManifestContext)
    
    const sectionMedia = mediaItems.filter(item => item.section === 'Мріяти')

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
                        <Gift size={32} weight="duotone" className="text-primary" />
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-primary mb-4">
                        Мріяти
                    </h1>
                    <p className="font-body text-xl text-muted-foreground">
                        Майбутнє разом
                    </p>
                </motion.div>

                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <YouTubeLinksManager />
                    </motion.div>

                    {(videos.length > 0 || photos.length > 0) && (
                        <>
                            <div className="flex items-center gap-4">
                                <Separator className="flex-1" />
                                <span className="font-ui text-xs uppercase text-muted-foreground tracking-wide">
                                    Медіа
                                </span>
                                <Separator className="flex-1" />
                            </div>

                            {videos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <VideoShowcase
                                        videos={videos}
                                        title="Побажання і мрії"
                                        description="Наше спільне майбутнє"
                                    />
                                </motion.div>
                            )}

                            {photos.length > 0 && (
                                <>
                                    {videos.length > 0 && (
                                        <div className="flex items-center gap-4">
                                            <Separator className="flex-1" />
                                            <span className="font-ui text-xs uppercase text-muted-foreground tracking-wide">
                                                Фотографії
                                            </span>
                                            <Separator className="flex-1" />
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <MediaGallery items={photos} columns={3} />
                                    </motion.div>
                                </>
                            )}
                        </>
                    )}

                    {sectionMedia.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="volumetric-card p-12 text-center">
                                <Video size={64} weight="duotone" className="mx-auto mb-6 text-primary" />
                                <p className="font-body text-lg text-muted-foreground mb-4">
                                    Наші мрії, плани та побажання на спільне майбутнє
                                </p>
                                <p className="font-body text-sm text-muted-foreground italic">
                                    Використайте AI-помічник або форму нижче для додавання контенту
                                </p>
                            </Card>
                        </motion.div>
                    )}

                    <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="font-ui text-xs uppercase text-muted-foreground tracking-wide">
                            Побажання
                        </span>
                        <Separator className="flex-1" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <WishesSection />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}