export type FastType = 'water' | 'juice' | 'intermittent'
export type Sex = 'male' | 'female' | 'other' | 'prefer_not_to_say'
export type MainGoal = 'weight_loss' | 'health' | 'discipline' | 'religious' | 'longevity'

export interface UserProfile {
  id: string
  email: string
  name: string
  age: number | null
  sex: Sex | null
  height_cm: number | null
  current_weight_kg: number | null
  goal_weight_kg: number | null
  main_goal: MainGoal | null
  created_at: string
  updated_at: string
}

export interface Fast {
  id: string
  user_id: string
  fast_type: FastType
  start_time: string
  planned_end_time: string
  actual_end_time: string | null
  duration_hours: number | null
  completed: boolean
  break_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WeightEntry {
  id: string
  user_id: string
  weight_kg: number
  entry_date: string
  notes: string | null
  created_at: string
}

export interface DashboardStats {
  activeFast: Fast | null
  currentWeight: number | null
  goalWeight: number | null
  totalFasts: number
  completedFasts: number
  longestFastHours: number | null
  weightLost: number | null
  recentWeightEntries: WeightEntry[]
}
