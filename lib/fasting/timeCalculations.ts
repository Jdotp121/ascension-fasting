// Pure calculation helpers for the fasting timer UI.
// Kept separate from components so the circular ring / hero timer can stay
// focused on rendering while all date-math + clamping logic lives here.

import { Fast, FastType } from '@/types'

export const MS_PER_HOUR = 1000 * 60 * 60
export const HOURS_PER_DAY = 24

/** Clamp a number between min/max, guarding against NaN/Infinity. */
export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

/** Convert milliseconds to hours, guarding against NaN/Infinity. */
export function safeHours(ms: number): number {
  if (!Number.isFinite(ms)) return 0
  return ms / MS_PER_HOUR
}

export interface FastProgress {
  readonly startTime: Date | null
  readonly plannedEndTime: Date | null
  readonly elapsedHours: number
  readonly remainingHours: number
  readonly plannedDurationHours: number
  /** 0-100, always clamped */
  readonly percentage: number
  readonly isOverdue: boolean
  readonly hasValidDates: boolean
}

/**
 * Calculates elapsed/remaining time + percentage for an active fast.
 * Safe against missing/invalid dates - never returns NaN/Infinity/negative progress.
 */
export function calculateFastProgress(fast: Fast | null | undefined, now: Date): FastProgress {
  const rawStart = fast?.start_time ? new Date(fast.start_time) : null
  const rawEnd = fast?.planned_end_time ? new Date(fast.planned_end_time) : null

  const startTime = rawStart && !Number.isNaN(rawStart.getTime()) ? rawStart : null
  const plannedEndTime = rawEnd && !Number.isNaN(rawEnd.getTime()) ? rawEnd : null

  const hasValidDates =
    !!startTime && !!plannedEndTime && plannedEndTime.getTime() > startTime.getTime()

  if (!hasValidDates || !startTime || !plannedEndTime) {
    return {
      startTime,
      plannedEndTime,
      elapsedHours: 0,
      remainingHours: 0,
      plannedDurationHours: 0,
      percentage: 0,
      isOverdue: false,
      hasValidDates: false,
    }
  }

  const elapsedMs = now.getTime() - startTime.getTime()
  const plannedDurationMs = plannedEndTime.getTime() - startTime.getTime()

  const elapsedHours = Math.max(0, safeHours(elapsedMs))
  const plannedDurationHours = Math.max(0, safeHours(plannedDurationMs))
  const remainingHours = plannedDurationHours - elapsedHours

  const percentage =
    plannedDurationHours > 0
      ? clampNumber((elapsedHours / plannedDurationHours) * 100, 0, 100)
      : 0

  return {
    startTime,
    plannedEndTime,
    elapsedHours,
    remainingHours,
    plannedDurationHours,
    percentage,
    isOverdue: remainingHours <= 0,
    hasValidDates: true,
  }
}

export interface DurationMilestone {
  readonly hours: number
  readonly label: string
  readonly percent: number
}

const STANDARD_MILESTONE_HOURS = [12, 24, 48, 72]

/**
 * Returns sensible milestone markers for a duration fast ring.
 * - Long fasts (>=24h covering at least two standard markers) use 12/24/48/72h.
 * - Shorter fasts fall back to evenly spaced quarter markers so the ring
 *   never shows markers that don't make sense for the goal duration.
 */
export function getDurationMilestones(plannedDurationHours: number): DurationMilestone[] {
  if (!Number.isFinite(plannedDurationHours) || plannedDurationHours <= 0) return []

  const applicable = STANDARD_MILESTONE_HOURS.filter((h) => h <= plannedDurationHours)

  let hoursList: number[]
  if (applicable.length >= 2) {
    hoursList = applicable
  } else {
    const quarters = [0.25, 0.5, 0.75, 1].map(
      (fraction) => Math.round(plannedDurationHours * fraction * 10) / 10
    )
    hoursList = Array.from(new Set(quarters)).filter((h) => h > 0)
  }

  return hoursList.map((hours) => ({
    hours,
    label: `${hours}h`,
    percent: clampNumber((hours / plannedDurationHours) * 100, 0, 100),
  }))
}

export interface IntermittentWindowInfo {
  readonly fastHours: number
  readonly eatingHours: number
  readonly cycleHours: number
  readonly elapsedInCycleHours: number
  readonly isFastingPhase: boolean
  /** 0-100, percent progress through the current phase (fasting or eating) */
  readonly phasePercent: number
  readonly currentPhaseRemainingHours: number
  readonly nextTransition: Date | null
}

/**
 * Infers a 24-hour fasting/eating cycle from the fast's planned duration.
 * This is a simplified model (no dedicated eating-window schema exists yet):
 * the fasting portion is the selected fast duration (capped at 24h) and the
 * eating portion is whatever remains of the 24h day. Structured so it can be
 * swapped for real eating-window data later without touching the UI.
 */
export function calculateIntermittentWindow(
  fast: Fast | null | undefined,
  now: Date
): IntermittentWindowInfo | null {
  const progress = calculateFastProgress(fast, now)
  if (!progress.hasValidDates || !progress.startTime) return null

  const fastHours = clampNumber(progress.plannedDurationHours, 0, HOURS_PER_DAY)
  const cycleHours = HOURS_PER_DAY
  const eatingHours = Math.max(0, cycleHours - fastHours)

  const elapsedSinceStartHours = safeHours(now.getTime() - progress.startTime.getTime())
  const elapsedInCycleHours =
    ((elapsedSinceStartHours % cycleHours) + cycleHours) % cycleHours

  const isFastingPhase = elapsedInCycleHours < fastHours

  let phasePercent: number
  let currentPhaseRemainingHours: number

  if (isFastingPhase) {
    phasePercent = fastHours > 0 ? clampNumber((elapsedInCycleHours / fastHours) * 100, 0, 100) : 100
    currentPhaseRemainingHours = Math.max(0, fastHours - elapsedInCycleHours)
  } else {
    const elapsedInEating = elapsedInCycleHours - fastHours
    phasePercent = eatingHours > 0 ? clampNumber((elapsedInEating / eatingHours) * 100, 0, 100) : 100
    currentPhaseRemainingHours = Math.max(0, eatingHours - elapsedInEating)
  }

  const nextTransition = new Date(now.getTime() + currentPhaseRemainingHours * MS_PER_HOUR)

  return {
    fastHours,
    eatingHours,
    cycleHours,
    elapsedInCycleHours,
    isFastingPhase,
    phasePercent,
    currentPhaseRemainingHours,
    nextTransition,
  }
}

/** e.g. 16 -> "16:8 Method", 24 -> "OMAD (One Meal a Day)" */
export function getIntermittentPresetLabel(fastHours: number): string {
  if (!Number.isFinite(fastHours) || fastHours <= 0) return 'Intermittent Fast'
  const rounded = Math.round(fastHours)
  if (rounded >= 24) return 'OMAD (One Meal a Day)'
  const eating = Math.max(0, HOURS_PER_DAY - rounded)
  return `${rounded}:${eating} Method`
}

const FAST_TYPE_LABELS: Record<FastType, string> = {
  water: 'Water Fast',
  juice: 'Juice Fast',
  intermittent: 'Intermittent Fast',
}

export function getFastTypeLabel(type: FastType | string): string {
  return FAST_TYPE_LABELS[type as FastType] ?? type
}

export function formatClockTime(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return '—'
  return `${date.toLocaleDateString([], { day: 'numeric', month: 'short' })}, ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

/** e.g. 90 minutes -> "1h 30m", 45 minutes -> "45m" */
export function formatHoursMinutes(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) return '0m'
  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** e.g. 13.5 hours -> "13:30:00" */
export function formatHoursMinutesSeconds(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) return '00:00:00'
  const totalSeconds = Math.round(hours * 3600)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
