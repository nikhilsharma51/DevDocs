import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useDocs({ teamOnly = false } = {}) {
  const { user, profile } = useAuth()
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const userId = user?.id ?? null
  const teamId = profile?.team_id ?? null

  const fetchDocs = useCallback(async () => {
    if (!userId) {
      setDocs([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false })

      if (teamOnly) {
        if (!teamId) {
          setDocs([])
          setLoading(false)
          return
        }
        query = query.eq('team_id', teamId)
      } else {
        query = query.eq('author_id', userId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error('fetchDocs error:', fetchError.message)
        setError(fetchError.message)
        setDocs([])
      } else {
        setDocs(data || [])
      }
    } catch (err) {
      console.error('fetchDocs unexpected error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId, teamId, teamOnly])   // ← primitives only

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  async function createDoc(docData) {
    if (!userId) return { data: null, error: { message: 'Not authenticated' } }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        title:     docData.title,
        content:   docData.content,
        tags:      docData.tags || [],
        author_id: userId,
        ...(docData.team_id ? { team_id: docData.team_id } : {}),
      })
      .select()
      .single()

    if (error) return { data: null, error }
    setDocs(prev => [data, ...prev])
    return { data, error: null }
  }

  async function updateDoc(id, docData) {
    const updatePayload = {
      title:      docData.title,
      content:    docData.content,
      tags:       docData.tags,
      updated_at: new Date().toISOString(),
    }

    if (docData.team_id !== undefined) {
      updatePayload.team_id = docData.team_id
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error }
    setDocs(prev => prev.map(doc => doc.id === id ? data : doc))
    return { data, error: null }
  }

  async function deleteDoc(id) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) return { error }
    setDocs(prev => prev.filter(d => d.id !== id))
    return { error: null }
  }

  async function getDocById(id) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  }

  return {
    docs,
    error,
    loading,
    refetch:    fetchDocs,
    createDoc,
    addDoc:     createDoc,
    deleteDoc,
    updateDoc,
    getDocById,
    getDocbyId: getDocById,
  }
}