// src/components/docs/DocCard.jsx
import { useNavigate } from 'react-router-dom'
import TagBadge from '../ui/TagBadge'
import { useAuth } from '../../hooks/useAuth'

function firstNonEmpty(...values) {
  return values.find(value => {
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined
  })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now  = new Date()
  const diff = now - date
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)

  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return date.toLocaleDateString()
}

export default function DocCard({ doc, isRecent }) {
  const navigate   = useNavigate()
  const { user } = useAuth()

  const createdById = firstNonEmpty(
    doc.created_by_id,
    doc.created_by,
    doc.author_id,
    doc.owner_id
  )

  const updatedById = firstNonEmpty(
    doc.updated_by_id,
    doc.updated_by,
    doc.last_edited_by,
    doc.last_editor_id,
    createdById
  )

  const createdByName = firstNonEmpty(
    doc.created_by_name,
    doc.creator_name,
    doc.author_name,
    doc.profiles?.name,
    createdById === user?.id ? 'You' : null,
    'Unknown member'
  )

  const updatedByName = firstNonEmpty(
    doc.updated_by_name,
    doc.edited_by_name,
    doc.last_editor_name,
    updatedById === user?.id ? 'You' : null,
    createdByName
  )

  return (
    <div
      onClick={() => navigate(`/docs/${doc.id}`)}
      className={`
        bg-white border border-gray-200 rounded-xl p-4 cursor-pointer
        hover:border-gray-400 hover:shadow-sm transition-all
        ${isRecent ? 'border-l-2 border-l-purple-400 rounded-l-none' : ''}
      `}
    >
      <p className="text-[13px] font-medium text-gray-900 mb-1 line-clamp-2">
        {doc.title}
      </p>
      <p className="text-[11px] text-gray-400">
        {formatDate(doc.updated_at)}
      </p>
      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
        Updated by {updatedByName} · Created by {createdByName}
      </p>
      <div className="flex gap-1 mt-2 flex-wrap">
        {(doc.tags || []).map(tag => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  )
}