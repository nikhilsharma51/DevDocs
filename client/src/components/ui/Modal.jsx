import { useEffect } from 'react'

export default function Modal({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.25)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-[15px] font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-[12px] font-medium rounded-lg transition-colors ${
              danger
                ? 'bg-red-500 text-white hover:bg-red-600 border border-red-500'
                : 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-900'
            }`}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}