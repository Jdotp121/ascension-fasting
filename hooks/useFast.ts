'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Fast, FastType } from '@/types'
import { useAuth } from './useAuth'

export function useFast() {
  const { user } = useAuth()
  const [activeFast, setActiveFast] = useState<Fast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch active fast
  const fetchActiveFast = async () => {
    if (!user) {
      setActiveFast(null)
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('fasts')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('start_time', { ascending: false })
        .limit(1)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No active fast found
          setActiveFast(null)
        } else {
          throw fetchError
        }
      } else {
        setActiveFast(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveFast()
  }, [user])

  // Start a new fast
  const startFast = async (fastType: FastType, durationHours: number) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const startTime = new Date()
      const plannedEndTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000)

      const { data, error: insertError } = await supabase
        .from('fasts')
        .insert({
          user_id: user.id,
          fast_type: fastType,
          start_time: startTime.toISOString(),
          planned_end_time: plannedEndTime.toISOString(),
          completed: false
        })
        .select()
        .single()

      if (insertError) throw insertError

      setActiveFast(data)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // End the active fast
  const endFast = async (breakReason?: string) => {
    if (!activeFast) {
      throw new Error('No active fast to end')
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const actualEndTime = new Date()
      const startTime = new Date(activeFast.start_time)
      const durationHours = (actualEndTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      const { data, error: updateError } = await supabase
        .from('fasts')
        .update({
          actual_end_time: actualEndTime.toISOString(),
          duration_hours: durationHours,
          completed: true,
          break_reason: breakReason || null
        })
        .eq('id', activeFast.id)
        .select()
        .single()

      if (updateError) throw updateError

      setActiveFast(null)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    activeFast,
    loading,
    error,
    startFast,
    endFast,
    refreshActiveFast: fetchActiveFast
  }
}
