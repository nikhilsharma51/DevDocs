// src/pages/SearchPage.jsx
import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { allDocs } from '../data/mockData'
import TagBadge from '../components/ui/TagBadge'

// highlights matching text by wrapping it in a <mark> span
function highlight(text, query) {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.trim()})`, 'gi')
  return text.split(regex).map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">{part}</mark>
      : part
  )
}

export default function SearchPage() {
  const navigate  = useNavigate()
  const inputRef  = useRef(null)
  const [query, setQuery] = useState("")

  // auto-focus the input when the page loads
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allDocs.filter(doc =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [query])

  // get a short snippet of content around the matching word
  function getSnippet(content, query) {
    if (!query.trim()) return ''
    const idx = content.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return content.slice(0, 120) + '...'
    const start = Math.max(0, idx - 60)
    const end   = Math.min(content.length, idx + 100)
    return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
  }

  return (
    <div className="max-w-2xl">

      {/* Search input */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search all documents..."
          className="w-full h-11 bg-white border border-gray-200 rounded-xl pl-11 pr-4 text-[14px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Results count */}
      {query && (
        <p className="text-[12px] text-gray-400 mb-4">
          {results.length === 0
            ? `No results for "${query}"`
            : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
          }
        </p>
      )}

      {/* Empty state — no query yet */}
      {!query && (
        <div className="text-center py-16">
          <p className="text-[13px] text-gray-400">Start typing to search across all documents</p>
          <p className="text-[11px] text-gray-300 mt-1">Searches titles, content and tags</p>
        </div>
      )}

      {/* Results list */}
      <div className="flex flex-col gap-3">
        {results.map(doc => (
          <div
            key={doc.id}
            onClick={() => navigate(`/docs/${doc.id}`)}
            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <p className="text-[14px] font-medium text-gray-900">
                {highlight(doc.title, query)}
              </p>
              <span className="text-[11px] text-gray-400 flex-shrink-0">{doc.updatedAt}</span>
            </div>

            <p className="text-[12px] text-gray-500 leading-relaxed mb-2">
              {highlight(getSnippet(doc.content, query), query)}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">{doc.author}</span>
              <span className="text-gray-300">·</span>
              <div className="flex gap-1">
                {doc.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}