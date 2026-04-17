// src/pages/TeamDocsPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { categories } from '../data/mockData'
import PageHeader from '../components/ui/PageHeader'
import SearchBar from '../components/ui/SearchBar'
import DocList from '../components/docs/DocList'
import { DocListSkeleton } from '../components/ui/Skeleton'

export default function TeamDocsPage() {
  const { profile }   = useAuth()
  const navigate      = useNavigate()
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag]     = useState('All')

  useEffect(() => {
    if (!profile?.team_id) { setLoading(false); return }
    async function load() {
      const { data } = await supabase
        .from('documents')
        .select('*, profiles(name)')
        .eq('team_id', profile.team_id)
        .order('updated_at', { ascending: false })
      setDocs(data || [])
      setLoading(false)
    }
    load()
  }, [profile])

  const filteredDocs = useMemo(() => {
    let result = [...docs]
    if (searchQuery.trim()) {
      result = result.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (activeTag !== 'All') {
      result = result.filter(d => d.tags?.includes(activeTag))
    }
    return result
  }, [docs, searchQuery, activeTag])

  if (!profile?.team_id) {
    return (
      <div className="max-w-3xl">
        <PageHeader title="Team docs" subtitle="Shared team documentation" />
        <div className="text-center py-16">
          <p className="text-[13px] text-gray-400 mb-1">You're not part of a team yet</p>
          <p className="text-[11px] text-gray-300">Ask your admin to add you to a team</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Team docs"
        subtitle={loading ? 'Loading...' : `${filteredDocs.length} document${filteredDocs.length !== 1 ? 's' : ''}`}
        actionLabel="+ New document"
        onAction={() => navigate('/docs/new')}
      />

      <div className="mb-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search team documents..." />
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTag(cat)}
            className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
              activeTag === cat
                ? 'bg-purple-50 border-purple-300 text-purple-800 font-medium'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading
        ? <DocListSkeleton count={4} />
        : <DocList docs={filteredDocs} emptyMessage="No team documents yet" />
      }
    </div>
  )
}