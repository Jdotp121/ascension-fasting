'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { AddWeightEntry } from '@/components/weight/AddWeightEntry'
import { WeightProgressCard } from '@/components/weight/WeightProgressCard'
import { WeightChart } from '@/components/weight/WeightChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useWeight } from '@/hooks/useWeight'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Trash2, Calendar, Target, Settings } from 'lucide-react'

export default function WeightPage() {
  const { weightEntries, loading, addWeightEntry, deleteWeightEntry } = useWeight()
  const [goalWeight, setGoalWeight] = useState<number | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('goal_weight_kg')
        .eq('id', user.id)
        .single()

      if (profile) {
        setGoalWeight(profile.goal_weight_kg)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this weight entry?')) {
      return
    }

    try {
      await deleteWeightEntry(entryId)
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry')
    }
  }

  // Calculate stats
  const sortedAsc = [...weightEntries].sort((a, b) => 
    new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
  )
  const startingWeight = sortedAsc.length > 0 ? sortedAsc[0].weight_kg : null
  const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight_kg : null

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <AppPageLayout>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading weight data...</p>
            </div>
          </div>
        </AppPageLayout>
        <BottomNav />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <AppPageLayout title="Weight Tracker" subtitle="Log and track your weight progress">
        <div className="space-y-6">
          {/* Weight Tracking Recommendation */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    <strong>For the most accurate and consistent results,</strong> weigh yourself first thing in the morning after using the bathroom and before eating or drinking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Weight Entry */}
          <AddWeightEntry onAdd={addWeightEntry} />

          {/* Weight Progress Card */}
          {weightEntries.length > 0 && (
            <WeightProgressCard
              startingWeight={startingWeight}
              currentWeight={currentWeight}
              goalWeight={goalWeight}
            />
          )}

          {/* Goal Weight Guidance */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
            <CardContent className="py-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    🎯 Goal Weight Management
                  </h3>
                  <p className="text-sm text-green-900 leading-relaxed mb-3">
                    Your goal weight is configured from your <strong>Profile page</strong> under Health Goals. Update it anytime to track progress toward a new target.
                  </p>
                  <Link href="/profile">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Update Goal Weight
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weight Chart */}
          <WeightChart weightEntries={weightEntries} goalWeight={goalWeight} />

          {/* Weight Entries List */}
          {weightEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Weight History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weightEntries.map((entry) => {
                    const entryDate = new Date(entry.entry_date)
                    const createdDate = new Date(entry.created_at)
                    const today = new Date()
                    const isToday = entryDate.toDateString() === today.toDateString()
                    
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {entry.weight_kg.toFixed(1)} kg
                          </p>
                          <p className="text-sm text-gray-600">
                            {isToday ? 'Today' : entryDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            Logged {isToday ? 'today' : 'on'} at {createdDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {weightEntries.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No weight entries yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start tracking your weight to see your progress over time
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AppPageLayout>

      <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
