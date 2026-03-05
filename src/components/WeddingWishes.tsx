import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { YoutubeLogo, Plus, Heart, PaperPlaneTilt } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Wish {
  id: string
  name: string
  message: string
  createdAt: number
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <Card className="volumetric-card overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {title && (
        <div className="p-4">
          <p className="font-body text-base font-semibold text-foreground">{title}</p>
        </div>
      )}
    </Card>
  )
}

export function YouTubeLinksManager() {
  const [links, setLinks] = useKV<{ id: string; url: string; title: string }[]>('mriyaty-youtube', [])
  // Note: `url` in this structure stores the extracted YouTube video ID, not the full URL
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    const id = extractYouTubeId(newUrl)
    if (!id) {
      toast.error('Некоректне посилання YouTube')
      return
    }
    setLinks(prev => [...(prev || []), { id: `yt-${Date.now()}`, url: id, title: newTitle }])
    setNewUrl('')
    setNewTitle('')
    setIsAdding(false)
    toast.success('Відео додано')
  }

  const handleRemove = (linkId: string) => {
    setLinks(prev => (prev || []).filter(l => l.id !== linkId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <YoutubeLogo size={28} weight="fill" className="text-red-500" />
          <h3 className="font-display text-2xl font-bold text-primary">Відео побажання</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(a => !a)}
          className="font-ui"
        >
          <Plus size={16} className="mr-1" />
          Додати відео
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="volumetric-card p-6 space-y-4">
              <Input
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="Посилання YouTube (напр. https://youtu.be/...)"
                className="font-body"
              />
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Назва / підпис відео"
                className="font-body"
              />
              <div className="flex gap-3">
                <Button onClick={handleAdd} className="flex-1">
                  <PaperPlaneTilt size={18} className="mr-2" />
                  Додати
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Скасувати
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {(links || []).length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {(links || []).map((link, idx) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <YouTubeEmbed videoId={link.url} title={link.title} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                onClick={() => handleRemove(link.id)}
              >
                <Plus size={16} className="rotate-45" />
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="volumetric-card p-8 text-center">
          <YoutubeLogo size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-body text-muted-foreground">
            Натисніть "Додати відео" щоб додати відео побажання з YouTube
          </p>
        </Card>
      )}
    </div>
  )
}

export function WishesSection() {
  const [wishes, setWishes] = useKV<Wish[]>('mriyaty-wishes', [])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setIsSubmitting(true)
    const wish: Wish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      createdAt: Date.now(),
    }
    setWishes(prev => [...(prev || []), wish])
    setName('')
    setMessage('')
    setIsSubmitting(false)
    toast.success('Ваше побажання додано! 💕')
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Heart size={32} weight="duotone" className="mx-auto mb-3 text-primary" />
        <h3 className="font-display text-3xl font-bold text-primary mb-2">
          Залишити побажання
        </h3>
        <p className="font-body text-muted-foreground">
          Напишіть свої щирі побажання молодятам
        </p>
      </div>

      <Card className="volumetric-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ваше ім'я"
            required
            className="font-body"
          />
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Ваше побажання молодятам..."
            rows={4}
            required
            className="font-body resize-none"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !name.trim() || !message.trim()}
          >
            <Heart size={18} className="mr-2" />
            Надіслати побажання
          </Button>
        </form>
      </Card>

      {(wishes || []).length > 0 && (
        <div className="space-y-4">
          <h4 className="font-display text-xl font-bold text-foreground">
            Побажання від гостей ({(wishes || []).length})
          </h4>
          <div className="space-y-4">
            {[...(wishes || [])].reverse().map((wish, idx) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="volumetric-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-primary text-sm">
                        {wish.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-ui text-sm font-semibold text-foreground">
                          {wish.name}
                        </span>
                        <span className="font-ui text-xs text-muted-foreground">
                          {new Date(wish.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                      <p className="font-body text-base leading-relaxed text-foreground italic">
                        "{wish.message}"
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
