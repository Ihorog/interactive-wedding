import { SectionId } from '@/App'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CalendarWidget } from '@/components/CalendarWidget'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Heart, Camera, Users, Sparkle, Gift, Star, Flower, DiamondsFour, MusicNote } from '@phosphor-icons/react'
import { useRef } from 'react'

interface HomeProps {
  onNavigate: (section: SectionId) => void
}

const sections = [
  {
    id: 'ayakscho' as const,
    title: 'А якщо',
    description: 'Підготовка та перші кроки',
    icon: Sparkle,
    emoji: '✨',
    gradient: 'from-amber-50 to-amber-100',
    accent: '#F9E7A1',
  },
  {
    id: 'razom' as const,
    title: 'Разом',
    description: 'Церемонія та урочистості',
    icon: DiamondsFour,
    emoji: '💍',
    gradient: 'from-rose-50 to-rose-100',
    accent: '#FFE4E1',
  },
  {
    id: 'lyubyty' as const,
    title: 'Любити',
    description: 'Романтичні моменти',
    icon: Heart,
    emoji: '❤️',
    gradient: 'from-pink-50 to-pink-100',
    accent: '#FFD6E7',
  },
  {
    id: 'zhyttya' as const,
    title: 'Життя',
    description: 'Неформальні миті',
    icon: Camera,
    emoji: '📸',
    gradient: 'from-sky-50 to-sky-100',
    accent: '#CFE8F9',
  },
  {
    id: 'pospravzhnomu' as const,
    title: 'По справжньому',
    description: 'Гості та святкування',
    icon: Users,
    emoji: '🥂',
    gradient: 'from-violet-50 to-violet-100',
    accent: '#EDE9FE',
  },
  {
    id: 'radity' as const,
    title: 'Радіти',
    description: 'Танці, сміх, сльози',
    icon: Star,
    emoji: '🎉',
    gradient: 'from-yellow-50 to-yellow-100',
    accent: '#FFF9C4',
  },
  {
    id: 'mriyaty' as const,
    title: 'Мріяти',
    description: 'Майбутнє разом',
    icon: Gift,
    emoji: '🌟',
    gradient: 'from-indigo-50 to-indigo-100',
    accent: '#E0E7FF',
  },
]

export function Home({ onNavigate }: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div className="min-h-screen pb-32">
      {/* Parallax Hero */}
      <div ref={heroRef} className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background golden glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 80% 20%, rgba(249,231,161,0.55) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(231,199,104,0.35) 0%, transparent 65%)',
          }}
        />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#EAD79A] mb-6 shadow-sm">
              <Heart size={16} weight="fill" className="text-[#D9B763]"/>
              <span className="font-ui text-xs uppercase tracking-widest text-[#4D4D4D]">17 серпня 2025</span>
              <Heart size={16} weight="fill" className="text-[#D9B763]"/>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl font-bold mb-4 tracking-tight"
            style={{ color: '#2C2C2C', textShadow: '0 2px 20px rgba(217,183,99,0.3)' }}
          >
            Дмитро
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-[#EAD79A]"/>
            <Flower size={24} weight="duotone" className="text-[#D9B763]"/>
            <span className="font-body text-2xl italic text-[#D9B763]">&amp;</span>
            <Flower size={24} weight="duotone" className="text-[#D9B763]" style={{ transform: 'scaleX(-1)' }}/>
            <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-[#EAD79A]"/>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-6xl md:text-8xl font-bold mb-8 tracking-tight"
            style={{ color: '#2C2C2C', textShadow: '0 2px 20px rgba(217,183,99,0.3)' }}
          >
            Александра
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-body text-xl md:text-2xl text-[#4D4D4D] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Наш весільний альбом — мить за миттю, серце за серцем
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              onClick={() => onNavigate('razom')}
              size="lg"
              className="font-ui bg-[#D9B763] hover:bg-[#E7C768] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Heart size={18} className="mr-2" weight="fill"/>
              Переглянути альбом
            </Button>
            <Button
              onClick={() => onNavigate('ayakscho')}
              variant="outline"
              size="lg"
              className="font-ui border-[#EAD79A] text-[#4D4D4D] hover:bg-[#F9E7A1]/30 hover:border-[#F4D98A]"
            >
              Наша Історія
              <ArrowRight size={18} className="ml-2"/>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-[#EAD79A] flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#D9B763]"/>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="px-6 pb-8">
        <div className="container mx-auto max-w-6xl">
          {/* Story + Calendar */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="volumetric-card p-8 h-full border-[#EAD79A] golden-glow-bl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#F9E7A1]/60 flex items-center justify-center">
                    <Heart size={28} weight="duotone" className="text-[#D9B763]"/>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#2C2C2C]">Наша Історія</h2>
                    <p className="font-ui text-xs text-[#4D4D4D] uppercase tracking-wide">З любов'ю назавжди</p>
                  </div>
                </div>
                <p className="font-body text-lg leading-relaxed text-[#2C2C2C]">
                  Кожна фотографія у цьому альбомі — момент нашої спільної історії кохання.
                  Від перших кроків разом до найщасливішого дня нашого життя — 17 серпня 2025 року.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['💑 Разом', '📍 Київ', '🌸 Серпень 2025'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#F9E7A1]/60 text-[#4D4D4D] font-ui text-xs border border-[#EAD79A]">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CalendarWidget />
            </motion.div>
          </div>

          {/* Section navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-3">
                Розділи Альбому
              </h2>
              <p className="font-body text-lg text-[#4D4D4D]">Оберіть розділ, щоб зануритися у спогади</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                  >
                    <Card
                      className="volumetric-card p-5 cursor-pointer group border-[#EAD79A] hover:border-[#F4D98A] transition-all duration-300 hover:-translate-y-1"
                      onClick={() => onNavigate(section.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                          <span className="text-xl">{section.emoji}</span>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-muted-foreground group-hover:text-[#D9B763] group-hover:translate-x-1 transition-all"
                        />
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#2C2C2C] mb-1">{section.title}</h3>
                      <p className="font-body text-sm text-[#4D4D4D]">{section.description}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 text-center"
          >
            <div className="inline-block px-8 py-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-[#EAD79A] shadow-sm">
              <MusicNote size={24} weight="duotone" className="mx-auto mb-3 text-[#D9B763]"/>
              <p className="font-body text-xl italic text-[#2C2C2C] max-w-2xl">
                "Кохання — це не лише дивитися одне на одного, але й дивитися в одному напрямку"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
