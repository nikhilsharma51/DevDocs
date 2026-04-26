
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useTeam() {
  const { user, refreshProfile } = useAuth()

  const [team, setTeam]                   = useState(null)
  const [members, setMembers]             = useState([])
  const [invites, setInvites]             = useState([])
  const [pendingInvite, setPendingInvite] = useState(null)
  const [hasTeam, setHasTeam]             = useState(false)
  const [loading, setLoading]             = useState(true)

  const userId = user?.id ?? null

  async function fetchPendingInviteFallback() {
    const email = user?.email?.trim().toLowerCase()
    if (!email) return null

    const { data, error } = await supabase
      .from('team_invites')
      .select('*')
      .ilike('invited_email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      return null
    }

    if (Array.isArray(data) && data.length > 0) {
      const invite = data[0]
      return {
        ...invite,
        team_name:
          invite.team_name ||
          invite.team?.name ||
          invite.teams?.name ||
          invite.name ||
          'a team',
      }
    }

    return null
  }

  function resolvePendingInvite(payload) {
    const directPending =
      payload.pending ||
      payload.pendingInvite ||
      payload.pending_invite ||
      (Array.isArray(payload.pendingInvites) ? payload.pendingInvites[0] : null) ||
      (Array.isArray(payload.pending_invites) ? payload.pending_invites[0] : null)

    if (!directPending) return null

    return {
      ...directPending,
      team_name:
        directPending.team_name ||
        directPending.team?.name ||
        directPending.teams?.name ||
        directPending.name ||
        'a team',
    }
  }

  const fetchTeam = useCallback(async () => {
    if (!userId) {
      setTeam(null)
      setMembers([])
      setInvites([])
      setPendingInvite(null)
      setHasTeam(false)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('get_my_team_data')
      if (error) throw error

      const payload = data && typeof data === 'object' ? data : {}
      const pendingFromRpc = resolvePendingInvite(payload)
      const shouldLookupFallback =
        !pendingFromRpc &&
        !Boolean(payload.hasTeam ?? payload.has_team)
      const pendingFallback = shouldLookupFallback
        ? await fetchPendingInviteFallback()
        : null
      const pending = pendingFromRpc || pendingFallback

      setHasTeam(Boolean(payload.hasTeam ?? payload.has_team))
      setTeam(payload.team || payload.current_team || null)
      setMembers(Array.isArray(payload.members) ? payload.members : [])
      setInvites(Array.isArray(payload.invites) ? payload.invites : [])
      setPendingInvite(pending)
    } catch (err) {
      console.error('fetchTeam error:', err.message)
      const pendingFallback = await fetchPendingInviteFallback()
      setPendingInvite(pendingFallback)
    } finally {
      setLoading(false)
    }
  }, [userId, user?.email])

  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  useEffect(() => {
    if (!userId) return

    const refresh = () => fetchTeam()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTeam()
      }
    }

    const intervalId = window.setInterval(refresh, 15000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [userId, fetchTeam])

  async function createTeam(name) {
    try {
      const { data, error } = await supabase.rpc('create_team', {
        team_name: name.trim()
      })
      if (error) throw error
      if (typeof refreshProfile === 'function') {
        await refreshProfile()
      }
      await fetchTeam()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async function inviteMember(email) {
    try {
      const { data, error } = await supabase.rpc('invite_team_member', {
        member_email: email.trim().toLowerCase()
      })
      if (error) throw error
      await fetchTeam()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async function acceptInvite(inviteId) {
    try {
      const { error } = await supabase.rpc('accept_team_invite', {
        invite_id: inviteId
      })
      if (error) throw error
      setPendingInvite(null)
      if (typeof refreshProfile === 'function') {
        await refreshProfile()
      }
      await fetchTeam()
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  async function declineInvite(inviteId) {
    try {
      const { error } = await supabase.rpc('decline_team_invite', {
        invite_id: inviteId
      })
      if (error) throw error
      setPendingInvite(null)
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  async function cancelInvite(inviteId) {
    try {
      const { error } = await supabase.rpc('cancel_team_invite', {
        invite_id: inviteId
      })
      if (error) throw error
      setInvites(prev => prev.filter(i => i.id !== inviteId))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  async function removeMember(memberId) {
    try {
      const { error } = await supabase.rpc('remove_team_member', {
        member_id: memberId
      })
      if (error) throw error
      setMembers(prev => prev.filter(m => m.id !== memberId))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  async function leaveTeam() {
    try {
      const { error } = await supabase.rpc('leave_team')
      if (error) throw error
      if (typeof refreshProfile === 'function') {
        await refreshProfile()
      }
      setTeam(null)
      setMembers([])
      setInvites([])
      setHasTeam(false)
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  return {
    team,
    members,
    invites,
    pendingInvite,
    hasTeam,
    loading,
    createTeam,
    inviteMember,
    cancelInvite,
    acceptInvite,
    declineInvite,
    removeMember,
    leaveTeam,
    refetch: fetchTeam,
  }
}