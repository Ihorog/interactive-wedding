import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Heart } from '@phosphor-icons/react'

export function Razom() {
    return (
        <div className="min-h-screen pt-28 pb-32 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                        <Heart size={32} weight="duotone" className="text-primary" />
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-primary mb-4">
                        Разом
                    </h1>
                    <p className="font-body text-xl text-muted-foreground">
                        Церемонія та урочистості
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="volumetric-card p-8 text-center">
                        <p className="font-body text-lg text-muted-foreground">
                            Офіційні моменти церемонії та розпису.
                            <br />
                            <span className="text-sm italic mt-4 block">
                                Використайте AI-помічник для додавання фото та відео у цей розділ
                            </span>
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}