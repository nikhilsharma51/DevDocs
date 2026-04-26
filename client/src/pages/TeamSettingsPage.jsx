
import { useState } from 'react'
import { useTeam } from '../hooks/useTeam'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

export default function TeamSettingsPage() {
  const { profile } = useAuth()
  const {
    team, members, invites, loading,
    createTeam, inviteMember, removeMember, leaveTeam
  } = useTeam()

  const [teamName, setTeamName]     = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [creating, setCreating]     = useState(false)
  const [inviting, setInviting]     = useState(false)
  const [showLeave, setShowLeave]   = useState(false)
  const [showRemove, setShowRemove] = useState(null) 

  const isAdmin = profile?.role === 'admin'

  // ── create team ─────────────────────────────────────────
  async function handleCreateTeam(e) {
    e.preventDefault()
    if (!teamName.trim()) return
    setCreating(true)
    const { error } = await createTeam(teamName.trim())
    if (error) {
      toast.error(error.message || 'Failed to create team')
    } else {
      toast.success('Team created!')
      setTeamName('')
    }
    setCreating(false)
  }

  // ── invite member ────────────────────────────────────────
  async function handleInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    const { error } = await inviteMember(inviteEmail.trim())
    if (error) {
      toast.error(error.message || 'Failed to send invite')
    } else {
      toast.success(`Invite sent to ${inviteEmail}`)
      setInviteEmail('')
    }
    setInviting(false)
  }

  // ── remove member ────────────────────────────────────────
  async function handleRemove(memberId) {
    const { error } = await removeMember(memberId)
    if (error) {
      toast.error('Failed to remove member')
    } else {
      toast.success('Member removed')
    }
    setShowRemove(null)
  }

  // ── leave team ───────────────────────────────────────────
  async function handleLeave() {
    const { error } = await leaveTeam()
    if (error) {
      toast.error('Failed to leave team')
    } else {
      toast.success('You left the team')
    }
    setShowLeave(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  // ── no team yet ──────────────────────────────────────────
  if (!team) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Team settings" subtitle="Create or join a team" />

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-[14px] font-medium text-gray-900 mb-1">Create a new team</h2>
          <p className="text-[12px] text-gray-400 mb-5">
            You'll become the team admin and can invite members after creating.
          </p>

          <form onSubmit={handleCreateTeam} className="flex gap-3">
            <input
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. Engineering, Backend Team..."
              className="flex-1 h-[38px] bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
            />
            <button
              type="submit"
              disabled={creating || !teamName.trim()}
              className="px-4 h-[38px] text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating...' : 'Create team'}
            </button>
          </form>
        </div>

        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-[12px] text-gray-500 text-center">
            Or ask your team admin to invite you by your email address
          </p>
        </div>
      </div>
    )
  }

  // ── has team ─────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      <PageHeader
        title={team.name}
        subtitle="Team settings"
      />

      {/* Invite members — admin only */}
      {isAdmin && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="text-[13px] font-medium text-gray-900 mb-1">Invite a member</h2>
          <p className="text-[11px] text-gray-400 mb-4">
            They'll see an invite banner when they log in.
          </p>
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 h-[36px] bg-gray-50 border border-gray-200 rounded-lg px-3 text-[12px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
            />
            <button
              type="submit"
              disabled={inviting || !inviteEmail.trim()}
              className="px-4 h-[36px] text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {inviting ? 'Sending...' : 'Send invite'}
            </button>
          </form>
        </div>
      )}

      {/* Pending invites */}
      {isAdmin && invites.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="text-[13px] font-medium text-gray-900 mb-3">
            Pending invites
            <span className="ml-2 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
              {invites.length}
            </span>
          </h2>
          <div className="flex flex-col gap-2">
            {invites.map(invite => (
              <div key={invite.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-[12px] text-gray-600">{invite.invited_email}</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="text-[13px] font-medium text-gray-900 mb-3">
          Members
          <span className="ml-2 text-[11px] text-gray-400">
            {members.length} {members.length === 1 ? 'person' : 'people'}
          </span>
        </h2>

        <div className="flex flex-col gap-1">
          {members.map(member => {
            const initials = member.name
              ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
            const isCurrentUser = member.id === profile?.id
            const isCreator     = member.id === team.created_by

            return (
              <div key={member.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-gray-800">
                      {member.name}
                      {isCurrentUser && (
                        <span className="ml-1.5 text-[10px] text-gray-400">(you)</span>
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400 capitalize">
                      {isCreator ? 'Admin · Team creator' : member.role}
                    </p>
                  </div>
                </div>

                {/* Remove button — admin only, can't remove yourself or creator */}
                {isAdmin && !isCurrentUser && !isCreator && (
                  <button
                    onClick={() => setShowRemove(member.id)}
                    className="text-[11px] text-red-400 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Leave team — non-creators only */}
      {team.created_by !== profile?.id && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-[13px] font-medium text-gray-900 mb-1">Leave team</h2>
          <p className="text-[11px] text-gray-400 mb-3">
            You'll lose access to all team documents.
          </p>
          <button
            onClick={() => setShowLeave(true)}
            className="px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Leave team
          </button>
        </div>
      )}

      {/* Confirm remove member */}
      <Modal
        isOpen={Boolean(showRemove)}
        title="Remove member?"
        message="This member will lose access to all team documents."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        danger
        onConfirm={() => handleRemove(showRemove)}
        onCancel={() => setShowRemove(null)}
      />

      {/* Confirm leave */}
      <Modal
        isOpen={showLeave}
        title="Leave team?"
        message="You'll lose access to all team documents. You can rejoin if you're invited again."
        confirmLabel="Leave team"
        cancelLabel="Cancel"
        danger
        onConfirm={handleLeave}
        onCancel={() => setShowLeave(false)}
      />
    </div>
  )
}