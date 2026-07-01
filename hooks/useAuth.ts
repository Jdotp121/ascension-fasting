'use client'

import { useCallback, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const supabase = createClient()
      // Use maybeSingle() instead of single() so that a missing profile row
      // does not trigger a Supabase error (PGRST116). This lets us handle the
      // "no profile yet" case gracefully instead of logging a confusing error.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        setProfile(null)
        return
      }

      // Profile exists — set it and continue.
      if (data) {
        setProfile(data)
        return
      }

      // No profile row exists yet. A database trigger normally creates one on
      // signup, but cover edge cases (pre-trigger users, trigger failures) by
      // upserting a minimal profile so the app can continue safely without
      // redirect loops or empty error logs.
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setProfile(null)
        return
      }

      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email ?? '',
          name: (user.user_metadata?.name as string) ?? 'User',
        })
        .select('*')
        .maybeSingle()

      if (upsertError) {
        console.error('Error creating missing profile:', {
          message: upsertError.message,
          code: upsertError.code,
          details: upsertError.details,
          hint: upsertError.hint,
        })
        setProfile(null)
        return
      }

      setProfile(upsertedProfile)
    } catch (error) {
      console.error('Error fetching profile:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error,
      })
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}
