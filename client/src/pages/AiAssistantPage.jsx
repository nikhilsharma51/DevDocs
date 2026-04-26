
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAiQuery } from '../hooks/useAi'
import { useAuth } from '../hooks/useAuth'

const SUGGESTIONS = [
  'How do I run the backend locally?',
  'Where is authentication implemented?',
  'How do I deploy to production?',
  'What APIs does this project have?',
  'How does the database schema look?',
]

const WELCOME_MESSAGE = {
  id:   'welcome',
  from: 'ai',
  text: "Hi! Ask me anything about your team's documentation. I'll search through your docs and give you a precise answer with sources.",
  sources: [],
}

export default function AiAssistantPage() {
  const navigate              = useNavigate()
  const { askQuestion, loading } = useAiQuery()
  const { profile }           = useAuth()
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput]     = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)
  const hasAsked   = messages.length > 1

  // auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // get initials from profile name
  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  async function handleSend(questionText) {
    const question = (questionText || input).trim()
    if (!question || loading) return

    setInput('')
    setShowSuggestions(false)

    // add user message
    const userMsg = { id: Date.now(), from: 'user', text: question }
    setMessages(prev => [...prev, userMsg])

    // call AI
    const result = await askQuestion(question)

    // add AI response
    const aiMsg = {
      id:      Date.now() + 1,
      from:    'ai',
      text:    result?.answer || 'Sorry, something went wrong. Please try again.',
      sources: result?.sources || [],
    }
    setMessages(prev => [...prev, aiMsg])
  }

  function handleKeyDown(e) {
    // send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleClear() {
    setMessages([WELCOME_MESSAGE])
    setShowSuggestions(true)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full -m-6">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h1 className="text-[15px] font-medium text-gray-900">AI assistant</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Answers from your documentation
          </p>
        </div>
        {hasAsked && (
          <button
            onClick={handleClear}
            className="text-[11px] text-gray-400 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        {messages.map(msg => (
          <MessageRow
            key={msg.id}
            msg={msg}
            initials={initials}
            onSourceClick={id => navigate(`/docs/${id}`)}
          />
        ))}

        {/* Thinking indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 flex-shrink-0">
              AI
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="text-[11px] text-gray-400">Thinking</span>
              <ThinkingDots />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — shown before first question */}
      {showSuggestions && !loading && (
        <div className="px-6 pb-3 flex gap-2 flex-wrap flex-shrink-0">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="text-[11px] px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your docs..."
            disabled={loading}
            rows={1}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 resize-none transition-colors disabled:opacity-50 leading-relaxed"
            style={{ minHeight: '42px', maxHeight: '120px' }}
            onInput={e => {
              // auto-grow textarea
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-[42px] h-[42px] bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-300 mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}

// ── Sub-components ─────────────────────────────────────

function MessageRow({ msg, initials, onSourceClick }) {
  const isUser = msg.from === 'user'

  return (
    <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5 ${
        isUser
          ? 'bg-gray-200 text-gray-600'
          : 'bg-purple-100 text-purple-800'
      }`}>
        {isUser ? initials : 'AI'}
      </div>

      {/* Bubble + sources */}
      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
          isUser
            ? 'bg-gray-100 text-gray-700 rounded-tr-sm'
            : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm'
        }`}>
          {msg.text}
        </div>

        {/* Source chips */}
        {msg.sources?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {msg.sources.map(source => (
              <button
                key={source.id}
                onClick={() => onSourceClick(source.id)}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {source.title}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-purple-300"
          style={{
            animation: 'thinking 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes thinking {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}