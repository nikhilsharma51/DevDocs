import { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null)
const DEFAULT_ROLE = 'developer'

function buildFallbackProfile(authUser) {
  const nameFromMetadata = authUser?.user_metadata?.name
  const nameFromEmail = authUser?.email ? authUser.email.split('@')[0] : ''
  const name = (nameFromMetadata || nameFromEmail || 'User').trim()

  return {
    id: authUser?.id ?? null,
    name,
    role: DEFAULT_ROLE,
  }
}

// This wraps the whole app and broadcasts auth state to everyone
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return { data: null, error: null }
    }

    const fallbackProfile = buildFallbackProfile(user)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error || !data) {
        setProfile(fallbackProfile)
        return { data: fallbackProfile, error }
      }

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      setProfile(fallbackProfile)
      return { data: fallbackProfile, error }
    }
  }, [user])

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!isMounted) return

        setSession(session)
        setUser(session?.user ?? null)
      } catch {
        if (!isMounted) return

        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initializeAuth()

    // listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // cleanup — stop listening when component unmounts
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!user) {
        setProfile(null)
        return
      }

      const { data } = await refreshProfile()
      if (!isMounted) return

      // if unmounted between async completion and state propagation,
      // keep local state aligned with latest data.
      if (data) {
        setProfile(data)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user, refreshProfile])

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    })
    return { data, error }
  }

  async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    return { data, error }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      setSession(null)
      setUser(null)
      setProfile(null)
    }

    return { error }
  }

  // everything components can access
  const value = {
    user,        // Supabase auth user (id, email)
    session,     // raw session object
    profile,     // your profiles table row (name, role, team_id)
    loading,     // true while checking session on first load
    refreshProfile,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3 — export the context so useAuth can read it
export { AuthContext }