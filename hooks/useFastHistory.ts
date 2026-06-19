'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Fast } from '@/types'
import { useAuth } from './useAuth'

export function useFastHistory() {
  const { user } = useAuth()
  const [fasts, setFasts] = useState<Fast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFastHistory = async () => {
    if (!user) {
      setFasts([])
      setLoading(false)
      return
    }

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
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFastHistory()
  }, [user])

  return {
    fasts,
    loading,
    error,
    refreshHistory: fetchFastHistory
  }
}
