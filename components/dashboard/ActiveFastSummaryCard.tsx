'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fast } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CircularProgressRing } from '@/components/fast/CircularProgressRing'
import { IntermittentWindowRing } from '@/components/fast/IntermittentWindowRing'
import { FastingStageChip } from '@/components/fast/FastingStageChip'
import {
  calculateFastProgress,
  calculateIntermittentWindow,
  getFastTypeLabel,
  getIntermittentPresetLabel,
  formatHoursMinutes,
  formatClockTime,
  formatDateTime,
} from '@/lib/fasting/timeCalculations'
import { getCurrentBodyStage, getStageColorInfo } from '@/lib/fasting/bodyStages'
import { Timer, Sparkles } from 'lucide-react'

interface ActiveFastSummaryCardProps {
  readonly fast: Fast | null
}

const RING_SIZE = 140
const RING_STROKE = 12

/**
 * Compact "at a glance" active-fast card for the Dashboard.
 *
 * Reuses the same pure calculation helpers and ring/chip components as the
 * full Fast page timer (FastingHeroTimer), just laid out more compactly and
 * without the extended stage timeline / benefits list. Ticks client-side
 * only (setInterval → setState) - no extra Supabase calls happen here.
 */
export function ActiveFastSummaryCard({ fast }: ActiveFastSummaryCardProps) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Single interval drives every derived value on this card - no extra
  // Supabase calls happen here, just client-side date math each tick.
  useEffect(() => {
    if (!fast) return

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [fast])

  // No active fast - friendly CTA state.
  if (!fast) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-gray-400" />
            No Active Fast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Start your next fast and track your progress here.
          </p>
          <Button onClick={() => router.push('/fast')} variant="primary">
            Start Fast
          </Button>
        </CardContent>
      </Card>
    )
  }

  const progress = calculateFastProgress(fast, currentTime)
  const currentStage = getCurrentBodyStage(progress.elapsedHours)
  const stageColors = getStageColorInfo(currentStage.color)
  const fastTypeLabel = getFastTypeLabel(fast.fast_type)
  const isIntermittent = fast.fast_type === 'intermittent'

  if (!progress.hasValidDates) {
    return (
      <Card className="mb-6 border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-blue-600" />
            Active Fast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load your fast timings. Try refreshing, or open the full timer.
          </p>
          <Button onClick={() => router.push('/fast')} variant="primary">
            View Fast
          </Button>
        </CardContent>
      </Card>
    )
  }

  const intermittentWindow = isIntermittent ? calculateIntermittentWindow(fast, currentTime) : null

  const subtitle = isIntermittent
    ? getIntermittentPresetLabel(progress.plannedDurationHours)
    : progress.plannedDurationHours > 0
      ? `${formatHoursMinutes(progress.plannedDurationHours)} goal`
      : null

  return (
    <Card className="mb-6 border border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="w-6 h-6 text-blue-600" />
          Active Fast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Compact ring - centered on mobile, right-aligned on desktop */}
          <div className="order-1 sm:order-2 flex-shrink-0">
            {intermittentWindow ? (
              <IntermittentWindowRing window={intermittentWindow} size={RING_SIZE} strokeWidth={RING_STROKE}>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${
                    intermittentWindow.isFastingPhase ? 'text-blue-600' : 'text-amber-600'
                  }`}
                >
                  {intermittentWindow.isFastingPhase ? 'Fasting Now' : 'Eating Window'}
                </span>
                <span className="text-base font-bold text-gray-900 mt-0.5 font-mono whitespace-nowrap">
                  {formatHoursMinutes(intermittentWindow.currentPhaseRemainingHours)}
                </span>
                <span className="text-[10px] text-gray-500">remaining</span>
              </IntermittentWindowRing>
            ) : (
              <CircularProgressRing
                percentage={progress.percentage}
                size={RING_SIZE}
                strokeWidth={RING_STROKE}
                progressColorFrom={stageColors.hex}
                progressColorTo="#8b5cf6"
              >
                {progress.isOverdue ? (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Goal Reached
                    </span>
                    <span className="text-sm font-bold text-gray-900 mt-1 font-mono whitespace-nowrap">
                      +{formatHoursMinutes(Math.abs(progress.remainingHours))}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5">over target</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Remaining</span>
                    <span className="text-sm font-bold text-gray-900 mt-1 font-mono whitespace-nowrap">
                      {formatHoursMinutes(progress.remainingHours)}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      {Math.round(progress.percentage)}% complete
                    </span>
                  </>
                )}
              </CircularProgressRing>
            )}
          </div>

          {/* Text summary */}
          <div className="flex-1 w-full min-w-0 order-2 sm:order-1 text-center sm:text-left">
            <p className="text-base font-semibold text-gray-900">
              {fastTypeLabel}
              {subtitle && <span className="text-gray-500 font-normal"> • {subtitle}</span>}
            </p>

            <div className="mt-2 flex justify-center sm:justify-start">
              <FastingStageChip stageName={currentStage.name} color={currentStage.color} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Started</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {formatDateTime(progress.startTime)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  {isIntermittent ? 'Next switch' : progress.isOverdue ? 'Goal was' : 'Ends'}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {isIntermittent
                    ? formatClockTime(intermittentWindow?.nextTransition ?? null)
                    : formatDateTime(progress.plannedEndTime)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Elapsed</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {formatHoursMinutes(progress.elapsedHours)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Progress</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {Math.round(progress.percentage)}%
                </p>
              </div>
            </div>

            <Button
              onClick={() => router.push('/fast')}
              variant="primary"
              className="w-full sm:w-auto mt-5"
            >
              View Full Timer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
