// src/components/ui/TagInput.jsx
import { useState } from 'react'

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("")

  function handleKeyDown(e) {
    // add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      const newTag = input.trim().replace(/,/g, '')
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag])
      }
      setInput("")
    }
    // remove last tag on Backspace when input is empty
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  function removeTag(tagToRemove) {
    onChange(tags.filter(t => t !== tagToRemove))
  }

  return (
    <div className="min-h-[38px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 flex flex-wrap gap-1.5 items-center focus-within:border-purple-300 transition-colors">
      {tags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 text-[11px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-purple-400 hover:text-purple-700 leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Type a tag, press Enter..." : ""}
        className="flex-1 min-w-[120px] bg-transparent text-[12px] text-gray-700 placeholder-gray-400 outline-none"
      />
    </div>
  )
}