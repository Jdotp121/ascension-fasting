import { LucideIcon, Trophy, Clock, Scale, TrendingDown, Target, Flame, Calendar, Award } from 'lucide-react'

export type AchievementCategory = 'fasting' | 'weight_loss' | 'consistency'

export interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  icon: LucideIcon
  iconColor: string
  checkProgress: (stats: AchievementStats) => { current: number; target: number; unlocked: boolean }
}

export interface AchievementStats {
  completedFasts: number
  fast24h: number
  fast48h: number
  fast72h: number
  weightEntries: number
  weightLost: number
  currentWeight: number | null
  goalWeight: number | null
  daysLogged: number
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  created_at: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // FASTING ACHIEVEMENTS
  {
    id: 'first_fast_completed',
    title: 'First Fast Completed',
    description: 'Complete your first fast',
    category: 'fasting',
    icon: Trophy,
    iconColor: 'text-yellow-600',
    checkProgress: (stats) => ({
      current: stats.completedFasts,
      target: 1,
      unlocked: stats.completedFasts >= 1,
    }),
  },
  {
    id: 'first_24h_fast',
    title: 'First 24 Hour Fast',
    description: 'Complete a fast lasting 24 hours or more',
    category: 'fasting',
    icon: Clock,
    iconColor: 'text-blue-600',
    checkProgress: (stats) => ({
      current: stats.fast24h,
      target: 1,
      unlocked: stats.fast24h >= 1,
    }),
  },
  {
    id: 'first_48h_fast',
    title: 'First 48 Hour Fast',
    description: 'Complete a fast lasting 48 hours or more',
    category: 'fasting',
    icon: Clock,
    iconColor: 'text-indigo-600',
    checkProgress: (stats) => ({
      current: stats.fast48h,
      target: 1,
      unlocked: stats.fast48h >= 1,
    }),
  },
  {
    id: 'first_72h_fast',
    title: 'First 72 Hour Fast',
    description: 'Complete a fast lasting 72 hours or more',
    category: 'fasting',
    icon: Clock,
    iconColor: 'text-purple-600',
    checkProgress: (stats) => ({
      current: stats.fast72h,
      target: 1,
      unlocked: stats.fast72h >= 1,
    }),
  },
  {
    id: 'five_fasts_completed',
    title: '5 Fasts Completed',
    description: 'Complete 5 fasting sessions',
    category: 'fasting',
    icon: Flame,
    iconColor: 'text-orange-600',
    checkProgress: (stats) => ({
      current: stats.completedFasts,
      target: 5,
      unlocked: stats.completedFasts >= 5,
    }),
  },
  {
    id: 'ten_fasts_completed',
    title: '10 Fasts Completed',
    description: 'Complete 10 fasting sessions',
    category: 'fasting',
    icon: Flame,
    iconColor: 'text-red-600',
    checkProgress: (stats) => ({
      current: stats.completedFasts,
      target: 10,
      unlocked: stats.completedFasts >= 10,
    }),
  },
  {
    id: 'twentyfive_fasts_completed',
    title: '25 Fasts Completed',
    description: 'Complete 25 fasting sessions',
    category: 'fasting',
    icon: Award,
    iconColor: 'text-amber-600',
    checkProgress: (stats) => ({
      current: stats.completedFasts,
      target: 25,
      unlocked: stats.completedFasts >= 25,
    }),
  },

  // WEIGHT LOSS ACHIEVEMENTS
  {
    id: 'first_weight_entry',
    title: 'First Weight Entry',
    description: 'Log your first weight measurement',
    category: 'weight_loss',
    icon: Scale,
    iconColor: 'text-green-600',
    checkProgress: (stats) => ({
      current: stats.weightEntries,
      target: 1,
      unlocked: stats.weightEntries >= 1,
    }),
  },
  {
    id: 'lost_1kg',
    title: 'Lost First 1kg',
    description: 'Lose your first kilogram',
    category: 'weight_loss',
    icon: TrendingDown,
    iconColor: 'text-teal-600',
    checkProgress: (stats) => ({
      current: stats.weightLost,
      target: 1,
      unlocked: stats.weightLost >= 1,
    }),
  },
  {
    id: 'lost_5kg',
    title: 'Lost First 5kg',
    description: 'Lose 5 kilograms',
    category: 'weight_loss',
    icon: TrendingDown,
    iconColor: 'text-cyan-600',
    checkProgress: (stats) => ({
      current: stats.weightLost,
      target: 5,
      unlocked: stats.weightLost >= 5,
    }),
  },
  {
    id: 'lost_10kg',
    title: 'Lost First 10kg',
    description: 'Lose 10 kilograms',
    category: 'weight_loss',
    icon: TrendingDown,
    iconColor: 'text-blue-600',
    checkProgress: (stats) => ({
      current: stats.weightLost,
      target: 10,
      unlocked: stats.weightLost >= 10,
    }),
  },
  {
    id: 'reached_goal_weight',
    title: 'Reached Goal Weight',
    description: 'Achieve your target weight',
    category: 'weight_loss',
    icon: Target,
    iconColor: 'text-emerald-600',
    checkProgress: (stats) => ({
      current: stats.currentWeight || 0,
      target: stats.goalWeight || 0,
      unlocked: stats.goalWeight !== null && stats.currentWeight !== null && stats.currentWeight <= stats.goalWeight,
    }),
  },

  // CONSISTENCY ACHIEVEMENTS
  {
    id: 'three_days_logged',
    title: '3 Days Logged',
    description: 'Log data for 3 different days',
    category: 'consistency',
    icon: Calendar,
    iconColor: 'text-pink-600',
    checkProgress: (stats) => ({
      current: stats.daysLogged,
      target: 3,
      unlocked: stats.daysLogged >= 3,
    }),
  },
  {
    id: 'seven_days_logged',
    title: '7 Days Logged',
    description: 'Log data for 7 different days',
    category: 'consistency',
    icon: Calendar,
    iconColor: 'text-rose-600',
    checkProgress: (stats) => ({
      current: stats.daysLogged,
      target: 7,
      unlocked: stats.daysLogged >= 7,
    }),
  },
  {
    id: 'thirty_days_logged',
    title: '30 Days Logged',
    description: 'Log data for 30 different days',
    category: 'consistency',
    icon: Calendar,
    iconColor: 'text-violet-600',
    checkProgress: (stats) => ({
      current: stats.daysLogged,
      target: 30,
      unlocked: stats.daysLogged >= 30,
    }),
  },
]

export const getCategoryName = (category: AchievementCategory): string => {
  switch (category) {
    case 'fasting':
      return 'Fasting'
    case 'weight_loss':
      return 'Weight Loss'
    case 'consistency':
      return 'Consistency'
  }
}

export const getCategoryColor = (category: AchievementCategory): string => {
  switch (category) {
    case 'fasting':
      return 'bg-orange-100 text-orange-800'
    case 'weight_loss':
      return 'bg-blue-100 text-blue-800'
    case 'consistency':
      return 'bg-purple-100 text-purple-800'
  }
}
