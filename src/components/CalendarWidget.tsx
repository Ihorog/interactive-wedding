import { SectionId } from '@/App'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, CaretDown } from '@phosphor-icons/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

interface CalendarEvent {
    id: string
    date: string
    title: string
    description?: string
    type: 'wedding' | 'anniversary' | 'birthday' | 'holiday' | 'custom'
}

interface CalendarWidgetProps {
    compact?: boolean
    section?: SectionId
}

export function CalendarWidget({ compact = false, section }: CalendarWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [events] = useKV<CalendarEvent[]>('calendar-events', [])
    
    const today = new Date()
    const dayOfWeek = today.toLocaleDateString('uk-UA', { weekday: 'long' })
    const dayNum = today.getDate()
    const month = today.toLocaleDateString('uk-UA', { month: 'long' })
    const year = today.getFullYear()
    
    const upcomingEvents = (events || [])
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

    if (compact && section !== 'home') {
        return (
            <div className="fixed top-20 right-6 z-40">
                <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Card className="px-4 py-2 volumetric-card cursor-pointer">
                        <div className="flex items-center gap-2">
                            <span className="font-ui text-sm font-semibold capitalize text-foreground">
                                {dayOfWeek}
                            </span>
                            {upcomingEvents.length > 0 && (
                                <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center">
                                    {upcomingEvents.length}
                                </Badge>
                            )}
                        </div>
                    </Card>
                </motion.button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-80"
                        >
                            <Card className="volumetric-card p-4">
                                <FullCalendarWidget events={upcomingEvents} />
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div className="volumetric-card p-6 max-w-md">
            <FullCalendarWidget events={upcomingEvents} showAll />
        </div>
    )
}

interface FullCalendarWidgetProps {
    events: CalendarEvent[]
    showAll?: boolean
}

function FullCalendarWidget({ events, showAll = false }: FullCalendarWidgetProps) {
    const today = new Date()
    const dayNum = today.getDate()
    const month = today.toLocaleDateString('uk-UA', { month: 'long' })
    const year = today.getFullYear()
    const dayOfWeek = today.toLocaleDateString('uk-UA', { weekday: 'long' })
    const hours = today.getHours()
    const minutes = today.getMinutes()

    return (
        <div className="space-y-4">
            {showAll && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="tear-off-calendar">
                        <div className="bg-destructive text-destructive-foreground px-3 py-1 text-center rounded-t-lg font-ui text-xs font-bold uppercase">
                            {month}
                        </div>
                        <div className="bg-card p-4 text-center rounded-b-lg border border-border">
                            <div className="font-display text-5xl font-bold text-primary">
                                {dayNum}
                            </div>
                            <div className="font-ui text-xs text-muted-foreground uppercase mt-1">
                                {year}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 rounded-full border-4 border-secondary"></div>
                            <div 
                                className="absolute top-1/2 left-1/2 w-1 h-12 bg-primary origin-bottom -translate-x-1/2 -translate-y-full"
                                style={{ 
                                    transform: `translate(-50%, -100%) rotate(${(hours % 12) * 30 + minutes * 0.5}deg)` 
                                }}
                            ></div>
                            <div 
                                className="absolute top-1/2 left-1/2 w-0.5 h-14 bg-accent origin-bottom -translate-x-1/2 -translate-y-full"
                                style={{ 
                                    transform: `translate(-50%, -100%) rotate(${minutes * 6}deg)` 
                                }}
                            ></div>
                            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Calendar size={20} weight="duotone" className="text-primary" />
                    <h3 className="font-ui font-semibold text-sm uppercase tracking-wide">
                        {showAll ? 'Найближчі події' : 'Події'}
                    </h3>
                </div>
                
                {events.length > 0 ? (
                    <div className="space-y-2">
                        {events.map(event => (
                            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0 w-12 text-center">
                                    <div className="font-display text-lg font-bold text-primary">
                                        {new Date(event.date).getDate()}
                                    </div>
                                    <div className="font-ui text-xs text-muted-foreground">
                                        {new Date(event.date).toLocaleDateString('uk-UA', { month: 'short' })}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-body font-semibold text-sm">
                                        {event.title}
                                    </div>
                                    {event.description && (
                                        <div className="font-body text-xs text-muted-foreground mt-0.5">
                                            {event.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground font-body text-sm">
                        Немає найближчих подій
                    </div>
                )}
            </div>
        </div>
    )
}