'use client'

import { useState, useEffect } from 'react'
import { Fast } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FastingHeroTimer } from './FastingHeroTimer'
import { FastTimeSummary } from './FastTimeSummary'
import {
  getCurrentBodyStage,
  getNextBodyStage,
  formatDuration,
  formatDetailedDuration,
  getStageColorInfo,
  BODY_STAGES,
} from '@/lib/fasting/bodyStages'
import {
  calculateFastProgress,
  getFastTypeLabel,
  getIntermittentPresetLabel,
} from '@/lib/fasting/timeCalculations'
import { TrendingUp, AlertCircle, StopCircle } from 'lucide-react'

interface ActiveFastTimerProps {
  readonly fast: Fast
  readonly onEndFast: () => void
}

export function ActiveFastTimer({ fast, onEndFast }: ActiveFastTimerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showEndDialog, setShowEndDialog] = useState(false)

  // Single interval drives every derived value on this screen - no extra
  // Supabase calls happen here, just client-side date math each tick.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const progress = calculateFastProgress(fast, currentTime)
  const currentStage = getCurrentBodyStage(progress.elapsedHours)
  const nextStage = getNextBodyStage(progress.elapsedHours)
  const stageColors = getStageColorInfo(currentStage.color)
  const fastTypeLabel = getFastTypeLabel(fast.fast_type)

  let subtitle: string
  if (fast.fast_type === 'intermittent') {
    subtitle = `Intermittent Fast • ${getIntermittentPresetLabel(progress.plannedDurationHours)}`
  } else {
    const goalSuffix =
      progress.plannedDurationHours > 0
        ? ` • ${formatDuration(progress.plannedDurationHours)} goal`
        : ''
    subtitle = `${fastTypeLabel}${goalSuffix}`
  }

  return (
    <div className="space-y-6">
      {/* Top section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">You&apos;re Fasting</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
      </div>

      {/* Hero Timer */}
      <FastingHeroTimer fast={fast} currentTime={currentTime} />

      {/* Details Summary */}
      <FastTimeSummary fast={fast} currentTime={currentTime} />

      {/* End Fast Button */}
      <Button
        variant="danger"
        size="lg"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setShowEndDialog(true)}
      >
        <StopCircle className="w-5 h-5" />
        End Fast
      </Button>

      {/* What's Happening Now */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            What&apos;s Happening Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{currentStage.name}</h3>
              <span className="text-sm text-gray-500">{formatDuration(progress.elapsedHours)}</span>
            </div>
            <p className="text-gray-600">{currentStage.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Current Benefits:</h4>
            <ul className="space-y-1">
              {currentStage.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start text-sm text-gray-600">
                  <span className="mr-2" style={{ color: stageColors.hex }}>✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage */}
      {nextStage && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-5 h-5" />
              Next Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{nextStage.name}</h3>
                <p className="text-sm text-gray-600">{nextStage.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">In</p>
                <p className="font-semibold text-gray-900">
                  {formatDuration(Math.max(0, nextStage.minHours - progress.elapsedHours))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Stages Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Fasting Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BODY_STAGES.map((stage) => {
              const isPast = progress.elapsedHours >= stage.minHours
              const isCurrent = currentStage.name === stage.name

              // Extract nested ternary into separate variables for better readability
              let containerClasses = 'flex items-center gap-3 p-3 rounded-lg transition-colors '
              if (isCurrent) {
                containerClasses += 'bg-blue-50 border-2 border-blue-500'
              } else if (isPast) {
                containerClasses += 'bg-gray-50'
              } else {
                containerClasses += 'bg-white border border-gray-200'
              }

              let dotClasses = 'w-3 h-3 rounded-full '
              if (isCurrent) {
                dotClasses += 'bg-blue-500 animate-pulse'
              } else if (isPast) {
                dotClasses += 'bg-green-500'
              } else {
                dotClasses += 'bg-gray-300'
              }

              return (
                <div key={stage.name} className={containerClasses}>
                  <div className={dotClasses} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                        {stage.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {stage.minHours}h{stage.maxHours ? ` - ${stage.maxHours}h` : '+'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* End Fast Confirmation Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>End Fast?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You&apos;ve been fasting for {formatDuration(progress.elapsedHours)}. Are you sure you want to end your fast?
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Current Stage:</strong> {currentStage.name}
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  <strong>Duration:</strong> {formatDetailedDuration(progress.elapsedHours)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEndDialog(false)}
                >
                  Continue Fasting
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setShowEndDialog(false)
                    onEndFast()
                  }}
                >
                  End Fast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
