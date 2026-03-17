import { SectionId } from '@/App'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CalendarBlank, PencilSimple, Plus, X, CalendarCheck } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
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

function useCurrentTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function ClockFace({ now }: { now: Date }) {
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  const hourDeg = hours * 30 + minutes * 0.5
  const minuteDeg = minutes * 6 + seconds * 0.1
  const secondDeg = seconds * 6

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Face */}
        <circle cx="50" cy="50" r="48" fill="white" stroke="#EAD79A" strokeWidth="3"/>
        {/* Hour marks */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 50 + 40 * Math.cos(angle)
          const y1 = 50 + 40 * Math.sin(angle)
          const x2 = 50 + (i % 3 === 0 ? 34 : 37) * Math.cos(angle)
          const y2 = 50 + (i % 3 === 0 ? 34 : 37) * Math.sin(angle)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D9B763" strokeWidth={i % 3 === 0 ? 2 : 1} />
        })}
        {/* Hour hand */}
        <line
          x1="50" y1="50"
          x2={50 + 25 * Math.sin(hourDeg * Math.PI / 180)}
          y2={50 - 25 * Math.cos(hourDeg * Math.PI / 180)}
          stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="50" y1="50"
          x2={50 + 35 * Math.sin(minuteDeg * Math.PI / 180)}
          y2={50 - 35 * Math.cos(minuteDeg * Math.PI / 180)}
          stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1="50" y1="50"
          x2={50 + 38 * Math.sin(secondDeg * Math.PI / 180)}
          y2={50 - 38 * Math.cos(secondDeg * Math.PI / 180)}
          stroke="#D9B763" strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="#D9B763"/>
      </svg>
    </div>
  )
}

function TearOffCalendar({ now }: { now: Date }) {
  const day = now.getDate()
  const month = now.toLocaleDateString('uk-UA', { month: 'long' })
  const year = now.getFullYear()
  const weekday = now.toLocaleDateString('uk-UA', { weekday: 'long' })

  return (
    <div className="w-28 rounded-xl overflow-hidden shadow-lg border border-[#EAD79A]">
      {/* Red strip - month */}
      <div className="bg-red-600 text-white text-center py-1.5 px-2">
        <span className="font-ui text-xs font-bold uppercase tracking-wider">{month}</span>
      </div>
      {/* White area - day */}
      <div className="bg-white px-2 py-3 text-center">
        <div className="font-display text-5xl font-bold text-[#D9B763] leading-none">{day}</div>
        <div className="font-ui text-[10px] text-[#4D4D4D] mt-1 uppercase tracking-wide">{weekday}</div>
        <div className="font-ui text-[10px] text-gray-400">{year}</div>
      </div>
    </div>
  )
}

interface EventEditModalProps {
  events: CalendarEvent[]
  onSave: (events: CalendarEvent[]) => void
  onClose: () => void
}

function EventEditModal({ events, onSave, onClose }: EventEditModalProps) {
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(events)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const addEvent = () => {
    if (!newTitle || !newDate) return
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: newDate,
      title: newTitle,
      description: newDesc,
      type: 'custom',
    }
    setLocalEvents(prev => [...prev, event])
    setNewTitle('')
    setNewDate('')
    setNewDesc('')
  }

  const removeEvent = (id: string) => {
    setLocalEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Редагувати події календаря</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {localEvents.map(e => (
            <div key={e.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
              <div>
                <div className="font-body font-semibold text-sm">{e.title}</div>
                <div className="font-ui text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString('uk-UA')}</div>
                {e.description && <div className="font-body text-xs text-muted-foreground mt-0.5">{e.description}</div>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeEvent(e.id)} className="h-7 w-7 flex-shrink-0">
                <X size={14}/>
              </Button>
            </div>
          ))}
          <div className="border-t pt-4 space-y-2">
            <p className="font-ui text-xs font-semibold uppercase text-muted-foreground tracking-wide">Нова подія</p>
            <Input placeholder="Назва події" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="font-body"/>
            <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="font-body"/>
            <Input placeholder="Опис (необов'язково)" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="font-body"/>
            <Button onClick={addEvent} disabled={!newTitle || !newDate} className="w-full">
              <Plus size={16} className="mr-2"/>Додати подію
            </Button>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Скасувати</Button>
          <Button onClick={() => { onSave(localEvents); onClose() }} className="flex-1">Зберегти</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventList({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground font-body text-sm">
        Немає найближчих подій
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {events.map(event => (
        <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex-shrink-0 w-12 text-center">
            <div className="font-display text-lg font-bold text-[#D9B763]">
              {new Date(event.date).getDate()}
            </div>
            <div className="font-ui text-[10px] text-muted-foreground">
              {new Date(event.date).toLocaleDateString('uk-UA', { month: 'short' })}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-body font-semibold text-sm text-[#2C2C2C]">{event.title}</div>
            {event.description && (
              <div className="font-body text-xs text-[#4D4D4D] mt-0.5">{event.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CalendarWidget({ compact = false, section }: CalendarWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [events, setEvents] = useKV<CalendarEvent[]>('calendar-events', [])
  const now = useCurrentTime()

  const upcomingEvents = (events || [])
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  if (compact && section !== 'home') {
    // Use Intl.Collator-compatible approach for locale-aware capitalization
    const weekday = now.toLocaleDateString('uk-UA', { weekday: 'long' })
    // CSS text-transform capitalize handles the rest; we ensure first char uppercase for safety
    const weekdayDisplay = weekday.length > 0
      ? String.fromCodePoint(weekday.codePointAt(0)!).toUpperCase() + weekday.slice(weekday.codePointAt(0)! > 0xFFFF ? 2 : 1)
      : weekday

    return (
      <>
        {isEditing && (
          <EventEditModal
            events={events || []}
            onSave={setEvents}
            onClose={() => setIsEditing(false)}
          />
        )}
        <div className="fixed top-20 right-6 z-40">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="px-4 py-2 volumetric-card cursor-pointer border-[#EAD79A]">
              <div className="flex items-center gap-2">
                <CalendarBlank size={16} weight="duotone" className="text-[#D9B763]"/>
                <span className="font-ui text-sm font-semibold capitalize text-foreground">
                  {weekdayDisplay}
                </span>
                {upcomingEvents.length > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white text-[10px]">
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
                <Card className="volumetric-card p-4 border-[#EAD79A]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-ui font-semibold text-sm uppercase tracking-wide text-[#4D4D4D]">Найближчі події</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                      <PencilSimple size={14} className="text-[#D9B763]"/>
                    </Button>
                  </div>
                  <EventList events={upcomingEvents} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    )
  }

  // Home / full widget
  return (
    <>
      {isEditing && (
        <EventEditModal
          events={events || []}
          onSave={setEvents}
          onClose={() => setIsEditing(false)}
        />
      )}
      <div className="volumetric-card p-6 rounded-2xl border-[#EAD79A] space-y-6">
        {/* Top row: TearOffCalendar + Clock */}
        <div className="flex items-center justify-around gap-4">
          <TearOffCalendar now={now} />
          <ClockFace now={now} />
        </div>

        {/* Events section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} weight="duotone" className="text-[#D9B763]"/>
              <h3 className="font-ui font-semibold text-sm uppercase tracking-wide text-[#4D4D4D]">
                Найближчі події
              </h3>
              {upcomingEvents.length > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white text-[10px]">
                  {upcomingEvents.length}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
              <PencilSimple size={14} className="text-[#D9B763]"/>
            </Button>
          </div>
          <EventList events={upcomingEvents} />
        </div>
      </div>
    </>
  )
}
