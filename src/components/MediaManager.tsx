import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { X, Check, Trash, Image as ImageIcon, Video as VideoIcon, MusicNote } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { MediaItem } from '@/lib/mediaStorage'
import { formatFileSize, formatDuration } from '@/lib/mediaStorage'

interface MediaManagerProps {
  isOpen: boolean
  onClose: () => void
}

const sections = [
  { value: 'ayakscho', label: 'А якщо' },
  { value: 'razom', label: 'Разом' },
  { value: 'lyubyty', label: 'Любити' },
  { value: 'zhyttya', label: 'Життя' },
  { value: 'pospravzhnomu', label: 'По справжньому' },
  { value: 'radity', label: 'Радіти' },
  { value: 'mriyaty', label: 'Мріяти' },
  { value: 'unassigned', label: 'Без розділу' }
]

const predefinedTags = [
  'ceremony', 'preparation', 'romantic', 'casual', 'guests', 
  'celebration', 'future', 'dance', 'kiss', 'rings', 'family',
  'beginning', 'excitement', 'details', 'emotions', 'bride', 'groom',
  'anticipation', 'vows', 'solemn', 'promises', 'unity', 'official',
  'signing', 'witnesses', 'married', 'joy', 'tender', 'intimacy',
  'embrace', 'love', 'first-kiss', 'emotion', 'connection', 'wordless',
  'genuine', 'natural', 'spontaneous', 'authentic', 'relaxed', 'candid',
  'life', 'unplanned', 'real', 'parents', 'relatives', 'support',
  'friends', 'party', 'toasts', 'wishes', 'speeches', 'first-dance',
  'special', 'fun', 'dancing', 'energy', 'happiness', 'laughter',
  'dreams', 'hopes', 'plans', 'goals', 'journey', 'together', 'adventure'
]

export function MediaManager({ isOpen, onClose }: MediaManagerProps) {
  const [mediaItems, setMediaItems] = useKV<MediaItem[]>('wedding-media', [])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [filterSection, setFilterSection] = useState<string>('all')
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSection, setEditSection] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const filteredItems = filterSection === 'all' 
    ? mediaItems || []
    : (mediaItems || []).filter(item => item.section === filterSection)

  const handleSelectItem = (item: MediaItem) => {
    setSelectedItem(item)
    setEditTitle(item.title || '')
    setEditDescription(item.description || '')
    setEditSection(item.section)
    setEditTags(item.tags || [])
  }

  const handleSaveChanges = () => {
    if (!selectedItem) return

    setMediaItems(prev => 
      (prev || []).map(item => 
        item.id === selectedItem.id
          ? {
              ...item,
              title: editTitle,
              description: editDescription,
              section: editSection,
              tags: editTags
            }
          : item
      )
    )

    toast.success('Зміни збережено')
    setSelectedItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    setMediaItems(prev => (prev || []).filter(item => item.id !== itemId))
    toast.success('Медіафайл видалено')
    if (selectedItem?.id === itemId) {
      setSelectedItem(null)
    }
  }

  const handleAddTag = () => {
    if (newTag && !editTags.includes(newTag)) {
      setEditTags([...editTags, newTag])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter(t => t !== tag))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="font-display text-2xl">
            Управління медіафайлами
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-[calc(90vh-100px)]">
          <div className="w-full md:w-1/2 border-r">
            <div className="p-4 border-b">
              <Label className="font-ui text-xs uppercase mb-2 block">
                Фільтр за розділом
              </Label>
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі медіафайли</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="p-4 grid grid-cols-2 gap-3">
                {filteredItems.map(item => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      selectedItem?.id === item.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:ring-1 hover:ring-border'
                    }`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="relative aspect-video bg-muted">
                      {item.type === 'video' ? (
                        <>
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <VideoIcon size={32} weight="duotone" className="text-primary" />
                            </div>
                          )}
                        </>
                      ) : item.type === 'audio' ? (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <MusicNote size={32} weight="duotone" className="text-primary" />
                        </div>
                      ) : (
                        <img
                          src={item.dataUrl || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Badge className="absolute top-2 left-2 text-xs">
                        {item.type === 'video' ? '🎥' : item.type === 'audio' ? '🎵' : '📷'}
                      </Badge>
                    </div>
                    <div className="p-2">
                      <p className="font-body text-xs font-semibold truncate">
                        {item.title || 'Без назви'}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="w-full md:w-1/2">
            {selectedItem ? (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {selectedItem.type === 'video' ? (
                      <video
                        src={selectedItem.dataUrl || selectedItem.url}
                        poster={selectedItem.thumbnail}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : selectedItem.type === 'audio' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-primary/5">
                        <MusicNote size={48} weight="duotone" className="text-primary" />
                        <audio
                          src={selectedItem.dataUrl || selectedItem.url}
                          controls
                          className="w-full px-4"
                        />
                      </div>
                    ) : (
                      <img
                        src={selectedItem.dataUrl || selectedItem.url}
                        alt={selectedItem.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="font-ui text-xs uppercase mb-2 block">
                        Назва
                      </Label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Введіть назву"
                      />
                    </div>

                    <div>
                      <Label className="font-ui text-xs uppercase mb-2 block">
                        Опис
                      </Label>
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Додайте опис"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="font-ui text-xs uppercase mb-2 block">
                        Розділ
                      </Label>
                      <Select value={editSection} onValueChange={setEditSection}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map(section => (
                            <SelectItem key={section.value} value={section.value}>
                              {section.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="font-ui text-xs uppercase mb-2 block">
                        Теги
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <X 
                              size={14} 
                              className="cursor-pointer" 
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Новий тег"
                        />
                        <Button onClick={handleAddTag} size="sm">
                          Додати
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {predefinedTags.filter(tag => !editTags.includes(tag)).map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => setEditTags([...editTags, tag])}
                          >
                            + {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                      <p>Тип: {selectedItem.type}</p>
                      {selectedItem.metadata?.size && (
                        <p>Розмір: {formatFileSize(selectedItem.metadata.size)}</p>
                      )}
                      {selectedItem.duration && (
                        <p>Тривалість: {formatDuration(selectedItem.duration)}</p>
                      )}
                      {selectedItem.metadata?.width && selectedItem.metadata?.height && (
                        <p>Розміри: {selectedItem.metadata.width}×{selectedItem.metadata.height}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveChanges} className="flex-1">
                        <Check size={18} className="mr-2" />
                        Зберегти
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteItem(selectedItem.id)}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ImageIcon size={48} weight="duotone" className="mx-auto mb-3 text-primary" />
                  <p className="font-body">
                    Оберіть медіафайл для редагування
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
