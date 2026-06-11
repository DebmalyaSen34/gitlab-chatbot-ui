import { useState, useCallback, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { sendMessage } from './api'
import type { ChatMessage, ChatSession } from './types'

const SESSIONS_STORAGE_KEY = 'gitlab-handbook-chat-sessions'
const ACTIVE_SESSION_STORAGE_KEY = 'gitlab-handbook-active-session'

function loadSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY)
    if (!stored) return []

    const sessions = JSON.parse(stored) as Partial<ChatSession>[]
    const now = Date.now()

    return sessions
      .filter(session => session.id && session.title && Array.isArray(session.messages) && session.messages.length > 0)
      .map(session => ({
        id: session.id as string,
        title: session.title as string,
        messages: session.messages as ChatMessage[],
        createdAt: session.createdAt ?? now,
        updatedAt: session.updatedAt ?? session.createdAt ?? now,
      }))
  } catch {
    return []
  }
}

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const activeSession = sessions.find(s => s.id === activeSessionId)
  const messages = activeSession?.messages ?? []

  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (activeSessionId && sessions.some(session => session.id === activeSessionId)) {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, activeSessionId)
    } else {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY)
    }
  }, [activeSessionId, sessions])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileSidebarOpen])

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null)
    setMobileSidebarOpen(false)
  }, [])

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id)
    setMobileSidebarOpen(false)
  }, [])

  const handleClearHistory = useCallback(() => {
    setSessions([])
    setActiveSessionId(null)
  }, [])

  const handleSend = useCallback(async (query: string) => {
    let sessionId = activeSessionId
    if (!sessionId) {
      const now = Date.now()
      sessionId = now.toString()
      const newSession: ChatSession = {
        id: sessionId,
        title: query.slice(0, 40) + (query.length > 40 ? '...' : ''),
        messages: [],
        createdAt: now,
        updatedAt: now,
      }
      setSessions(prev => [newSession, ...prev])
      setActiveSessionId(sessionId)
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    }

    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, userMsg],
              title: s.messages.length === 0
                ? query.slice(0, 40) + (query.length > 40 ? '...' : '')
                : s.title,
              updatedAt: Date.now(),
            }
          : s
      )
    )

    setIsLoading(true)

    try {
      const response = await sendMessage(query)
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, response], updatedAt: Date.now() }
            : s
        )
      )
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `<p>Sorry, something went wrong. ${err instanceof Error ? err.message : 'Please try again.'}</p>`,
      }
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, errorMsg], updatedAt: Date.now() }
            : s
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [activeSessionId])

  return (
    <div className="flex h-screen relative">
      {/* Desktop sidebar — always rendered, hidden below md when collapsed */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onClearHistory={handleClearHistory}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(collapsed => !collapsed)}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="relative w-[280px] max-w-[80vw] animate-slide-in-left">
            <Sidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onNewChat={handleNewChat}
              onSelectSession={handleSelectSession}
              onClearHistory={handleClearHistory}
              collapsed={false}
              onToggleCollapsed={() => setMobileSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
      />
    </div>
  )
}
