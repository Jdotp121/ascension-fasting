'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  ShieldAlert,
  CircleCheck,
  Sparkles,
  Sun,
  ArrowLeft,
} from 'lucide-react'
import {
  POST_FAST_CATEGORIES,
  CATEGORY_ORDER,
  POST_FAST_DISCLAIMER,
  GENTLE_FIRST_FOODS,
  FIRST_FOODS_NOTE,
  GO_EASY_TIPS,
  getPostFastCategory,
  type PostFastCategoryContent,
} from '@/lib/fasting/postFastSuggestions'

interface PostFastSuggestionsProps {
  /** Duration of the completed fast in hours, if known. */
  readonly durationHours: number | null
}

/**
 * Formats a duration in hours into a friendly "Xh Ym" style label.
 */
function formatDurationLabel(hours: number): string {
  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function DisclaimerCard() {
  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <CardContent className="flex items-start gap-3 py-2">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900 mb-1">Important</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            {POST_FAST_DISCLAIMER}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function SuggestionCategoryCard({
  category,
  highlighted,
}: {
  readonly category: PostFastCategoryContent
  readonly highlighted: boolean
}) {
  return (
    <Card
      className={
        highlighted
          ? 'border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50'
          : 'border border-gray-200'
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{category.title}</span>
          <span className="text-xs font-normal text-gray-500 whitespace-nowrap">
            {category.rangeLabel}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {category.suggestions.map((suggestion) => (
            <li key={suggestion} className="flex items-start gap-2 text-sm text-gray-700">
              <CircleCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function GentleFirstFoodsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Gentle First Foods to Consider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GENTLE_FIRST_FOODS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3"
            >
              <Icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <span className="text-sm text-gray-800">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {FIRST_FOODS_NOTE}
        </p>
      </CardContent>
    </Card>
  )
}

function GoEasySection() {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Sun className="w-5 h-5 text-green-600" />
          Go Easy at First
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {GO_EASY_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-green-900">
              <CircleCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function PostFastSuggestions({ durationHours }: PostFastSuggestionsProps) {
  const matchedCategory = getPostFastCategory(durationHours)

  return (
    <div className="space-y-6">
      <DisclaimerCard />

      {/* Duration summary / heads-up when duration is unknown */}
      {durationHours === null ? (
        <p className="text-sm text-gray-600">
          We could not determine your fast duration, so here are general suggestions
          for every fast length. Choose the section that best matches your recent fast.
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Based on your completed fast of{' '}
          <span className="font-semibold text-gray-900">
            {formatDurationLabel(durationHours)}
          </span>, here are some general suggestions to consider as you ease back into eating.
        </p>
      )}

      {/* Suggestion categories */}
      <div className="space-y-4">
        {matchedCategory ? (
          <SuggestionCategoryCard
            category={POST_FAST_CATEGORIES[matchedCategory]}
            highlighted
          />
        ) : (
          CATEGORY_ORDER.map((id) => (
            <SuggestionCategoryCard
              key={id}
              category={POST_FAST_CATEGORIES[id]}
              highlighted={false}
            />
          ))
        )}
      </div>

      <GentleFirstFoodsSection />
      <GoEasySection />

      <div className="pt-2">
        <Link
          href="/fast"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fasting
        </Link>
      </div>
    </div>
  )
}
