export function TypingIndicator() {
  return (
    <div className="flex gap-5 py-5 border-b border-border animate-msg-in">
      <div className="w-7 h-7 min-w-7 flex items-center justify-center text-xs font-semibold bg-bg-tertiary text-text-secondary border border-border">
        AI
      </div>
      <div className="flex-1 pr-1">
        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Assistant
        </div>
        <div className="flex gap-1">
          <span className="w-[5px] h-[5px] bg-text-tertiary animate-dot-1" />
          <span className="w-[5px] h-[5px] bg-text-tertiary animate-dot-2" />
          <span className="w-[5px] h-[5px] bg-text-tertiary animate-dot-3" />
        </div>
      </div>
    </div>
  )
}
