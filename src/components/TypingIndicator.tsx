import { useState, useEffect, useRef } from 'react'

const LOADING_MESSAGES = [
  "server just started so pls wait",
  "running pip install",
  "I told them to use uv!",
  "warming up the neurons",
  "consulting the rubber duck",
  "thinking really hard rn",
  "ctrl+Z ctrl+Z ctrl+Z",
  "it works on my machine",
  "downloading more RAM",
  "the hamsters are running",
  "blame the network",
  "compiling thoughts...",
  "have you tried turning it off and on again",
  "pushing to prod on a friday",
  "sudo make me a sandwich",
  "git push --force (just kidding)",
  "refactoring my inner monologue",
  "allocating unnecessary memory",
  "loading npm dependencies (see you in 10 min)",
  "caffeine levels: critically low",
]

export function TypingIndicator() {
  const [messageIndex, setMessageIndex] = useState(() =>
    Math.floor(Math.random() * LOADING_MESSAGES.length)
  )
  const [opacity, setOpacity] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length)
        setOpacity(1)
      }, 250)
    }, 3000)

    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="flex gap-3 md:gap-5 py-4 md:py-5 border-b border-border animate-msg-in">
      <div className="w-6 h-6 md:w-7 md:h-7 min-w-6 md:min-w-7 flex items-center justify-center text-[10px] md:text-xs font-semibold bg-bg-tertiary text-text-secondary border border-border">
        AI
      </div>
      <div className="flex-1 pr-1">
        <div className="text-[11px] md:text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 md:mb-2">
          Assistant
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex gap-1">
            <span className="w-[5px] h-[5px] bg-text-tertiary animate-dot-1" />
            <span className="w-[5px] h-[5px] bg-text-tertiary animate-dot-2" />
            <span className="w-[5px] h-[5px] bg-text-tertiary animate-dot-3" />
          </div>
          <span
            className="text-[11px] md:text-[13px] text-text-tertiary font-mono tracking-tight select-none transition-opacity duration-250 ease-in-out italic"
            style={{ opacity }}
          >
            {LOADING_MESSAGES[messageIndex]}
          </span>
        </div>
      </div>
    </div>
  )
}
