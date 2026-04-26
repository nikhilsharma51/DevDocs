import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const PREFERENCES_KEY = 'devdocs:profile-preferences'
const DEFAULT_PREFERENCES = {
  emailDigest: true,
  compactCards: false,
  aiSuggestions: true,
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'
}

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [savingName, setSavingName] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [preferences, setPreferences] = useState(loadPreferences)

  useEffect(() => {
    const name = profile?.name || user?.user_metadata?.name || ''
    setDisplayName(name)
  }, [profile?.name, user?.user_metadata?.name])

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  }, [preferences])

  const teamLabel = useMemo(() => {
    if (!profile?.team_id) return 'No team'
    return profile.team_id
  }, [profile?.team_id])

  const avatarName = displayName || profile?.name || user?.email || 'User'

  async function handleSaveName(event) {
    event.preventDefault()
    const nextName = displayName.trim()

    if (!nextName) {
      toast.error('Name cannot be empty')
      return
    }

    if (!user?.id) {
      toast.error('User session not found')
      return
    }

    setSavingName(true)
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: nextName })
        .eq('id', user.id)

      if (profileError) throw profileError

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: nextName }
      })

      if (metadataError) {
        console.warn('Profile metadata update failed:', metadataError.message)
      }

      if (typeof refreshProfile === 'function') {
        await refreshProfile()
      }

      toast.success('Profile updated')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (error) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  function togglePreference(key) {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile"
        subtitle="Account details and personal settings"
      />

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-gray-900 mb-4">Account details</h2>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-[14px] font-semibold text-purple-800 shrink-0">
            {getInitials(avatarName)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div>
              <p className="text-[11px] text-gray-400">Email</p>
              <p className="text-[13px] text-gray-800 break-all">{user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Role</p>
              <p className="text-[13px] text-gray-800 capitalize">{profile?.role || 'developer'}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Team</p>
              <p className="text-[13px] text-gray-800">{teamLabel}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">User ID</p>
              <p className="text-[13px] text-gray-800 break-all">{user?.id || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveName} className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-gray-900 mb-1">Profile info</h2>
        <p className="text-[11px] text-gray-400 mb-4">
          Update your display name used across team docs and comments.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            placeholder="Your display name"
            className="flex-1 h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
          />
          <button
            type="submit"
            disabled={savingName || !displayName.trim()}
            className="px-4 h-10 text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {savingName ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-gray-900 mb-1">Security</h2>
        <p className="text-[11px] text-gray-400 mb-4">
          Set a new password for your account.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="New password"
            className="h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            className="h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={savingPassword || !password || !confirmPassword}
          className="px-4 h-10 text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-[14px] font-medium text-gray-900 mb-1">Preferences</h2>
        <p className="text-[11px] text-gray-400 mb-4">
          Basic interface preferences for your account.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => togglePreference('emailDigest')}
            className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="text-[12px] font-medium text-gray-800">Email digest notifications</p>
              <p className="text-[11px] text-gray-400">Receive periodic updates by email</p>
            </div>
            <span className={`text-[11px] px-2 py-1 rounded-full ${preferences.emailDigest ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {preferences.emailDigest ? 'On' : 'Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => togglePreference('compactCards')}
            className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="text-[12px] font-medium text-gray-800">Compact doc cards</p>
              <p className="text-[11px] text-gray-400">Reduce visual density in lists</p>
            </div>
            <span className={`text-[11px] px-2 py-1 rounded-full ${preferences.compactCards ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {preferences.compactCards ? 'On' : 'Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => togglePreference('aiSuggestions')}
            className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="text-[12px] font-medium text-gray-800">AI writing suggestions</p>
              <p className="text-[11px] text-gray-400">Show contextual AI assist hints</p>
            </div>
            <span className={`text-[11px] px-2 py-1 rounded-full ${preferences.aiSuggestions ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {preferences.aiSuggestions ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
