import { MessageSquare } from 'lucide-react'

interface WelcomeScreenProps {
  onSuggestionClick: (query: string) => void
}

const suggestions = [
  { title: 'PTO Policy', desc: "What's the time off policy?" },
  { title: 'Code Reviews', desc: 'How should I conduct code reviews?' },
  { title: 'Career Growth', desc: 'What are the engineering levels?' },
  { title: 'Remote Work', desc: "What's the remote work policy?" },
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-10">
      <div className="w-12 h-12 flex items-center justify-center bg-bg-tertiary border border-border mb-5">
        <MessageSquare size={22} className="text-accent" />
      </div>
      <div className="text-xl md:text-2xl font-medium text-text-primary tracking-tight mb-1.5 text-center">
        Ask Anything GitLab!
      </div>
      <div className="text-sm md:text-base text-text-tertiary mb-8 md:mb-10 text-center max-w-[400px]">
        Ask anything about GitLab's policies, engineering practices, culture and future directions.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-[560px] w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.desc)}
            className="p-3 md:p-4 bg-bg-secondary border border-border text-text-secondary text-sm text-left cursor-pointer transition-all leading-snug hover:bg-bg-tertiary hover:border-border-input hover:text-text-primary"
          >
            <div className="font-medium text-[15px] md:text-base mb-1 text-text-primary">{s.title}</div>
            <div className="text-[13px] md:text-sm text-text-tertiary">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
