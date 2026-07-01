'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Fast } from '@/types'
import { useAuth } from './useAuth'

export function useFastHistory() {
  const { user } = useAuth()
  const [fasts, setFasts] = useState<Fast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFastHistory = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('fasts')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('start_time', { ascending: false })

      if (fetchError) throw fetchError

      setFasts(data || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    // Initial data fetch on mount/user change. setState calls happen inside an
    // async callback after awaiting Supabase, which is a legitimate data-fetch
    // pattern (not a synchronous cascading render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFastHistory()
  }, [user, fetchFastHistory])

  return {
    fasts: user ? fasts : [],
    loading: user ? loading : false,
    error,
    refreshHistory: fetchFastHistory
  }
}