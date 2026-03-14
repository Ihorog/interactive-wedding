import { SectionId } from '@/App'
import { Button } from '@/components/ui/button'
import { House, List, X, Heart } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
    currentSection: SectionId
    onNavigate: (section: SectionId) => void
}

const sections: { id: SectionId; label: string; emoji: string; short: string }[] = [
    { id: 'home', label: 'Головна', emoji: '🏠', short: 'Головна' },
    { id: 'ayakscho', label: 'А якщо', emoji: '✨', short: 'А якщо' },
    { id: 'razom', label: 'Разом', emoji: '💍', short: 'Разом' },
    { id: 'lyubyty', label: 'Любити', emoji: '❤️', short: 'Любити' },
    { id: 'zhyttya', label: 'Життя', emoji: '📸', short: 'Життя' },
    { id: 'pospravzhnomu', label: 'По справжньому', emoji: '🥂', short: 'Гості' },
    { id: 'radity', label: 'Радіти', emoji: '🎉', short: 'Радіти' },
    { id: 'mriyaty', label: 'Мріяти', emoji: '🌟', short: 'Мріяти' },
]

export function Navigation({ currentSection, onNavigate }: NavigationProps) {
    const isMobile = useIsMobile()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleNavigate = (id: SectionId) => {
        onNavigate(id)
        setIsMobileMenuOpen(false)
    }

    if (isMobile) {
        return (
            <>
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-[#EAD79A]">
                    <div className="flex items-center justify-around px-4 py-2">
                        <Button
                            variant={currentSection === 'home' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleNavigate('home')}
                            className="flex flex-col gap-0.5 h-auto py-1.5"
                        >
                            <House size={20} weight={currentSection === 'home' ? 'fill' : 'regular'} />
                            <span className="font-ui text-[10px]">Головна</span>
                        </Button>
                        {sections.slice(1, 5).map(s => (
                            <Button
                                key={s.id}
                                variant={currentSection === s.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handleNavigate(s.id)}
                                className="flex flex-col gap-0.5 h-auto py-1.5 px-2"
                            >
                                <span className="text-base">{s.emoji}</span>
                                <span className="font-ui text-[10px] leading-none">{s.short}</span>
                            </Button>
                        ))}
                        <Button
                            variant={isMobileMenuOpen ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex flex-col gap-0.5 h-auto py-1.5"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
                            <span className="font-ui text-[10px]">Ще</span>
                        </Button>
                    </div>
                </nav>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            className="fixed bottom-16 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-[#EAD79A] rounded-t-2xl shadow-2xl"
                        >
                            <div className="p-4 space-y-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <Heart size={16} weight="fill" className="text-[#D9B763]" />
                                    <span className="font-ui text-xs uppercase tracking-widest text-[#4D4D4D]">Розділи альбому</span>
                                </div>
                                {sections.map(s => (
                                    <Button
                                        key={s.id}
                                        variant={currentSection === s.id ? 'default' : 'ghost'}
                                        className="w-full justify-start gap-3 font-body text-base h-11"
                                        onClick={() => handleNavigate(s.id)}
                                    >
                                        <span className="text-xl">{s.emoji}</span>
                                        {s.label}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        )
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/85 backdrop-blur-md border-b border-[#EAD79A]">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('home')}
                        className="font-display text-xl font-bold text-[#D9B763] hover:text-[#E7C768] transition-colors flex items-center gap-2"
                    >
                        <Heart size={18} weight="fill" />
                        Наш Альбом
                    </button>
                    <div className="flex items-center gap-1">
                        {sections.slice(1).map((section) => (
                            <Button
                                key={section.id}
                                variant={currentSection === section.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => onNavigate(section.id)}
                                className={`font-ui text-xs ${currentSection === section.id ? 'bg-[#D9B763] hover:bg-[#E7C768] text-white' : 'text-[#4D4D4D] hover:text-[#2C2C2C]'}`}
                            >
                                <span className="mr-1">{section.emoji}</span>
                                {section.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}