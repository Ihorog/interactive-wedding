import { Card } from '@/components/ui/card'
import { MediaGallery } from '@/components/MediaGallery'
import { VideoShowcase } from '@/components/VideoShowcase'
import { PhotoSlider } from '@/components/PhotoSlider'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Camera, Video } from '@phosphor-icons/react'
import { useContext } from 'react'
import { ManifestContext } from '@/hooks/useManifest'

export function Zhyttya() {
    const mediaItems = useContext(ManifestContext)
    
    const sectionMedia = mediaItems.filter(item => item.section === 'Життя')

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
                        <Camera size={32} weight="duotone" className="text-primary" />
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-primary mb-4">
                        Життя
                    </h1>
                    <p className="font-body text-xl text-muted-foreground">
                        Неформальні миті
                    </p>
                </motion.div>

                {sectionMedia.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="volumetric-card p-12 text-center">
                            <Video size={64} weight="duotone" className="mx-auto mb-6 text-primary" />
                            <p className="font-body text-lg text-muted-foreground mb-4">
                                Живі, щирі моменти, коли ми просто були собою
                            </p>
                            <p className="font-body text-sm text-muted-foreground italic">
                                Використайте AI-помічник для додавання фото та відео у цей розділ
                            </p>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {photos.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="text-center mb-6">
                                    <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                                        Жива галерея
                                    </h2>
                                    <p className="font-body text-muted-foreground">
                                        Фотографії автоматично змінюються, створюючи ефект живої плівки
                                    </p>
                                </div>
                                <PhotoSlider items={photos} autoPlayInterval={4000} />
                            </motion.div>
                        )}

                        {videos.length > 0 && (
                            <>
                                {photos.length > 0 && (
                                    <div className="flex items-center gap-4">
                                        <Separator className="flex-1" />
                                        <span className="font-ui text-xs uppercase text-muted-foreground tracking-wide">
                                            Відео
                                        </span>
                                        <Separator className="flex-1" />
                                    </div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <VideoShowcase
                                        videos={videos}
                                        title="Живі моменти"
                                        description="Щирі та неформальні миті дня"
                                    />
                                </motion.div>
                            </>
                        )}

                        {photos.length > 1 && (
                            <>
                                <div className="flex items-center gap-4">
                                    <Separator className="flex-1" />
                                    <span className="font-ui text-xs uppercase text-muted-foreground tracking-wide">
                                        Всі фотографії
                                    </span>
                                    <Separator className="flex-1" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <MediaGallery items={photos} columns={3} />
                                </motion.div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}