import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { ChatCircle, X, PaperclipHorizontal, PaperPlaneTilt, Robot } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

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
    const [input, setInput] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
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
            const promptText = `Ти - помічник для управління весільним альбомом. 
Користувач запитує: ${input}

Допоможи організувати фото, відео, події в календарі або знайти потрібний контент.
Відповідай українською мовою, коротко та по суті.`
            
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            console.log('Files selected:', files)
        }
    }

    return (
        <>
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
                            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
                                <Robot size={24} weight="duotone" />
                                <div>
                                    <h3 className="font-ui font-semibold text-sm">AI Помічник</h3>
                                    <p className="text-xs opacity-90">Адміністратор альбому</p>
                                </div>
                            </div>

                            <ScrollArea className="h-96 p-4">
                                <div className="space-y-4">
                                    {(!messages || messages.length === 0) && (
                                        <div className="text-center py-8 text-muted-foreground font-body text-sm">
                                            <Robot size={48} weight="duotone" className="mx-auto mb-3 text-primary" />
                                            <p>Вітаю! Я допоможу організувати ваш альбом.</p>
                                            <p className="mt-2 text-xs">Спитайте мене про фото, події або розділи.</p>
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

                            <div className="p-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleFileSelect}
                                        disabled={isProcessing}
                                    >
                                        <PaperclipHorizontal size={20} />
                                    </Button>
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Напишіть повідомлення..."
                                        disabled={isProcessing}
                                        className="flex-1 font-body"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isProcessing}
                                        size="icon"
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