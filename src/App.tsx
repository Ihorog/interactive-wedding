import { Home } from './pages/Home'
import { AYakscho } from './pages/AYakscho'
import { Razom } from './pages/Razom'
import { Lyubyty } from './pages/Lyubyty'
import { Zhyttya } from './pages/Zhyttya'
import { PoSpravzhnomu } from './pages/PoSpravzhnomu'
import { Radity } from './pages/Radity'
import { Mriyaty } from './pages/Mriyaty'
import { Navigation } from './components/Navigation'
import { CalendarWidget } from './components/CalendarWidget'
import { AIChat } from './components/AIChat'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useManifest, ManifestContext } from './hooks/useManifest'

export type SectionId = 'home' | 'ayakscho' | 'razom' | 'lyubyty' | 'zhyttya' | 'pospravzhnomu' | 'radity' | 'mriyaty'

function App() {
    const [currentSection, setCurrentSection] = useState<SectionId>('home')
    const [isChatOpen, setIsChatOpen] = useState(false)
    const { items } = useManifest()

    const renderSection = () => {
        switch (currentSection) {
            case 'home':
                return <Home onNavigate={setCurrentSection} />
            case 'ayakscho':
                return <AYakscho />
            case 'razom':
                return <Razom />
            case 'lyubyty':
                return <Lyubyty />
            case 'zhyttya':
                return <Zhyttya />
            case 'pospravzhnomu':
                return <PoSpravzhnomu />
            case 'radity':
                return <Radity />
            case 'mriyaty':
                return <Mriyaty />
            default:
                return <Home onNavigate={setCurrentSection} />
        }
    }

    return (
        <ManifestContext.Provider value={items}>
        <div className="min-h-screen gradient-wedding-bg relative overflow-x-hidden">
            <Navigation currentSection={currentSection} onNavigate={setCurrentSection} />
            
            <AnimatePresence mode="wait">
                <motion.main
                    key={currentSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="relative z-10"
                >
                    {renderSection()}
                </motion.main>
            </AnimatePresence>

            {currentSection !== 'home' && (
                <CalendarWidget compact section={currentSection} />
            )}

            <AIChat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
        </div>
        </ManifestContext.Provider>
    )
}

export default App