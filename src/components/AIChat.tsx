import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { MediaManager } from '@/components/MediaManager'
import { ChatCircle, X, PaperclipHorizontal, PaperPlaneTilt, Robot, FolderOpen } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { MediaItem } from '@/lib/mediaStorage'
import { 
  getVideoMetadata, 
  generateVideoThumbnail, 
  fileToDataURL,
  compressImage
} from '@/lib/mediaStorage'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

interface AIChatProps {
    isOpen: boolean
    onToggle: () => void
}

export function AIChat({ isOpen, onToggle }: AIChatProps) {
    const [messages, setMessages] = useKV<Message[]>('ai-chat-history', [])
    const [mediaItems, setMediaItems] = useKV<MediaItem[]>('wedding-media', [])
    const [input, setInput] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [isManagerOpen, setIsManagerOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        }

        setMessages(prev => [...(prev || []), userMessage])
        setInput('')
        setIsProcessing(true)

        try {
            const currentMedia = mediaItems || []
            const sectionNames = ['ayakscho', 'razom', 'lyubyty', 'zhyttya', 'pospravzhnomu', 'radity', 'mriyaty']
            const mediaSummary = sectionNames.map(s => {
              const count = currentMedia.filter(m => m.section === s).length
              return `${s}: ${count} файлів`
            }).join(', ')

            const promptText = `Ти — AI-адміністратор весільного альбому "Дмитро та Александра".
Поточний стан альбому: ${mediaSummary}
Усього медіафайлів: ${currentMedia.length}

Ти вмієш:
- Допомогти розподілити фото/відео по розділах: А якщо, Разом, Любити, Життя, По справжньому, Радіти, Мріяти
- Знаходити медіа за тегами (наприклад: "знайди фото з першого танцю")
- Давати поради щодо організації альбому
- Пояснювати маркери якості фото (ok, warn_blur, warn_dark)

Запит користувача: ${input}

Відповідай українською, стисло та по суті. Якщо питання про конкретний розділ — назви його українською.`
            
            const response = await window.spark.llm(promptText, 'gpt-4o-mini')

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            }

            setMessages(prev => [...(prev || []), assistantMessage])
        } catch (error) {
            console.error('AI Chat error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Вибачте, виникла помилка. Спробуйте ще раз.',
                timestamp: Date.now()
            }
            setMessages(prev => [...(prev || []), errorMessage])
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        setUploadProgress(0)
        
        const uploadedFiles: MediaItem[] = []
        const totalFiles = files.length

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                setUploadProgress(((i + 1) / totalFiles) * 100)

                const isVideo = file.type.startsWith('video/')
                const isImage = file.type.startsWith('image/')
                const isAudio = file.type.startsWith('audio/')

                if (!isVideo && !isImage && !isAudio) {
                    toast.error(`Файл ${file.name} пропущено - непідтримуваний формат`)
                    continue
                }

                if (file.size > 100 * 1024 * 1024) {
                    toast.error(`Файл ${file.name} занадто великий (максимум 100MB)`)
                    continue
                }

                let mediaItem: MediaItem = {
                    id: `media-${Date.now()}-${i}`,
                    type: isVideo ? 'video' : isAudio ? 'audio' : 'image',
                    section: 'unassigned',
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    uploadedAt: Date.now(),
                    metadata: {
                        size: file.size,
                        format: file.type
                    }
                }

                if (isVideo) {
                    try {
                        const metadata = await getVideoMetadata(file)
                        const thumbnail = await generateVideoThumbnail(file)
                        const dataUrl = await fileToDataURL(file)
                        
                        mediaItem = {
                            ...mediaItem,
                            dataUrl,
                            thumbnail,
                            duration: metadata.duration,
                            metadata: {
                                ...mediaItem.metadata,
                                width: metadata.width,
                                height: metadata.height
                            }
                        }
                    } catch (error) {
                        console.error('Video processing error:', error)
                        toast.error(`Помилка обробки відео ${file.name}`)
                        continue
                    }
                } else if (isImage) {
                    try {
                        const compressed = await compressImage(file)
                        mediaItem.dataUrl = compressed
                    } catch (error) {
                        console.error('Image processing error:', error)
                        const dataUrl = await fileToDataURL(file)
                        mediaItem.dataUrl = dataUrl
                    }
                } else if (isAudio) {
                    try {
                        const dataUrl = await fileToDataURL(file)
                        mediaItem.dataUrl = dataUrl
                    } catch (error) {
                        console.error('Audio processing error:', error)
                        toast.error(`Помилка обробки аудіо ${file.name}`)
                        continue
                    }
                }

                uploadedFiles.push(mediaItem)
            }

            if (uploadedFiles.length > 0) {
                setMediaItems(prev => [...(prev || []), ...uploadedFiles])
                
                const filesList = uploadedFiles.map(f => `• ${f.title} (${f.type})`).join('\n')
                const userMessage: Message = {
                    id: Date.now().toString(),
                    role: 'user',
                    content: `Завантажено ${uploadedFiles.length} файлів:\n${filesList}`,
                    timestamp: Date.now()
                }
                setMessages(prev => [...(prev || []), userMessage])

                const promptText = `Користувач щойно завантажив ${uploadedFiles.length} медіафайлів до весільного альбому.
Файли: ${uploadedFiles.map(f => `${f.title} (${f.type})`).join(', ')}

Підкажи користувачу, що він може зробити далі:
- розподілити файли по розділах альбому
- додати описи та теги
- переглянути завантажені медіа

Відповідай українською, дружньо і коротко.`

                setIsProcessing(true)
                try {
                    const response = await window.spark.llm(promptText, 'gpt-4o-mini')
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: response,
                        timestamp: Date.now()
                    }
                    setMessages(prev => [...(prev || []), assistantMessage])
                } catch (error) {
                    console.error('AI response error:', error)
                } finally {
                    setIsProcessing(false)
                }

                toast.success(`Успішно завантажено ${uploadedFiles.length} файлів`)
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Помилка завантаження файлів')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <>
            <MediaManager isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
            
            <motion.button
                onClick={onToggle}
                className="fixed bottom-6 right-6 z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    {isOpen ? (
                        <X size={24} weight="bold" />
                    ) : (
                        <ChatCircle size={24} weight="fill" />
                    )}
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
                    >
                        <Card className="volumetric-card overflow-hidden">
                            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Robot size={24} weight="duotone" />
                                    <div>
                                        <h3 className="font-ui font-semibold text-sm">AI Помічник</h3>
                                        <p className="text-xs opacity-90">Адміністратор альбому</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsManagerOpen(true)}
                                    className="h-8 w-8 hover:bg-primary-foreground/20"
                                    title="Управління медіафайлами"
                                >
                                    <FolderOpen size={18} />
                                </Button>
                            </div>

                            <ScrollArea className="h-96 p-4">
                                <div className="space-y-4">
                                    {(!messages || messages.length === 0) && (
                                        <div className="text-center py-8 text-muted-foreground font-body text-sm">
                                            <Robot size={48} weight="duotone" className="mx-auto mb-3 text-primary" />
                                            <p>Вітаю! Я допоможу організувати ваш альбом.</p>
                                            <p className="mt-2 text-xs">Спитайте мене про фото, події або розділи.</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsManagerOpen(true)}
                                                className="mt-4"
                                            >
                                                <FolderOpen size={16} className="mr-2" />
                                                Управління медіафайлами
                                            </Button>
                                        </div>
                                    )}
                                    {messages?.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 ${
                                                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                message.role === 'user' ? 'bg-accent' : 'bg-secondary'
                                            }`}>
                                                {message.role === 'user' ? (
                                                    <span className="text-xs font-ui font-bold">Ви</span>
                                                ) : (
                                                    <Robot size={16} weight="duotone" />
                                                )}
                                            </div>
                                            <div className={`flex-1 px-3 py-2 rounded-lg ${
                                                message.role === 'user' 
                                                    ? 'bg-accent text-accent-foreground' 
                                                    : 'bg-muted text-muted-foreground'
                                            }`}>
                                                <p className="font-body text-sm whitespace-pre-wrap">
                                                    {message.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {isProcessing && (
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                <Robot size={16} weight="duotone" />
                                            </div>
                                            <div className="flex-1 px-3 py-2 rounded-lg bg-muted">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t border-border space-y-3">
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-ui">
                                            <span className="text-muted-foreground">
                                                Завантаження файлів...
                                            </span>
                                            <span className="text-primary font-semibold">
                                                {Math.round(uploadProgress)}%
                                            </span>
                                        </div>
                                        <Progress value={uploadProgress} className="h-1.5" />
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*,video/*,audio/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleFileSelect}
                                        disabled={isProcessing || isUploading}
                                        className="flex-shrink-0"
                                    >
                                        <PaperclipHorizontal size={20} />
                                    </Button>
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                        placeholder="Напишіть повідомлення..."
                                        disabled={isProcessing || isUploading}
                                        className="flex-1 font-body"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isProcessing || isUploading}
                                        size="icon"
                                        className="flex-shrink-0"
                                    >
                                        <PaperPlaneTilt size={20} weight="fill" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}