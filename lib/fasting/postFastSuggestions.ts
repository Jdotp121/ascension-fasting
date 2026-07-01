// Post-fast guidance content
//
// IMPORTANT: This content is intentionally written as general, non-medical
// suggestions. Please keep the wording soft ("consider", "may want to",
// "if tolerated") and avoid definitive medical claims when editing this file.
// See the disclaimer text below for the required framing.

import { Droplet, Soup, Milk, Apple, Egg, Salad, Utensils, LucideIcon } from 'lucide-react'

export type FastDurationCategory = 'short' | 'moderate' | 'extended'

export interface PostFastCategoryContent {
  readonly id: FastDurationCategory
  readonly title: string
  readonly rangeLabel: string
  readonly suggestions: readonly string[]
}

export const POST_FAST_CATEGORIES: Record<FastDurationCategory, PostFastCategoryContent> = {
  short: {
    id: 'short',
    title: 'After a Short Fast',
    rangeLabel: 'Under 24 hours',
    suggestions: [
      'Ease back into eating if you feel sensitive.',
      'Hydrate well.',
      'Avoid immediately overeating.',
      'Choose a balanced first meal if possible.',
      'Listen to your body.',
    ],
  },
  moderate: {
    id: 'moderate',
    title: 'After a Longer Fast',
    rangeLabel: '24–72 hours',
    suggestions: [
      'Start with smaller portions.',
      'Consider gentle foods such as broth, soup, yogurt, fruit, eggs, or soft meals if tolerated.',
      'Eat slowly and give your body time to respond.',
      'Avoid very heavy, greasy, or highly processed meals immediately after fasting.',
      'Continue hydrating.',
    ],
  },
  extended: {
    id: 'extended',
    title: 'After an Extended Fast',
    rangeLabel: 'Over 72 hours',
    suggestions: [
      'Be more cautious when reintroducing food.',
      'Start with very small portions.',
      'Consider light options such as broth, soup, soft foods, or easy-to-digest meals if tolerated.',
      'Avoid jumping straight into large or heavy meals.',
      'Consider speaking with a healthcare professional before and after extended fasting.',
    ],
  },
}

export const CATEGORY_ORDER: readonly FastDurationCategory[] = ['short', 'moderate', 'extended']

/**
 * Determine which general suggestion category applies to a completed fast
 * duration. Returns null if the duration is unknown/unavailable, in which
 * case the page should show all categories.
 */
export function getPostFastCategory(durationHours: number | null): FastDurationCategory | null {
  if (durationHours === null || Number.isNaN(durationHours) || durationHours < 0) {
    return null
  }
  if (durationHours < 24) return 'short'
  if (durationHours <= 72) return 'moderate'
  return 'extended'
}

export const POST_FAST_DISCLAIMER =
  'Ascension Fasting provides general tracking and educational information only. This is not medical advice. Fasting may not be suitable for everyone. Please consult a qualified healthcare professional before beginning or ending an extended fast, especially if you have a medical condition, are pregnant, under 18, have a history of disordered eating, or take medication.'

export interface GentleFirstFood {
  readonly label: string
  readonly icon: LucideIcon
}

export const GENTLE_FIRST_FOODS: readonly GentleFirstFood[] = [
  { label: 'Bone broth or light broth', icon: Droplet },
  { label: 'Soup', icon: Soup },
  { label: 'Yogurt', icon: Milk },
  { label: 'Watermelon or soft fruit', icon: Apple },
  { label: 'Eggs', icon: Egg },
  { label: 'Soft cooked vegetables', icon: Salad },
  { label: 'Small balanced meal', icon: Utensils },
]

export const FIRST_FOODS_NOTE =
  'Choose foods that suit your body, preferences, and dietary needs. Start small and see how you feel.'

export const GO_EASY_TIPS: readonly string[] = [
  'Start with smaller portions.',
  'Eat slowly.',
  'Hydrate.',
  'Avoid rushing into a very large meal.',
  'Pay attention to how your body responds.',
]
