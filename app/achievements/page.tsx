'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { AchievementCard } from '@/components/achievements/AchievementCard'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAchievements } from '@/hooks/useAchievements'
import { ACHIEVEMENTS } from '@/lib/achievements/definitions'
import { Loader2, Trophy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

type CategoryFilter = 'all' | 'fasting' | 'weight_loss' | 'consistency'

export default function AchievementsPage() {
  const { achievements, loading, unlockedCount, totalCount, checkAndUnlockAchievements } = useAchievements()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [checking, setChecking] = useState(false)

  const handleCheckAchievements = async () => {
    setChecking(true)
    try {
      await checkAndUnlockAchievements()
    } catch (error) {
      console.error('Error checking achievements:', error)
    } finally {
      setChecking(false)
    }
  }

  // Filter achievements by category
  const filteredAchievements = categoryFilter === 'all' 
    ? achievements 
    : achievements.filter(a => {
        const def = ACHIEVEMENTS.find(d => d.id === a.id)
        return def?.category === categoryFilter
      })

  // Calculate category stats
  const categoryStats = {
    fasting: ACHIEVEMENTS.filter(a => a.category === 'fasting').length,
    weight_loss: ACHIEVEMENTS.filter(a => a.category === 'weight_loss').length,
    consistency: ACHIEVEMENTS.filter(a => a.category === 'consistency').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <AppPageLayout>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading achievements...</p>
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
        
        <AppPageLayout 
          title="Achievements" 
          subtitle="Track your fasting milestones and accomplishments"
          icon={<Trophy className="w-8 h-8 text-yellow-500" />}
        >
          {/* Progress Stats */}
          <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#FEF3C7"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#F59E0B"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - unlockedCount / totalCount)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-yellow-900">
                        {unlockedCount} / {totalCount}
                      </p>
                      <p className="text-sm text-yellow-700">Achievements Unlocked</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCheckAchievements}
                  disabled={checking}
                  variant="secondary"
                  className="bg-white hover:bg-yellow-50 border-yellow-300"
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Check for New
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              onClick={() => setCategoryFilter('all')}
              variant={categoryFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
            >
              All ({totalCount})
            </Button>
            <Button
              onClick={() => setCategoryFilter('fasting')}
              variant={categoryFilter === 'fasting' ? 'primary' : 'outline'}
              size="sm"
            >
              Fasting ({categoryStats.fasting})
            </Button>
            <Button
              onClick={() => setCategoryFilter('weight_loss')}
              variant={categoryFilter === 'weight_loss' ? 'primary' : 'outline'}
              size="sm"
            >
              Weight Loss ({categoryStats.weight_loss})
            </Button>
            <Button
              onClick={() => setCategoryFilter('consistency')}
              variant={categoryFilter === 'consistency' ? 'primary' : 'outline'}
              size="sm"
            >
              Consistency ({categoryStats.consistency})
            </Button>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlockedAt}
                progress={achievement.progress}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No achievements in this category yet</p>
              </CardContent>
            </Card>
          )}
        </AppPageLayout>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
