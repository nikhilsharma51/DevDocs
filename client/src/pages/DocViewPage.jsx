// src/pages/DocViewPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDocs } from '../hooks/useDocs'
import { useAuth } from '../hooks/useAuth'
import MarkdownPreview from '../components/docs/MarkdownPreview'
import TagBadge from '../components/ui/TagBadge'
import Modal from '../components/ui/Modal'
import { DocViewSkeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function DocViewPage() {
  const { id }               = useParams()
  const navigate             = useNavigate()
  const { getDocById, deleteDoc } = useDocs()
  const { user }             = useAuth()
  const [doc, setDoc]        = useState(null)
  const [loading, setLoading]= useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await getDocById(id)
      if (error || !data) {
        navigate('/docs/my')
        return
      }
      setDoc(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleDelete() {
    const { error } = await deleteDoc(id)
    if (error) {
      toast.error('Could not delete document')
      return
    }
    toast.success('Document deleted')
    navigate('/docs/my')
  }

  if (loading) return <DocViewSkeleton />

  const isOwner = doc?.author_id === user?.id

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="pb-5 mb-5 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-[22px] font-medium text-gray-900 leading-snug">{doc.title}</h1>
          {isOwner && (
            <div className="flex gap-2 flex-shrink-0 mt-1">
              <button
                onClick={() => navigate(`/docs/${doc.id}/edit`)}
                className="px-3 py-1.5 text-[11px] font-medium bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="px-3 py-1.5 text-[11px] font-medium bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[11px] text-gray-400">{doc.profiles?.name || 'Unknown'}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">Updated {formatDate(doc.updated_at)}</span>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {(doc.tags || []).map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      </div>

      <MarkdownPreview content={doc.content || ''} />

      <Modal
        isOpen={showDelete}
        title="Delete document?"
        message={`"${doc.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}