// src/components/ai/AiChatPanel.jsx
import { useState } from 'react'
import { useAiQuery } from '../../hooks/useAi'

export default function AiChatPanel() {
  const { askQuestion, loading } = useAiQuery()
  const [messages, setMessages]  = useState([
    { id: 1, from: 'ai', text: 'Ask me anything about your documentation.' }
  ])
  const [input, setInput] = useState('')

  async function handleSend() {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')

    // add user message immediately
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: question }])


    const result = await askQuestion(question)
    const aiText = result
      ? result.answer
      : 'Sorry, something went wrong. Try again.'

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      from: 'ai',
      text: aiText,
      sources: result?.sources || []
    }])
  }

  return (
    <div className="w-[220px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-3 border-b border-gray-200">
        <p className="text-[13px] font-medium text-gray-900">AI assistant</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Ask anything about your docs</p>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id}>
            <div className={`text-[11px] leading-relaxed p-2 rounded-lg max-w-[95%] ${
              msg.from === 'user'
                ? 'bg-gray-100 text-gray-600 self-end ml-auto'
                : 'bg-purple-50 text-purple-900 self-start'
            }`}>
              {msg.text}
            </div>
            {msg.sources?.length > 0 && (
              <div className="mt-1 ml-1">
                {msg.sources.map(s => (
                  <span key={s.id} className="text-[10px] text-purple-400 block">
                    ↗ {s.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="bg-purple-50 text-purple-400 text-[11px] p-2 rounded-lg max-w-[95%] animate-pulse">
            Thinking...
          </div>
        )}
      </div>

      <div className="p-2 border-t border-gray-200 flex gap-1.5">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 h-7 text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2 text-gray-700 placeholder-gray-400 outline-none focus:border-purple-300 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-7 h-7 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 text-xs disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  )
}