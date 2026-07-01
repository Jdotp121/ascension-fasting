'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingDown, TrendingUp, Target, Scale, Award, Settings, AlertCircle } from 'lucide-react'
import {
  calculateProgressMetrics,
  getMotivationalInsight,
  formatWeight,
  ProgressMetrics,
} from '@/lib/utils/progressCalculations'

interface WeightProgressCardProps {
  readonly startingWeight: number | null
  readonly currentWeight: number | null
  readonly goalWeight: number | null
}

/**
 * Empty state shown when there's no valid weight data yet.
 */
function EmptyProgressState({ insight }: { readonly insight: string }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Weight Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-4">{insight}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Prompt shown when the user has weight data but hasn't set a goal.
 */
function GoalPromptState({ insight }: { readonly insight: string }) {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6 text-amber-600" />
          Set Your Goal Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">{insight}</p>
              <p className="text-sm text-gray-600 mb-3">
                Set a goal weight in your Profile under Health Goals to see your progress visualization and track how close you are to reaching your target.
              </p>
              <Link href="/profile">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Set Goal Weight
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 2x2 stats grid: Start, Current, Goal, and Lost/Gained.
 */
function StatsGrid({
  metrics,
  progressColor,
}: {
  readonly metrics: ProgressMetrics
  readonly progressColor: string
}) {
  const ProgressIcon = metrics.isGaining ? TrendingUp : TrendingDown

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Starting Weight */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 text-gray-600 mb-1.5">
          <Scale className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium">Start</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {formatWeight(metrics.startWeight)}
        </p>
      </div>

      {/* Current Weight */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
        <div className="flex items-center gap-2 text-blue-600 mb-1.5">
          <Scale className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium">Current</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-blue-900">
          {formatWeight(metrics.currentWeight)}
        </p>
      </div>

      {/* Goal Weight */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
        <div className="flex items-center gap-2 text-green-600 mb-1.5">
          <Target className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium">Goal</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-green-900">
          {formatWeight(metrics.goalWeight)}
        </p>
      </div>

      {/* Weight Change (Lost or Gained) */}
      <div className={`bg-white rounded-xl p-4 shadow-sm border border-${progressColor}-100`}>
        <div className={`flex items-center gap-2 text-${progressColor}-600 mb-1.5`}>
          <ProgressIcon className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium">
            {metrics.isGaining ? 'Gained' : 'Lost'}
          </span>
        </div>
        <p className={`text-xl sm:text-2xl font-bold text-${progressColor}-900`}>
          {formatWeight(Math.abs(metrics.weightLost))}
        </p>
      </div>
    </div>
  )
}

/**
 * Progress bar section with remaining-to-goal, bar, and summary stats.
 */
function ProgressSection({
  metrics,
  progressColor,
}: {
  readonly metrics: ProgressMetrics
  readonly progressColor: string
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
      {/* Remaining to Goal */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {metrics.hasReachedGoal ? 'Goal Status' : 'Remaining to Goal'}
        </span>
        <span
          className={`text-lg sm:text-xl font-bold ${
            metrics.hasReachedGoal ? 'text-green-600' : 'text-gray-900'
          }`}
        >
          {metrics.hasReachedGoal
            ? '🎉 Reached!'
            : formatWeight(Math.abs(metrics.weightRemaining))}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-700 ease-out ${
              metrics.hasReachedGoal
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500'
            }`}
            style={{ width: `${metrics.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">0%</span>
          <span
            className={`text-sm font-bold ${
              metrics.hasReachedGoal ? 'text-green-600' : 'text-purple-600'
            }`}
          >
            {metrics.progressPercentage.toFixed(0)}% Complete
          </span>
          <span className="text-xs text-gray-500">100%</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Progress</p>
          <p className={`text-base sm:text-lg font-bold text-${progressColor}-600`}>
            {formatWeight(Math.abs(metrics.weightLost))}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">To Target</p>
          <p
            className={`text-base sm:text-lg font-bold ${
              metrics.hasReachedGoal ? 'text-green-600' : 'text-gray-700'
            }`}
          >
            {metrics.hasReachedGoal ? '0 kg' : formatWeight(Math.abs(metrics.totalWeightToLose))}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Determines the insight banner's color classes based on progress state.
 */
function getInsightBannerClasses(metrics: ProgressMetrics): { container: string; text: string } {
  if (metrics.hasReachedGoal) {
    return { container: 'bg-green-50 border-green-200', text: 'text-green-900' }
  }
  if (metrics.progressPercentage >= 30) {
    return { container: 'bg-blue-50 border-blue-200', text: 'text-blue-900' }
  }
  return { container: 'bg-purple-50 border-purple-200', text: 'text-purple-900' }
}

function InsightBanner({
  metrics,
  insight,
}: {
  readonly metrics: ProgressMetrics
  readonly insight: string
}) {
  const { container, text } = getInsightBannerClasses(metrics)

  return (
    <div className={`rounded-lg p-4 border-2 ${container}`}>
      <p className={`text-sm font-medium text-center ${text}`}>{insight}</p>
    </div>
  )
}

/**
 * Main progress card shown once the user has valid weight data and a goal.
 */
function MainProgressCard({
  metrics,
  insight,
}: {
  readonly metrics: ProgressMetrics
  readonly insight: string
}) {
  const progressColor = metrics.hasReachedGoal ? 'green' : 'purple'
  const gradientFrom = metrics.hasReachedGoal ? 'from-green-50' : 'from-purple-50'
  const gradientTo = metrics.hasReachedGoal ? 'to-emerald-50' : 'to-blue-50'
  const borderColor = metrics.hasReachedGoal ? 'border-green-300' : 'border-purple-200'

  return (
    <Card className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} border-2 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className={`w-6 h-6 text-${progressColor}-600`} />
          Weight Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatsGrid metrics={metrics} progressColor={progressColor} />
        <ProgressSection metrics={metrics} progressColor={progressColor} />
        <InsightBanner metrics={metrics} insight={insight} />
      </CardContent>
    </Card>
  )
}

export function WeightProgressCard({ startingWeight, currentWeight, goalWeight }: WeightProgressCardProps) {
  // Calculate all metrics using the utility function
  const metrics = calculateProgressMetrics(startingWeight, currentWeight, goalWeight)
  const insight = getMotivationalInsight(metrics)

  if (!metrics.hasValidData) {
    return <EmptyProgressState insight={insight} />
  }

  if (!metrics.hasGoal) {
    return <GoalPromptState insight={insight} />
  }

  return <MainProgressCard metrics={metrics} insight={insight} />
}
