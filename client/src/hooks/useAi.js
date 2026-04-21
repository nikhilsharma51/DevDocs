// src/hooks/useAiQuery.js
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export function useAiQuery() {
  const { session }   = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function askQuestion(question) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/query`,
        { question },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      setLoading(false)
      return data   // { answer, sources }
    } catch (err) {
      const msg = err.response?.data?.error || 'AI query failed'
      setError(msg)
      setLoading(false)
      return null
    }
  }

  return { askQuestion, loading, error }
}