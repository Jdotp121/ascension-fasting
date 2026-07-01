'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PostFastSuggestions } from '@/components/fast/PostFastSuggestions'
import { useFastHistory } from '@/hooks/useFastHistory'
import { Loader2, Sparkles } from 'lucide-react'

/**
 * Determines the duration (in hours) to use for the Post-Fast Suggestions page.
 *
 * Priority:
 * 1. `?duration=<hours>` query parameter (passed from the fast completion flow)
 * 2. The most recently completed fast from Supabase
 * 3. null (page falls back to showing all general suggestion categories)
 */
function PostFastContent() {
  const searchParams = useSearchParams()
  const { fasts, loading } = useFastHistory()

  const durationParam = searchParams.get('duration')
  const parsedDuration = durationParam === null ? null : Number.parseFloat(durationParam)
  const hasValidQueryDuration =
    parsedDuration !== null && !Number.isNaN(parsedDuration) && parsedDuration >= 0

  // Fall back to the most recently completed fast if no valid query param was provided
  const latestCompletedDuration = fasts.length > 0 ? fasts[0].duration_hours : null

  const durationHours = hasValidQueryDuration ? parsedDuration : latestCompletedDuration

  // Only show a loading spinner while we're waiting on history AND have no query duration to use
  if (loading && !hasValidQueryDuration) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return <PostFastSuggestions durationHours={durationHours} />
}

export default function PostFastPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <AppPageLayout
          title="Post-Fast Suggestions"
          subtitle="General, non-medical ideas for easing back into eating"
          icon={<Sparkles className="w-7 h-7 text-purple-600" />}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            }
          >
            <PostFastContent />
          </Suspense>
        </AppPageLayout>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
