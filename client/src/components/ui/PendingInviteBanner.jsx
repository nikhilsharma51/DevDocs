import { useState } from 'react'
import { useTeam } from '../../hooks/useTeam'
import toast from 'react-hot-toast'

export default function PendingInviteBanner() {
  const { pendingInvite, acceptInvite, declineInvite } = useTeam()
  const [loading, setLoading] = useState(false)

  if (!pendingInvite) return null

  async function handleAccept() {
    setLoading(true)
    const { error } = await acceptInvite(pendingInvite.id)
    if (error) {
      toast.error(error.message || 'Failed to accept invite')
    } else {
      toast.success(`You joined "${pendingInvite.team_name}"!`)
    }
    setLoading(false)
  }

  async function handleDecline() {
    setLoading(true)
    await declineInvite(pendingInvite.id)
    toast.success('Invite declined')
    setLoading(false)
  }

  return (
    <div className="mb-6 flex items-start justify-between gap-4 px-4 py-3.5 bg-purple-50 border border-purple-200 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-medium text-purple-900">
            You've been invited to join{' '}
            <span className="font-semibold">
              {pendingInvite.team_name || 'a team'}
            </span>
          </p>
          <p className="text-[11px] text-purple-600 mt-0.5">
            Accept to collaborate and access shared team documentation
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleDecline}
          disabled={loading}
          className="px-3 py-1.5 text-[11px] text-purple-700 border border-purple-200 bg-white rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          disabled={loading}
          className="px-3 py-1.5 text-[11px] font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Accept invite'}
        </button>
      </div>
    </div>
  )
}