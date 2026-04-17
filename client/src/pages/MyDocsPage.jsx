// src/pages/MyDocsPage.jsx
import { useState, useMemo } from 'react'
import { categories } from '../data/mockData'
import { useDocs } from '../hooks/useDocs'
import PageHeader from '../components/ui/PageHeader'
import SearchBar from '../components/ui/SearchBar'
import SortDropdown from '../components/ui/SortDropdown'
import DocList from '../components/docs/DocList'
import { DocListSkeleton } from '../components/ui/Skeleton'
import { useNavigate } from 'react-router-dom'

export default function MyDocsPage() {
  const { docs, loading } = useDocs()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag]     = useState('All')
  const [sortOrder, setSortOrder]     = useState('newest')

  const filteredDocs = useMemo(() => {
    let result = [...docs]

    if (searchQuery.trim()) {
      result = result.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (activeTag !== 'All') {
      result = result.filter(d => d.tags?.includes(activeTag))
    }

    if (sortOrder === 'oldest')  return result.reverse()
    if (sortOrder === 'alpha')   return result.sort((a, b) => a.title.localeCompare(b.title))
    return result
  }, [docs, searchQuery, activeTag, sortOrder])

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="My docs"
        subtitle={loading ? 'Loading...' : `${filteredDocs.length} document${filteredDocs.length !== 1 ? 's' : ''}`}
        actionLabel="+ New document"
        onAction={() => navigate('/docs/new')}
      />

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search your documents..." />
        </div>
        <SortDropdown value={sortOrder} onChange={setSortOrder} />
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTag(cat)}
            className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
              activeTag === cat
                ? 'bg-purple-50 border-purple-300 text-purple-800 font-medium'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading
        ? <DocListSkeleton count={4} />
        : <DocList docs={filteredDocs} emptyMessage="No documents match your search" />
      }
    </div>
  )
}