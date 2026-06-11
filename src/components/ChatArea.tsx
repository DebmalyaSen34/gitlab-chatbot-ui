import { useRef, useEffect } from 'react'
import { PanelLeft } from 'lucide-react'
import { WelcomeScreen } from './WelcomeScreen'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { InputArea } from './InputArea'
import type { ChatMessage } from '../types'

interface ChatAreaProps {
  messages: ChatMessage[]
  isLoading: boolean
  onSend: (message: string) => void
  onOpenSidebar: () => void
}

export function ChatArea({ messages, isLoading, onSend, onOpenSidebar }: ChatAreaProps) {
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const hasMessages = messages.length > 0

  return (
    <main className="flex-1 flex flex-col min-w-0">
      {/* Mobile top bar — only visible below md */}
      <div className="md:hidden flex items-center px-3 py-2.5 border-b border-border bg-bg-secondary">
        <button
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="w-9 h-9 flex items-center justify-center bg-transparent border-none text-text-secondary cursor-pointer transition-colors hover:text-text-primary"
        >
          <PanelLeft size={20} />
        </button>
        <span className="ml-2 text-[15px] font-medium text-text-primary tracking-tight">
          Ask Away!
        </span>
      </div>

      {hasMessages ? (
        <div ref={messagesRef} className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[860px] px-4 md:px-6 pt-4 md:pt-6 pb-2">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </div>
      ) : (
        <WelcomeScreen onSuggestionClick={onSend} />
      )}

      <InputArea onSend={onSend} disabled={isLoading} />
    </main>
  )
}
