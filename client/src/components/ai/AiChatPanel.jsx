import { useState } from 'react'
import { aiMessages } from '../../data/mockData'

export default function AiChatPanel() {
  const [messages, setMessages] = useState(aiMessages)
  const [input, setInput] = useState("")

  function handleSend() {
    if (!input.trim()) return

    const userMsg = { id: Date.now(), from: "user", text: input }
    const aiReply = { id: Date.now() + 1, from: "ai", text: "This is a mock AI response. Real AI comes in Phase 3!" }

    setMessages(prev => [...prev, userMsg, aiReply])
    setInput("")
  }

  return (
    <div className="w-[220px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0">

      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-[13px] font-medium text-gray-900">AI assistant</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Ask anything about your docs</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`text-[11px] leading-relaxed p-2 rounded-lg max-w-[95%] ${
              msg.from === 'user'
                ? 'bg-gray-100 text-gray-600 self-end'
                : 'bg-purple-50 text-purple-900 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-gray-200 flex gap-1.5">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 h-7 text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2 outline-none focus:border-purple-300"
        />
        <button
          onClick={handleSend}
          className="w-7 h-7 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 text-xs"
        >
          →
        </button>
      </div>

    </div>
  )
}