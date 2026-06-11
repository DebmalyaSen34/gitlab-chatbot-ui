import { MessageSquarePlus, Circle, Trash2, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import type { ChatSession } from '../types'

interface SidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onClearHistory: () => void
  collapsed: boolean
  onToggleCollapsed: () => void
  isMobile?: boolean
}

export function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onClearHistory,
  collapsed,
  onToggleCollapsed,
  isMobile = false,
}: SidebarProps) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)
  const groups = [
    {
      label: 'Today',
      sessions: sortedSessions.filter(session => session.updatedAt >= startOfToday.getTime()),
    },
    {
      label: 'Yesterday',
      sessions: sortedSessions.filter(session =>
        session.updatedAt >= startOfYesterday.getTime() && session.updatedAt < startOfToday.getTime()
      ),
    },
    {
      label: 'Earlier',
      sessions: sortedSessions.filter(session => session.updatedAt < startOfYesterday.getTime()),
    },
  ].filter(group => group.sessions.length > 0)

  const handleClearHistory = () => {
    if (window.confirm('Clear all chat history? This cannot be undone.')) {
      onClearHistory()
    }
  }

  // Mobile always renders expanded (overlay controls collapse)
  if (!isMobile && collapsed) {
    return (
      <aside className="w-16 min-w-16 bg-bg-secondary border-r border-border flex flex-col items-center py-4 gap-3 transition-[width] duration-200">
        <button
          onClick={onToggleCollapsed}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="w-10 h-10 flex items-center justify-center bg-transparent border border-border text-text-secondary cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary hover:border-border-input"
        >
          <PanelLeftOpen size={18} />
        </button>
        <button
          onClick={onNewChat}
          title="New chat"
          aria-label="New chat"
          className="w-10 h-10 flex items-center justify-center bg-transparent border border-border text-text-secondary cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary hover:border-border-input"
        >
          <MessageSquarePlus size={18} />
        </button>
        <div className="mt-auto pb-2" title="All systems operational">
          <Circle size={8} className="fill-green text-green" />
        </div>
      </aside>
    )
  }

  return (
    <aside className={`
      w-[280px] min-w-[280px] bg-bg-secondary border-r border-border flex flex-col py-4 px-3 gap-2 transition-[width] duration-200
      ${isMobile ? 'h-full' : ''}
    `}>
      {/* Brand */}
      <div className="flex items-center justify-between gap-2.5 px-3 pb-4 border-b border-border mb-2">
        <div>
          <div className="text-[17px] font-semibold text-text-primary tracking-tight">Gitlab Chatbot</div>
          <div className="text-[14px] text-text-tertiary">Knowledge Base</div>
        </div>
        <button
          onClick={onToggleCollapsed}
          title={isMobile ? 'Close sidebar' : 'Collapse sidebar'}
          aria-label={isMobile ? 'Close sidebar' : 'Collapse sidebar'}
          className="w-9 h-9 min-w-9 flex items-center justify-center bg-transparent border-none text-text-tertiary cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary"
        >
          {isMobile ? <X size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2.5 px-3 py-3 bg-transparent border border-border text-text-secondary text-[16px] cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary hover:border-border-input w-full text-left"
      >
        <MessageSquarePlus size={14} />
        New chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {groups.map(group => (
          <div key={group.label}>
            <div className="text-[13px] font-medium text-text-tertiary uppercase tracking-wider px-3 pt-3 pb-1.5">
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  title={session.title}
                  className={`
                    px-3 py-3 text-[16px] cursor-pointer transition-all text-left whitespace-nowrap overflow-hidden text-ellipsis border-l-2
                    ${session.id === activeSessionId
                      ? 'bg-bg-tertiary text-text-primary border-l-accent'
                      : 'text-text-secondary border-l-transparent hover:bg-bg-hover hover:text-text-primary'
                    }
                  `}
                >
                  {session.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border flex flex-col gap-1 mt-auto">
        {sessions.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2.5 px-3 py-2.5 text-[16px] text-text-tertiary bg-transparent border-none cursor-pointer transition-all text-left hover:text-red hover:bg-bg-hover"
          >
            <Trash2 size={15} />
            Clear history
          </button>
        )}
        <div className="flex items-center gap-2.5 px-3 py-2 text-[14px] text-text-tertiary">
          <Circle size={6} className="fill-green text-green" />
          All systems operational
        </div>
      </div>
    </aside>
  )
}
