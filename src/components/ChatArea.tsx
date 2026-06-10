import { useRef, useEffect } from 'react'
import { WelcomeScreen } from './WelcomeScreen'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { InputArea } from './InputArea'
import type { ChatMessage } from '../types'

interface ChatAreaProps {
  messages: ChatMessage[]
  isLoading: boolean
  onSend: (message: string) => void
}

export function ChatArea({ messages, isLoading, onSend }: ChatAreaProps) {
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const hasMessages = messages.length > 0

  return (
    <main className="flex-1 flex flex-col min-w-0">
      {hasMessages ? (
        <div ref={messagesRef} className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[860px] px-6 pt-6 pb-2">
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
