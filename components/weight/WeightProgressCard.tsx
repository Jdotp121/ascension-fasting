'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { TrendingDown, Target, Scale, Award } from 'lucide-react'

interface WeightProgressCardProps {
  readonly startingWeight: number | null
  readonly currentWeight: number | null
  readonly goalWeight: number | null
}

export function WeightProgressCard({ startingWeight, currentWeight, goalWeight }: WeightProgressCardProps) {
  // Calculate stats
  const totalLost = startingWeight && currentWeight ? startingWeight - currentWeight : null
  const remaining = currentWeight && goalWeight ? currentWeight - goalWeight : null
  const totalToLose = startingWeight && goalWeight ? startingWeight - goalWeight : null
  const progressPercentage = totalLost && totalToLose && totalToLose > 0 
    ? Math.min(100, Math.max(0, (totalLost / totalToLose) * 100))
    : 0

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Starting Weight */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Scale className="w-4 h-4" />
              <span className="text-sm font-medium">Starting</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {startingWeight ? `${startingWeight.toFixed(1)} kg` : 'N/A'}
            </p>
          </div>

          {/* Current Weight */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Scale className="w-4 h-4" />
              <span className="text-sm font-medium">Current</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {currentWeight ? `${currentWeight.toFixed(1)} kg` : 'N/A'}
            </p>
          </div>

          {/* Goal Weight */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Goal</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {goalWeight ? `${goalWeight.toFixed(1)} kg` : 'N/A'}
            </p>
          </div>

          {/* Weight Lost */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">Lost</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {totalLost !== null && totalLost > 0 ? `${totalLost.toFixed(1)} kg` : '0 kg'}
            </p>
          </div>
        </div>

        {/* Remaining to Goal */}
        {remaining !== null && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Remaining to Goal</span>
              <span className="text-lg font-bold text-gray-900">
                {remaining > 0 ? `${remaining.toFixed(1)} kg` : 'Goal Reached! 🎉'}
              </span>
            </div>
            
            {/* Progress Bar */}
            {totalToLose !== null && totalToLose > 0 && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {Math.min(100, Math.max(0, progressPercentage)).toFixed(0)}% to goal
                </p>
              </div>
            )}
          </div>
        )}

        {/* Motivational Message */}
        {totalLost !== null && totalLost > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm text-green-800 font-medium">
              🎉 You've lost {totalLost.toFixed(1)} kg! Keep up the great work!
            </p>
          </div>
        )}

        {totalLost === 0 && startingWeight !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-800 font-medium">
              🚀 Start your journey! Log your weight regularly to track progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
