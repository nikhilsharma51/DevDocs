// src/pages/DocEditorPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { myDocs } from '../data/mockData'
import MarkdownEditor from '../components/docs/MarkDownEditor'
import TagInput from '../components/ui/TagInput'
import Modal from '../components/ui/Modal'

export default function DocEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  // find existing doc if editing
  const existingDoc = isEditing
    ? myDocs.find(d => d.id === Number(id))
    : null

  // form setup with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      title: existingDoc?.title || '',
    }
  })

  // markdown and tags live outside react-hook-form
  // because they're complex inputs that need custom handling
  const [content, setContent]   = useState(existingDoc?.content || '')
  const [tags, setTags]         = useState(existingDoc?.tags || [])
  const [showModal, setShowModal] = useState(false)

  // track if markdown content has changed
  const originalContent = existingDoc?.content || ''
  const contentChanged  = content !== originalContent
  const hasUnsavedChanges = isDirty || contentChanged || tags.join() !== (existingDoc?.tags || []).join()

  // if editing a non-existent doc, redirect
  useEffect(() => {
    if (isEditing && !existingDoc) {
      navigate('/docs/my')
    }
  }, [isEditing, existingDoc, navigate])

  function onSubmit(data) {
    // with real backend this would be an API call
    // for now just log and navigate back
    const savedDoc = {
      id: existingDoc?.id || Date.now(),
      title: data.title,
      content,
      tags,
      author: 'Rohan S.',
      updatedAt: 'Just now',
      isRecent: true,
    }
    console.log('Saving doc:', savedDoc)
    navigate(isEditing ? `/docs/${id}` : '/docs/my')
  }

  function handleBack() {
    if (hasUnsavedChanges) {
      setShowModal(true)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {isEditing ? 'Back to doc' : 'Back to my docs'}
        </button>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-[11px] text-gray-400 italic">Unsaved changes</span>
          )}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isEditing ? 'Save changes' : 'Create document'}
          </button>
        </div>
      </div>

      {/* Title input */}
      <div className="mb-4">
        <input
          {...register('title', {
            required: 'Title is required',
            minLength: { value: 3, message: 'Title must be at least 3 characters' }
          })}
          placeholder="Document title..."
          className="w-full text-[22px] font-medium text-gray-900 placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-2 transition-colors bg-transparent"
        />
        {errors.title && (
          <p className="text-[11px] text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Tags input */}
      <div className="mb-5">
        <label className="block text-[11px] text-gray-400 mb-1.5">Tags</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Markdown editor */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      {/* Discard changes modal */}
      <Modal
        isOpen={showModal}
        title="Discard changes?"
        message="You have unsaved changes. If you leave now they will be lost."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        danger
        onConfirm={() => navigate(-1)}
        onCancel={() => setShowModal(false)}
      />
    </div>
  )
}