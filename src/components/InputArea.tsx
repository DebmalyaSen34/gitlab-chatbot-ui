import { Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function InputArea({ onSend, disabled }: InputAreaProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [value])

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-6 pb-5 pt-3 bg-bg-primary flex justify-center">
      <div className="w-full max-w-[860px]">
        <div className="flex items-end bg-bg-tertiary border border-border-input transition-colors focus-within:border-text-tertiary gap-2 p-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the GitLab handbook..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-[18px] leading-relaxed px-3.5 py-3 resize-none max-h-[200px] min-h-[28px] placeholder:text-text-placeholder"
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`
              w-9 h-9 flex items-center justify-center flex-shrink-0 border-none cursor-pointer transition-all
              ${value.trim() && !disabled
                ? 'bg-text-primary text-bg-primary hover:bg-white'
                : 'bg-bg-tertiary text-text-tertiary cursor-default'
              }
            `}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 text-[14px] text-text-tertiary">
          <span>GitLab Handbook RAG · Responses are AI-generated</span>
        </div>
      </div>
    </div>
  )
}
