'use client'

import { useId } from 'react'
import type { ReactNode } from 'react'
import type { IntermittentWindowInfo } from '@/lib/fasting/timeCalculations'

interface IntermittentWindowRingProps {
  readonly window: IntermittentWindowInfo
  readonly size?: number
  readonly strokeWidth?: number
  readonly children?: ReactNode
}

/**
 * 24-hour ring visualising an intermittent fasting cycle: a fasting arc and
 * an eating arc, plus a marker showing where "now" sits in that cycle.
 *
 * This infers the window from the fast's planned duration (see
 * calculateIntermittentWindow) rather than a dedicated eating-window data
 * model. The component structure intentionally accepts a pre-computed
 * IntermittentWindowInfo so it can be swapped for real window data later
 * without changing this component.
 */
export function IntermittentWindowRing({
  window,
  size = 280,
  strokeWidth = 18,
  children,
}: IntermittentWindowRingProps) {
  const gradientId = useId()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const fastFraction =
    window.cycleHours > 0 ? Math.min(1, Math.max(0, window.fastHours / window.cycleHours)) : 0
  const fastArcLength = circumference * fastFraction

  const markerFraction =
    window.cycleHours > 0
      ? Math.min(1, Math.max(0, window.elapsedInCycleHours / window.cycleHours))
      : 0
  const markerAngleRad = markerFraction * 2 * Math.PI
  const markerX = center + radius * Math.cos(markerAngleRad)
  const markerY = center + radius * Math.sin(markerAngleRad)

  return (
    <div
      className="relative mx-auto max-w-full"
      style={{ width: size, height: size, maxWidth: '100%' }}
      role="img"
      aria-label="24-hour fasting and eating window"
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="-rotate-90 block">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Eating window (full background arc) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#fde68a"
          strokeWidth={strokeWidth}
        />

        {/* Fasting window (foreground arc, drawn from the 12 o'clock start) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${fastArcLength} ${Math.max(0, circumference - fastArcLength)}`}
          style={{ transition: 'stroke-dasharray 1s ease-out' }}
        />

        {/* Current time marker */}
        <circle
          cx={markerX}
          cy={markerY}
          r={Math.max(4, strokeWidth * 0.4)}
          fill="#ffffff"
          stroke="#111827"
          strokeWidth={2}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-3 max-w-[75%]">
          {children}
        </div>
      </div>
    </div>
  )
}
