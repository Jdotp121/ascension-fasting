'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '@/types'

interface UpdateProfileData {
  name?: string
  age?: number | null
  sex?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  height_cm?: number | null
  goal_weight_kg?: number | null
  main_goal?: 'weight_loss' | 'health' | 'discipline' | 'religious' | 'longevity' | null
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No authenticated user')
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) throw fetchError

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'No authenticated user' }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (updateError) throw updateError

      // Refresh profile data
      await fetchProfile()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  }
}
