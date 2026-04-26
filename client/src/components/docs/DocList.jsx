
import DocCard from './DocCard'

export default function DocList({ docs, emptyMessage }) {
  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-[13px] text-gray-400">{emptyMessage || "No documents found"}</p>
        <p className="text-[11px] text-gray-600 mt-1">Try a different search or filter</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {docs.map(doc => (
        <DocCard key={doc.id} doc={doc} />
      ))}
    </div>
  )
}