import { useState } from 'react'
import { stats, categories, recentDocs } from '../data/mockData'
import DocCard from '../components/docs/DocCard'

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredDocs = activeCategory === "All"
    ? recentDocs
    : recentDocs.filter(doc => doc.tags.includes(activeCategory))

  return (
    <div className="max-w-3xl">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-gray-100 rounded-lg p-3">
            <p className="text-[11px] text-gray-400 mb-1">{stat.label}</p>
            <p className="text-[20px] font-medium text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <p className="text-[13px] font-medium text-gray-900 mb-2">Browse by category</p>
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
              activeCategory === cat
                ? 'bg-purple-50 border-purple-300 text-purple-800'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Doc grid */}
      <p className="text-[13px] font-medium text-gray-900 mb-2">Recent documents</p>
      <div className="grid grid-cols-2 gap-3">
        {filteredDocs.map(doc => (
          <DocCard key={doc.id} doc={doc} />
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <p className="text-[13px] text-gray-400 mt-4">No docs in this category yet.</p>
      )}

    </div>
  )
}