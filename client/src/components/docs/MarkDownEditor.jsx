import { useState } from 'react'
import MarkdownPreview from './MarkdownPreview'

export default function MarkdownEditor({ value, onChange }) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="flex flex-col h-full">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex gap-1">
          {/* Bold, italic, code helpers */}
          {[
            { label: 'B', wrap: '**' },
            { label: 'I', wrap: '_'  },
            { label: '`', wrap: '`'  },
          ].map(btn => (
            <button
              key={btn.label}
              type="button"
              onClick={() => onChange(value + btn.wrap + btn.wrap)}
              className="w-7 h-7 text-[12px] font-medium text-gray-500 hover:bg-gray-200 rounded transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(p => !p)}
          className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
            showPreview
              ? 'bg-purple-50 border-purple-300 text-purple-700'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>
      </div>

      {/* Editor / Preview pane */}
      <div className={`flex flex-1 ${showPreview ? 'gap-0' : ''}`}>

        {/* Write pane */}
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Start writing in markdown...\n\n## Heading\n\nParagraph text here.\n\n- List item\n- Another item\n\n\`\`\`\ncode block\n\`\`\``}
          className={`resize-none outline-none text-[13px] text-gray-700 leading-relaxed p-4 bg-white placeholder-gray-300 font-mono border-gray-200
            ${showPreview ? 'w-1/2 border-r' : 'w-full'}
          `}
          style={{ minHeight: '400px' }}
          spellCheck={false}
        />

        {/* Preview pane */}
        {showPreview && (
          <div className="w-1/2 p-4 overflow-y-auto bg-white border-l border-gray-100">
            {value
              ? <MarkdownPreview content={value} />
              : <p className="text-[12px] text-gray-300 italic">Preview will appear here...</p>
            }
          </div>
        )}
      </div>
    </div>
  )
}