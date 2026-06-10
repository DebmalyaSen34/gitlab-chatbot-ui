export interface SourceChunk {
  title: string
  url: string
  content: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  cache?: 'HIT' | 'MISS'
  latency?: number
  ttft?: number
  sources?: SourceChunk[]
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}
