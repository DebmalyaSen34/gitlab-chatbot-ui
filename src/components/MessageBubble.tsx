import { Copy, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { marked } from 'marked'
import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className="flex gap-5 py-5 animate-msg-in border-b border-border first:border-t">
      {/* Avatar */}
      <div
        className={`
          w-7 h-7 min-w-7 flex items-center justify-center text-xs font-semibold mt-0.5
          ${isUser
            ? 'bg-accent-dim text-accent border border-accent/20'
            : 'bg-bg-tertiary text-text-secondary border border-border'
          }
        `}
      >
        {isUser ? 'Y' : 'AI'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          {isUser ? 'You' : 'Assistant'}
        </div>

        <div className={`markdown-content ${isUser ? 'markdown-content-user' : 'markdown-content-assistant'}`}>
          <div dangerouslySetInnerHTML={{ __html: marked.parse(message.content) as string }} />
        </div>

        {/* Metadata */}
        {!isUser && (message.cache || message.latency != null) && (
          <div className="flex gap-4 mt-3 font-[var(--font-mono)] text-[11px]">
            {message.cache && (
              <span className={message.cache === 'HIT' ? 'text-green' : 'text-text-tertiary'}>
                {message.cache === 'HIT' ? '●' : '○'} {message.cache}
              </span>
            )}
            {message.latency != null && (
              <span className="text-text-tertiary">{message.latency.toFixed(2)}s</span>
            )}
            {message.ttft != null && (
              <span className="text-text-tertiary">TTFT: {message.ttft.toFixed(2)}s</span>
            )}
          </div>
        )}

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className={`
                inline-flex items-center gap-1.5 text-[12px] text-text-tertiary bg-transparent border border-border px-3 py-1.5 font-[var(--font-body)] cursor-pointer transition-all hover:text-text-secondary hover:border-border-input
              `}
            >
              <ChevronRight
                size={12}
                className={`transition-transform ${sourcesOpen ? 'rotate-90' : ''}`}
              />
              Sources
            </button>

            {sourcesOpen && (
              <div className="mt-2.5 border border-border">
                {message.sources.map((src, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2.5 text-[12px] text-text-secondary border-b border-border last:border-b-0 flex justify-between items-center"
                  >
                    <span>
                      {i + 1}.{' '}
                      <a href={src.url} target="_blank" rel="noopener" className="text-accent no-underline hover:underline">
                        {src.title}
                      </a>
                    </span>
                    <span className="font-[var(--font-mono)] text-[11px] text-text-tertiary">
                      {src.url.split('/').pop()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!isUser && (
          <div className="flex gap-0.5 mt-3 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
            <button className="w-7 h-7 flex items-center justify-center bg-transparent border-none text-text-tertiary cursor-pointer transition-all hover:text-text-secondary hover:bg-bg-hover">
              <Copy size={14} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-transparent border-none text-text-tertiary cursor-pointer transition-all hover:text-text-secondary hover:bg-bg-hover">
              <ThumbsUp size={14} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-transparent border-none text-text-tertiary cursor-pointer transition-all hover:text-text-secondary hover:bg-bg-hover">
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
