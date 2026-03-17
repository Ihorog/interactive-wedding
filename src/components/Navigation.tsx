import { useState } from 'react'
import { SectionId } from '@/App'
import { Button } from '@/components/ui/button'
import { House, List, X } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
    currentSection: SectionId
    onNavigate: (section: SectionId) => void
}

?const sections: { id: SectionId; label: string; emoji: string }[] = [
    { id: 'home', label: 'Головна', emoji: '🏠' },
    { id: 'ayakscho', label: 'А якщо', emoji: '✨' },
    { id: 'razom', label: 'Разом', emoji: '💍' },
    { id: 'lyubyty', label: 'Любити', emoji: '❤️' },
    { id: 'zhyttya', label: 'Життя', emoji: '🌿' },
    { id: 'pospravzhnomu', label: 'По справжньому', emoji: '🎉' },
    { id: 'radity', label: 'Радіти', emoji: '🌟' },
    { id: 'mriyaty', label: 'Мріяти', emoji: '🌙' },
]

export function Navigation({ currentSection, onNavigate }: NavigationProps) {
    const isMobile = useIsMobile()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleNavigate = (id: SectionId) => {
        onNavigate(id)
        setMobileMenuOpen(false)
    }

    if (isMobile) {
        return (
            <>
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border">
                    <div className="flex items-center justify-around px-4 py-3">
                        <Button
                            variant={currentSection === 'home' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleNavigate('home')}
                        >
                            <House size={20} weight={currentSection === 'home' ? 'fill' : 'regular'} />
                        </Button>
                        <Button
                            variant={mobileMenuOpen ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                            aria-label="Меню розділів"
                        >
                            {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} />}
                        </Button>
                    </div>
                </nav>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            {/* Slide-up drawer */}
                            <motion.div
                                key="drawer"
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed bottom-16 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border rounded-t-2xl shadow-xl"
                            >
                                <div className="px-4 pt-4 pb-2">
                                    <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
                                    <p className="font-ui text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
                                        Розділи альбому
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 px-4 pb-6">
                                    {sections.slice(1).map((section) => (
                                        <Button
                                            key={section.id}
                                            variant={currentSection === section.id ? 'default' : 'ghost'}
                                            className="flex items-center gap-2 justify-start h-12 font-ui text-sm"
                                            onClick={() => handleNavigate(section.id)}
                                        >
                                            <span>{section.emoji}</span>
                                            <span>{section.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
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