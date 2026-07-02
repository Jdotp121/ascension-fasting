'use client'

import { useId } from 'react'
import type { ReactNode } from 'react'

interface RingMilestone {
  /** 0-100 */
  readonly percent: number
}

interface CircularProgressRingProps {
  /** 0-100, will be clamped */
  readonly percentage: number
  readonly size?: number
  readonly strokeWidth?: number
  readonly trackColor?: string
  readonly progressColorFrom?: string
  readonly progressColorTo?: string
  readonly milestones?: readonly RingMilestone[]
  readonly children?: ReactNode
  readonly ariaLabel?: string
}

/**
 * Generic circular progress ring used for duration-based fasts (Water, Juice,
 * custom long fasts). Renders a gradient progress arc over a muted track,
 * optional subtle milestone dots, and arbitrary centred content (timer text,
 * stage chip, etc). Pure presentational component - all math lives in
 * lib/fasting/timeCalculations.ts.
 */
export function CircularProgressRing({
  percentage,
  size = 280,
  strokeWidth = 18,
  trackColor = '#e5e7eb',
  progressColorFrom = '#3b82f6',
  progressColorTo = '#8b5cf6',
  milestones = [],
  children,
  ariaLabel = 'Fasting progress',
}: CircularProgressRingProps) {
  const gradientId = useId()
  const clamped = Number.isFinite(percentage) ? Math.min(100, Math.max(0, percentage)) : 0

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - clamped / 100)
  const center = size / 2

  return (
    <div
      className="relative mx-auto max-w-full"
      style={{ width: size, height: size, maxWidth: '100%' }}
      role="img"
      aria-label={`${ariaLabel}: ${Math.round(clamped)} percent complete`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 block"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColorFrom} />
            <stop offset="100%" stopColor={progressColorTo} />
          </linearGradient>
        </defs>

        {/* Track (remaining) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress (elapsed) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />

        {/* Subtle milestone dots */}
        {milestones.map((milestone) => {
          const percent = Math.min(100, Math.max(0, milestone.percent))
          const angleRad = (percent / 100) * 2 * Math.PI
          const x = center + radius * Math.cos(angleRad)
          const y = center + radius * Math.sin(angleRad)
          const isReached = clamped >= percent

          return (
            <circle
              key={percent}
              cx={x}
              cy={y}
              r={Math.max(3, strokeWidth * 0.22)}
              fill={isReached ? progressColorTo : '#ffffff'}
              stroke={isReached ? progressColorTo : '#9ca3af'}
              strokeWidth={1.5}
            />
          )
        })}
      </svg>

      {/* Centre content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-3 max-w-[75%]">
          {children}
        </div>
      </div>
    </div>
  )
}
