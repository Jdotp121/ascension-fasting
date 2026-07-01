'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ACHIEVEMENTS, AchievementStats, UserAchievement } from '@/lib/achievements/definitions'

export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([])
  const [stats, setStats] = useState<AchievementStats>({
    completedFasts: 0,
    fast24h: 0,
    fast48h: 0,
    fast72h: 0,
    weightEntries: 0,
    weightLost: 0,
    currentWeight: null,
    goalWeight: null,
    daysLogged: 0,
  })
  const [loading, setLoading] = useState(true)
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])

  const fetchStats = useCallback(async (userId: string) => {
    const supabase = createClient()

    try {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_weight_kg, goal_weight_kg')
        .eq('id', userId)
        .single()

      // Get fasting stats
      const { data: fasts } = await supabase
        .from('fasts')
        .select('*')
        .eq('user_id', userId)

      const completedFasts = fasts?.filter(f => f.completed).length || 0
      const fast24h = fasts?.filter(f => f.completed && f.duration_hours && f.duration_hours >= 24).length || 0
      const fast48h = fasts?.filter(f => f.completed && f.duration_hours && f.duration_hours >= 48).length || 0
      const fast72h = fasts?.filter(f => f.completed && f.duration_hours && f.duration_hours >= 72).length || 0

      // Get weight stats
      const { data: weightEntries } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: true })

      const weightEntriesCount = weightEntries?.length || 0
      const firstWeight = weightEntries && weightEntries.length > 0 ? weightEntries[0].weight_kg : null
      const currentWeight = weightEntries && weightEntries.length > 0 ? weightEntries.at(-1)?.weight_kg : profile?.current_weight_kg || null
      const weightLost = firstWeight && currentWeight ? Math.max(0, firstWeight - currentWeight) : 0

      // Get days logged (unique days with weight entries)
      const uniqueDays = new Set(weightEntries?.map(w => w.entry_date) || [])
      const daysLogged = uniqueDays.size

      setStats({
        completedFasts,
        fast24h,
        fast48h,
        fast72h,
        weightEntries: weightEntriesCount,
        weightLost,
        currentWeight,
        goalWeight: profile?.goal_weight_kg || null,
        daysLogged,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  const fetchAchievements = useCallback(async () => {
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch unlocked achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })

      setUnlockedAchievements(achievements || [])

      // Fetch stats for progress tracking
      await fetchStats(user.id)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchStats])

  useEffect(() => {
    // Initial data fetch on mount. setState calls happen inside an async
    // callback after awaiting Supabase, which is a legitimate data-fetch
    // pattern (not a synchronous cascading render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAchievements()
  }, [fetchAchievements])

  const checkAndUnlockAchievements = useCallback(async () => {
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      // Call the database function to check and award achievements
      const { data, error } = await supabase.rpc('check_and_award_achievements', {
        p_user_id: user.id
      })

      if (error) throw error

      // The function returns an array of newly unlocked achievement IDs
      const newUnlocks = data?.[0]?.newly_unlocked || []

      if (newUnlocks.length > 0) {
        setNewlyUnlocked(newUnlocks)
        // Refresh achievements
        await fetchAchievements()
      }

      return newUnlocks
    } catch (error: unknown) {
      // Log detailed error information for debugging
      const err = error as { message?: string; details?: string; hint?: string; code?: string }
      console.error('Error checking achievements:', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        error: error
      })
      return []
    }
  }, [fetchAchievements])

  const clearNewlyUnlocked = () => {
    setNewlyUnlocked([])
  }

  const getAchievementProgress = () => {
    return ACHIEVEMENTS.map(achievement => {
      const unlocked = unlockedAchievements.find(ua => ua.achievement_id === achievement.id)
      const progress = achievement.checkProgress(stats)

      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlocked_at || null,
        progress,
      }
    })
  }

  const getUnlockedCount = () => {
    return unlockedAchievements.length
  }

  const getTotalCount = () => {
    return ACHIEVEMENTS.length
  }

  return {
    achievements: getAchievementProgress(),
    unlockedAchievements,
    stats,
    loading,
    newlyUnlocked,
    unlockedCount: getUnlockedCount(),
    totalCount: getTotalCount(),
    checkAndUnlockAchievements,
    clearNewlyUnlocked,
    refresh: fetchAchievements,
  }
}