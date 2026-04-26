// src/pages/TeamDocsPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTeam } from '../hooks/useTeam'
import { categories } from '../data/mockData'
import PageHeader from '../components/ui/PageHeader'
import SearchBar from '../components/ui/SearchBar'
import DocList from '../components/docs/DocList'
import { DocListSkeleton } from '../components/ui/Skeleton'

function firstNonEmpty(...values) {
  return values.find(value => {
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined
  })
}

export default function TeamDocsPage() {
  const navigate           = useNavigate()
  const { profile }        = useAuth()
  const { team, loading: teamLoading } = useTeam()

  const [docs, setDocs]           = useState([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag]     = useState('All')

  useEffect(() => {
    async function loadTeamDocs() {
      if (!profile?.team_id) {
        setDocs([])
        setDocsLoading(false)
        return
      }

      setDocsLoading(true)
      try {
        const { data, error } = await supabase.rpc('get_team_documents')
        if (error) throw error

        const rawDocs = Array.isArray(data) ? data : []
        const candidateIds = [...new Set(rawDocs.flatMap(doc => {
          const createdById = firstNonEmpty(
            doc.created_by,
            doc.created_by_id,
            doc.author_id,
            doc.owner_id
          )
          const updatedById = firstNonEmpty(
            doc.updated_by,
            doc.updated_by_id,
            doc.last_edited_by,
            doc.last_editor_id,
            createdById
          )
          return [createdById, updatedById].filter(Boolean)
        }))]

        let profileNameById = {}
        if (candidateIds.length > 0) {
          const { data: profileRows } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', candidateIds)

          profileNameById = (profileRows || []).reduce((acc, row) => {
            acc[row.id] = row.name
            return acc
          }, {})
        }

        const hydratedDocs = rawDocs.map(doc => {
          const createdById = firstNonEmpty(
            doc.created_by,
            doc.created_by_id,
            doc.author_id,
            doc.owner_id
          )

          const updatedById = firstNonEmpty(
            doc.updated_by,
            doc.updated_by_id,
            doc.last_edited_by,
            doc.last_editor_id,
            createdById
          )

          const createdByName = firstNonEmpty(
            doc.created_by_name,
            doc.creator_name,
            doc.author_name,
            doc.profiles?.name,
            profileNameById[createdById],
            createdById === profile?.id ? 'You' : null,
            'Unknown member'
          )

          const updatedByName = firstNonEmpty(
            doc.updated_by_name,
            doc.edited_by_name,
            doc.last_editor_name,
            profileNameById[updatedById],
            updatedById === profile?.id ? 'You' : null,
            createdByName
          )

          return {
            ...doc,
            created_by_name: createdByName,
            updated_by_name: updatedByName,
            created_by_id: createdById,
            updated_by_id: updatedById,
          }
        })

        setDocs(hydratedDocs)
      } catch (err) {
        console.error('Team docs error:', err.message)
        setDocs([])
      } finally {
        setDocsLoading(false)
      }
    }

    loadTeamDocs()
  }, [profile?.team_id])

  const filteredDocs = useMemo(() => {
    let result = [...docs]
    if (searchQuery.trim()) {
      result = result.filter(d =>
        d.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (activeTag !== 'All') {
      result = result.filter(d => d.tags?.includes(activeTag))
    }
    return result
  }, [docs, searchQuery, activeTag])

  const loading = teamLoading || docsLoading

  // not in a team
  if (!teamLoading && !profile?.team_id) {
    return (
      <div className="max-w-3xl">
        <PageHeader title="Team docs" subtitle="Shared team documentation" />
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-200 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-gray-700 mb-1">
            You're not in a team yet
          </p>
          <p className="text-[12px] text-gray-400 mb-5">
            Create a team or ask your admin to invite you
          </p>
          <button
            onClick={() => navigate('/team/settings')}
            className="px-4 py-2 text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Team Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={team ? `${team.name}` : 'Team docs'}
        subtitle={
          loading
            ? 'Loading...'
            : `${filteredDocs.length} shared document${filteredDocs.length !== 1 ? 's' : ''}`
        }
        actionLabel="+ New team doc"
        onAction={() => navigate('/docs/new')}
      />

      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search team documents..."
        />
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

      {loading ? (
        <DocListSkeleton count={4} />
      ) : (
        <DocList
          docs={filteredDocs}
          emptyMessage={
            searchQuery
              ? 'No team docs match your search'
              : "No team docs yet — create a doc and toggle 'Share with team'"
          }
        />
      )}
    </div>
  )
}