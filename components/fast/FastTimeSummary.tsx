'use client'

import { Fast } from '@/types'
import { Calendar, Flag, TrendingUp, Clock } from 'lucide-react'
import { calculateFastProgress, formatDateTime } from '@/lib/fasting/timeCalculations'
import { getCurrentBodyStage, getNextBodyStage, formatDuration } from '@/lib/fasting/bodyStages'

interface FastTimeSummaryProps {
  readonly fast: Fast
  readonly currentTime: Date
}

/**
 * Compact details row shown below the hero timer: start/end times, overall
 * progress percentage, and either time-to-next-stage or the current stage
 * name (whichever is more useful).
 */
export function FastTimeSummary({ fast, currentTime }: FastTimeSummaryProps) {
  const progress = calculateFastProgress(fast, currentTime)
  const currentStage = getCurrentBodyStage(progress.elapsedHours)
  const nextStage = getNextBodyStage(progress.elapsedHours)

  const items = [
    {
      icon: Calendar,
      label: 'Started',
      value: formatDateTime(progress.startTime),
    },
    {
      icon: Flag,
      label: progress.isOverdue ? 'Goal was' : 'Ends',
      value: formatDateTime(progress.plannedEndTime),
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: `${Math.round(progress.percentage)}%`,
    },
    {
      icon: Clock,
      label: nextStage ? 'Next stage in' : 'Current stage',
      value: nextStage
        ? formatDuration(Math.max(0, nextStage.minHours - progress.elapsedHours))
        : currentStage.name,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 min-w-0"
          >
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] font-medium uppercase tracking-wide truncate">
                {item.label}
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}
