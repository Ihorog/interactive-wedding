import { Card } from '@/components/ui/card'
import { MediaGallery } from '@/components/MediaGallery'
import { motion } from 'framer-motion'
import { Gift } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import type { MediaItem } from '@/lib/mediaStorage'

export function Mriyaty() {
    const [mediaItems] = useKV<MediaItem[]>('wedding-media', [])
    
    const sectionMedia = mediaItems?.filter(item => 
        item.section === 'mriyaty' || 
        (item.section === 'unassigned' && item.tags?.includes('future'))
    ) || []

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

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {sectionMedia.length === 0 ? (
                        <Card className="volumetric-card p-8 text-center">
                            <p className="font-body text-lg text-muted-foreground">
                                Наші мрії, плани та побажання на спільне майбутнє.
                                <br />
                                <span className="text-sm italic mt-4 block">
                                    Використайте AI-помічник для додавання фото та побажань у цей розділ
                                </span>
                            </p>
                        </Card>
                    ) : (
                        <MediaGallery items={sectionMedia} columns={3} />
                    )}
                </motion.div>
            </div>
        </div>
    )
}