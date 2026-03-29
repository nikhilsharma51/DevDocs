// src/components/docs/DocCard.jsx
import { useNavigate } from 'react-router-dom'
import TagBadge from '../ui/TagBadge'

export default function DocCard({ doc }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/docs/${doc.id}`)}
      className={`
        bg-white border border-gray-200 rounded-xl p-4 cursor-pointer
        hover:border-gray-400 hover:shadow-sm transition-all
        ${doc.isRecent ? 'border-l-2 border-l-purple-400 rounded-l-none' : ''}
      `}
    >
      <p className="text-[13px] font-medium text-gray-900 mb-1">
        {doc.title}
      </p>
      <p className="text-[11px] text-gray-400">
        Updated {doc.updatedAt} · {doc.author}
      </p>
      <div className="flex gap-1 mt-2 flex-wrap">
        {doc.tags.map(tag => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  )
}