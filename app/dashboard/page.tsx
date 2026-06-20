'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { AchievementsCard } from '@/components/achievements/AchievementsCard'
import { AchievementCelebration } from '@/components/achievements/AchievementCelebration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Timer, Scale, TrendingDown, Award, Target, Flame, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardStats } from '@/types'
import { useWeight } from '@/hooks/useWeight'
import { useAchievements } from '@/hooks/useAchievements'

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

  useEffect(() => {
    fetchDashboardData()
  }, [weightEntries])

  useEffect(() => {
    // Check for new achievements when dashboard loads
    const checkAchievements = async () => {
      await checkAndUnlockAchievements()
    }
    if (!loading) {
      checkAchievements()
    }
  }, [loading])

  const fetchDashboardData = async () => {
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
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

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
        {stats.activeFast ? (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Timer className="w-6 h-6" />
                Active Fast in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-700">Type: {stats.activeFast.fast_type}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Started: {new Date(stats.activeFast.start_time).toLocaleString()}
                  </p>
                </div>
                <Button onClick={() => router.push('/fast')} variant="primary">
                  View Fast
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-6 h-6" />
                No Active Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Ready to start a new fast?</p>
              <Button onClick={() => router.push('/fast')} variant="primary">
                Start a Fast
              </Button>
            </CardContent>
          </Card>
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
