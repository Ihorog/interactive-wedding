import { SectionId } from '@/App'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CalendarWidget } from '@/components/CalendarWidget'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Camera, Users, Sparkle, Gift, Star } from '@phosphor-icons/react'

interface HomeProps {
    onNavigate: (section: SectionId) => void
}

const sections = [
    { 
        id: 'ayakscho' as const, 
        title: 'А якщо', 
        description: 'Початок нашої історії',
        icon: Sparkle,
        gradient: 'from-amber-100 to-amber-200'
    },
    { 
        id: 'razom' as const, 
        title: 'Разом', 
        description: 'Церемонія та урочистості',
        icon: Heart,
        gradient: 'from-rose-100 to-rose-200'
    },
    { 
        id: 'lyubyty' as const, 
        title: 'Любити', 
        description: 'Романтичні моменти',
        icon: Heart,
        gradient: 'from-pink-100 to-pink-200'
    },
    { 
        id: 'zhyttya' as const, 
        title: 'Життя', 
        description: 'Неформальні миті',
        icon: Camera,
        gradient: 'from-blue-100 to-blue-200'
    },
    { 
        id: 'pospravzhnomu' as const, 
        title: 'По справжньому', 
        description: 'Гості та святкування',
        icon: Users,
        gradient: 'from-purple-100 to-purple-200'
    },
    { 
        id: 'radity' as const, 
        title: 'Радіти', 
        description: 'Емоційні піки',
        icon: Star,
        gradient: 'from-yellow-100 to-yellow-200'
    },
    { 
        id: 'mriyaty' as const, 
        title: 'Мріяти', 
        description: 'Майбутнє разом',
        icon: Gift,
        gradient: 'from-indigo-100 to-indigo-200'
    },
]

export function Home({ onNavigate }: HomeProps) {
    return (
        <div className="min-h-screen pt-24 pb-32 px-6">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 golden-glow-tr"
                >
                    <h1 className="font-display text-6xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
                        Дмитро та Александра
                    </h1>
                    <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Наш весільний альбом — історія кохання, збережена у фотографіях та спогадах
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="volumetric-card p-8 h-full golden-glow-bl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Heart size={32} weight="duotone" className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-display text-3xl font-bold text-foreground">
                                        Наша Історія
                                    </h2>
                                    <p className="font-ui text-sm text-muted-foreground uppercase tracking-wide">
                                        З любов'ю
                                    </p>
                                </div>
                            </div>
                            <p className="font-body text-lg leading-relaxed text-foreground">
                                Кожна фотографія у цьому альбомі — це момент нашої історії кохання. 
                                Від перших кроків до найщасливішого дня нашого життя.
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <CalendarWidget />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="font-display text-4xl font-bold text-center mb-8 text-primary">
                        Розділи Альбому
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section, index) => {
                            const Icon = section.icon
                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                >
                                    <Card 
                                        className="volumetric-card p-6 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                                        onClick={() => onNavigate(section.id)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon size={24} weight="duotone" className="text-primary" />
                                            </div>
                                            <ArrowRight 
                                                size={20} 
                                                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
                                            />
                                        </div>
                                        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                                            {section.title}
                                        </h3>
                                        <p className="font-body text-sm text-muted-foreground">
                                            {section.description}
                                        </p>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-16 text-center"
                >
                    <p className="font-body text-muted-foreground italic">
                        "Кохання — це не лише дивитися одне на одного, але й дивитися в одному напрямку"
                    </p>
                </motion.div>
            </div>
        </div>
    )
}