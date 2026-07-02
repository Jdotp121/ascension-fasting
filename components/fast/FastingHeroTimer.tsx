'use client'

import { Fast } from '@/types'
import { CircularProgressRing } from './CircularProgressRing'
import { IntermittentWindowRing } from './IntermittentWindowRing'
import { FastingStageChip } from './FastingStageChip'
import {
  calculateFastProgress,
  calculateIntermittentWindow,
  getDurationMilestones,
  getFastTypeLabel,
  formatHoursMinutes,
  formatHoursMinutesSeconds,
  formatClockTime,
} from '@/lib/fasting/timeCalculations'
import { getCurrentBodyStage, getStageColorInfo } from '@/lib/fasting/bodyStages'

interface FastingHeroTimerProps {
  readonly fast: Fast
  readonly currentTime: Date
}

/**
 * The "hero" of the active fast screen. Picks the right visual mode:
 * - Duration mode (water / juice / long custom fasts): a single circular
 *   progress ring with elapsed/remaining time in the centre.
 * - Intermittent mode (16:8, 18:6, 20:4, OMAD): a 24-hour ring showing the
 *   fasting window vs eating window with a moving "now" marker.
 */
export function FastingHeroTimer({ fast, currentTime }: FastingHeroTimerProps) {
  const progress = calculateFastProgress(fast, currentTime)
  const currentStage = getCurrentBodyStage(progress.elapsedHours)
  const stageColors = getStageColorInfo(currentStage.color)
  const fastTypeLabel = getFastTypeLabel(fast.fast_type)
  const isIntermittent = fast.fast_type === 'intermittent'

  if (!progress.hasValidDates) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <p className="text-gray-600">
          We couldn&apos;t load your fast timings. Try refreshing the page.
        </p>
      </div>
    )
  }

  const intermittentWindow = isIntermittent ? calculateIntermittentWindow(fast, currentTime) : null

  if (intermittentWindow) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            {fastTypeLabel}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formatHoursMinutes(intermittentWindow.fastHours)} fasting · {formatHoursMinutes(intermittentWindow.eatingHours)} eating window
          </p>

        </div>

        <IntermittentWindowRing window={intermittentWindow} size={280} strokeWidth={18}>
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              intermittentWindow.isFastingPhase ? 'text-blue-600' : 'text-amber-600'
            }`}
          >
            {intermittentWindow.isFastingPhase ? 'Fasting Now' : 'Eating Window'}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 font-mono whitespace-nowrap">
            {formatHoursMinutes(intermittentWindow.currentPhaseRemainingHours)}
          </span>
          <span className="text-xs text-gray-500 mt-1">left</span>
          <span className="text-xs text-gray-500 mt-3 leading-snug">
            {intermittentWindow.isFastingPhase ? 'Eating window opens at ' : 'Next fast starts at '}
            {formatClockTime(intermittentWindow.nextTransition)}
          </span>
        </IntermittentWindowRing>

        <div className="flex justify-center mt-6">
          <FastingStageChip stageName={currentStage.name} color={currentStage.color} />
        </div>
      </div>
    )
  }

  // Duration fast mode (Water, Juice, long/custom fasts - or a safe fallback
  // for intermittent fasts if window data couldn't be computed).
  const milestones = getDurationMilestones(progress.plannedDurationHours)

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
      <div className="text-center mb-6">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{fastTypeLabel}</p>
        <p className="text-sm text-gray-500 mt-1">
          Goal: {formatHoursMinutes(progress.plannedDurationHours)}
        </p>
      </div>

      <CircularProgressRing
        percentage={progress.percentage}
        size={280}
        strokeWidth={18}
        progressColorFrom={stageColors.hex}
        progressColorTo="#8b5cf6"
        milestones={milestones.map((m) => ({ percent: m.percent }))}
      >
        {progress.isOverdue ? (
          <>
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Goal Reached
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 font-mono whitespace-nowrap">
              +{formatHoursMinutes(Math.abs(progress.remainingHours))}
            </span>
            <span className="text-xs text-gray-500 mt-1">over target</span>
          </>
        ) : (
          <>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Elapsed</span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 font-mono whitespace-nowrap">
              {formatHoursMinutesSeconds(progress.elapsedHours)}
            </span>
            <span className="text-xs text-gray-500 mt-2">
              {formatHoursMinutes(progress.remainingHours)} remaining
            </span>
          </>
        )}
        <div className="mt-3">
          <FastingStageChip stageName={currentStage.name} color={currentStage.color} />
        </div>
      </CircularProgressRing>

      <div className="text-center mt-4">
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(progress.percentage)}% complete
        </span>
      </div>

      {milestones.length > 0 && (
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-3">
          {milestones.map((milestone) => {
            const reached = progress.percentage >= milestone.percent
            return (
              <span
                key={milestone.hours}
                className={`text-[11px] font-medium ${reached ? 'text-gray-700' : 'text-gray-400'}`}
              >
                {reached ? '✓ ' : ''}
                {milestone.label}
              </span>
            )

          })}
        </div>
      )}
    </div>
  )
}
