'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { AchievementsCard } from '@/components/achievements/AchievementsCard'
import { AchievementCelebration } from '@/components/achievements/AchievementCelebration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Scale, TrendingDown, Award, Target, Flame, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardStats } from '@/types'
import { useWeight } from '@/hooks/useWeight'
import { useAchievements } from '@/hooks/useAchievements'
import { WeightProgressCard } from '@/components/weight/WeightProgressCard'
import { ActiveFastSummaryCard } from '@/components/dashboard/ActiveFastSummaryCard'

export default function DashboardPage() {
  const router = useRouter()
  const { weightEntries } = useWeight()
  const { unlockedCount, totalCount, newlyUnlocked, clearNewlyUnlocked, checkAndUnlockAchievements } = useAchievements()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    activeFast: null,
    currentWeight: null,
    goalWeight: null,
    totalFasts: 0,
    completedFasts: 0,
    longestFastHours: null,
    weightLost: null,
    recentWeightEntries: [],
  })

  const fetchDashboardData = useCallback(async () => {
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Fetch active fast
      const { data: activeFast } = await supabase
        .from('fasts')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .is('actual_end_time', null)
        .order('start_time', { ascending: false })
        .limit(1)
        .single()

      // Fetch fast statistics
      const { data: fasts } = await supabase
        .from('fasts')
        .select('*')
        .eq('user_id', user.id)

      const totalFasts = fasts?.length || 0
      const completedFasts = fasts?.filter(f => f.completed).length || 0
      const longestFast = fasts?.reduce((max, f) =>
        f.duration_hours && f.duration_hours > (max || 0) ? f.duration_hours : max,
        0
      )

      // Calculate weight stats from weightEntries
      const sortedWeights = [...weightEntries].sort((a, b) =>
        new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
      )
      const startWeight = sortedWeights.length > 0 ? sortedWeights[0].weight_kg : null
      const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight_kg : null
      const weightLost = startWeight && currentWeight ? startWeight - currentWeight : null

      setStats({
        activeFast: activeFast || null,
        currentWeight: currentWeight || profile?.current_weight_kg || null,
        goalWeight: profile?.goal_weight_kg || null,
        totalFasts,
        completedFasts,
        longestFastHours: longestFast || null,
        weightLost,
        recentWeightEntries: weightEntries.slice(0, 7),
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard data'
      console.error('Error fetching dashboard data:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [weightEntries])

  useEffect(() => {
    // Initial data fetch on mount. setState calls happen inside an async
    // callback after awaiting Supabase, which is a legitimate data-fetch
    // pattern (not a synchronous cascading render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    // Check for new achievements when dashboard loads
    if (loading) return
    checkAndUnlockAchievements()
  }, [loading, checkAndUnlockAchievements])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <AppPageLayout>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
        
        <AppPageLayout title="Dashboard" subtitle="Track your fasting journey">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error loading dashboard</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Fast Card */}
        <ActiveFastSummaryCard fast={stats.activeFast} />

        {/* Weight Progress Card */}
        {weightEntries.length > 0 && (
          <div className="mb-6">
            <WeightProgressCard
              startingWeight={
                weightEntries.length > 0
                  ? [...weightEntries].sort((a, b) => 
                      new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
                    )[0].weight_kg
                  : null
              }
              currentWeight={stats.currentWeight}
              goalWeight={stats.goalWeight}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current Weight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scale className="w-5 h-5 text-blue-600" />
                Current Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {stats.currentWeight ? `${stats.currentWeight} kg` : 'Not set'}
              </p>
              <Button 
                onClick={() => router.push('/weight')} 
                variant="ghost" 
                size="sm" 
                className="mt-2"
              >
                Log Weight
              </Button>
            </CardContent>
          </Card>

          {/* Goal Weight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-green-600" />
                Goal Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {stats.goalWeight ? `${stats.goalWeight} kg` : 'Not set'}
              </p>
              {stats.currentWeight && stats.goalWeight && (
                <p className="text-sm text-gray-600 mt-2">
                  {(stats.currentWeight - stats.goalWeight).toFixed(1)} kg to go
                </p>
              )}
            </CardContent>
          </Card>

          {/* Weight Lost */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="w-5 h-5 text-purple-600" />
                Weight Lost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {stats.weightLost ? `${stats.weightLost.toFixed(1)} kg` : '0 kg'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Since you started</p>
            </CardContent>
          </Card>

          {/* Total Fasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="w-5 h-5 text-orange-600" />
                Total Fasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFasts}</p>
              <p className="text-sm text-gray-600 mt-2">
                {stats.completedFasts} completed
              </p>
            </CardContent>
          </Card>

          {/* Longest Fast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-yellow-600" />
                Longest Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {stats.longestFastHours 
                  ? `${Math.floor(stats.longestFastHours)}h` 
                  : '0h'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Personal record</p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <AchievementsCard unlockedCount={unlockedCount} totalCount={totalCount} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/fast')} 
              variant="primary"
              className="w-full"
            >
              Start Fast
            </Button>
            <Button 
              onClick={() => router.push('/weight')} 
              variant="outline"
              className="w-full"
            >
              Log Weight
            </Button>
            <Button 
              onClick={() => router.push('/history')} 
              variant="ghost"
              className="w-full"
            >
              View History
            </Button>
          </div>
        </div>
      </AppPageLayout>

      <BottomNav />
      
      {/* Achievement Celebration Modal */}
      {newlyUnlocked.length > 0 && (
        <AchievementCelebration
          achievementIds={newlyUnlocked}
          onClose={clearNewlyUnlocked}
        />
      )}
      </div>
    </ProtectedRoute>
  )
}
