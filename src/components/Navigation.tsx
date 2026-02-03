import { SectionId } from '@/App'
import { Button } from '@/components/ui/button'
import { House, List } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'

interface NavigationProps {
    currentSection: SectionId
    onNavigate: (section: SectionId) => void
}

const sections: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Головна' },
    { id: 'ayakscho', label: 'А якщо' },
    { id: 'razom', label: 'Разом' },
    { id: 'lyubyty', label: 'Любити' },
    { id: 'zhyttya', label: 'Життя' },
    { id: 'pospravzhnomu', label: 'По справжньому' },
    { id: 'radity', label: 'Радіти' },
    { id: 'mriyaty', label: 'Мріяти' },
]

export function Navigation({ currentSection, onNavigate }: NavigationProps) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border">
                <div className="flex items-center justify-around px-4 py-3">
                    <Button
                        variant={currentSection === 'home' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onNavigate('home')}
                    >
                        <House size={20} weight={currentSection === 'home' ? 'fill' : 'regular'} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                    >
                        <List size={20} />
                    </Button>
                </div>
            </nav>
        )
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('home')}
                        className="font-display text-2xl font-bold text-primary hover:text-accent transition-colors"
                    >
                        Наш Альбом
                    </button>
                    <div className="flex items-center gap-2">
                        {sections.slice(1).map((section) => (
                            <Button
                                key={section.id}
                                variant={currentSection === section.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => onNavigate(section.id)}
                                className="font-ui text-xs"
                            >
                                {section.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}