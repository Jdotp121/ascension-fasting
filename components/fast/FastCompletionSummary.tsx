'use client'

import Link from 'next/link'
import { Fast } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDuration } from '@/lib/fasting/bodyStages'
import { CheckCircle2, Sparkles, RotateCcw } from 'lucide-react'

interface FastCompletionSummaryProps {
  readonly fast: Fast
  readonly onStartNewFast: () => void
}

function getFastTypeName(type: string): string {
  switch (type) {
    case 'water':
      return 'Water Fast'
    case 'juice':
      return 'Juice Fast'
    case 'intermittent':
      return 'Intermittent Fast'
    default:
      return type
  }
}

/**
 * Shown immediately after a user ends/completes a fast.
 * Provides a quick summary plus a link into the Post-Fast Suggestions page.
 */
export function FastCompletionSummary({ fast, onStartNewFast }: FastCompletionSummaryProps) {
  const durationHours = fast.duration_hours ?? 0

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardContent className="py-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Fast Complete!</h2>
          <p className="text-gray-600 mb-6">
            Great job completing your {getFastTypeName(fast.fast_type)}.
          </p>

          <div className="inline-flex flex-col items-center bg-white rounded-lg shadow-sm px-6 py-4">
            <span className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Total Duration
            </span>
            <span className="text-3xl font-bold text-gray-900">
              {formatDuration(durationHours)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            What&apos;s Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Curious about easing back into eating? We have some general, non-medical
            suggestions to consider based on how long you fasted.
          </p>
          <Link
            href={`/post-fast?duration=${encodeURIComponent(durationHours.toString())}`}
          >
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              View Post-Fast Suggestions
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={onStartNewFast}
      >
        <RotateCcw className="w-4 h-4" />
        Start a New Fast
      </Button>
    </div>
  )
}
