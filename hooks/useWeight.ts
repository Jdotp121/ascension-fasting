'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WeightEntry } from '@/types'
import { useAuth } from './useAuth'
import { useAchievements } from './useAchievements'

export function useWeight() {
  const { user } = useAuth()
  const { checkAndUnlockAchievements } = useAchievements()
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch weight entries
  const fetchWeightEntries = async () => {
    if (!user) {
      setWeightEntries([])
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })

      if (fetchError) throw fetchError

      setWeightEntries(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeightEntries()
  }, [user])

  // Add weight entry
  const addWeightEntry = async (weightKg: number, entryDate?: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Validation
    if (weightKg < 20 || weightKg > 500) {
      throw new Error('Weight must be between 20kg and 500kg')
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const date = entryDate || new Date().toISOString().split('T')[0]

      // Check if entry already exists for this date
      const { data: existing } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', date)
        .single()

      if (existing) {
        throw new Error('Weight entry already exists for this date. You can only log one weight per day.')
      }

      const { data, error: insertError } = await supabase
        .from('weight_entries')
        .insert({
          user_id: user.id,
          weight_kg: weightKg,
          entry_date: date
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Refresh the list
      await fetchWeightEntries()
      
      // Check for achievements after adding weight entry
      await checkAndUnlockAchievements()
      
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete weight entry
  const deleteWeightEntry = async (entryId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Refresh the list
      await fetchWeightEntries()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get weight statistics
  const getWeightStats = () => {
    if (weightEntries.length === 0) {
      return {
        currentWeight: null,
        startingWeight: null,
        totalLost: null,
        percentageLost: null
      }
    }

    // Sort by date ascending to get starting weight
    const sortedAsc = [...weightEntries].sort((a, b) => 
      new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
    )

    const startingWeight = sortedAsc[0].weight_kg
    const currentWeight = weightEntries[0].weight_kg // Already sorted descending
    const totalLost = startingWeight - currentWeight
    const percentageLost = (totalLost / startingWeight) * 100

    return {
      currentWeight,
      startingWeight,
      totalLost,
      percentageLost
    }
  }

  return {
    weightEntries,
    loading,
    error,
    addWeightEntry,
    deleteWeightEntry,
    refreshWeightEntries: fetchWeightEntries,
    getWeightStats
  }
}
