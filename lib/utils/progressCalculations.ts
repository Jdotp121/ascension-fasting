/**
 * Utility functions for calculating weight progress metrics
 * Handles edge cases safely to prevent NaN, Infinity, or broken UI states
 */

export interface ProgressMetrics {
  startWeight: number | null
  currentWeight: number | null
  goalWeight: number | null
  weightLost: number
  weightRemaining: number
  totalWeightToLose: number
  progressPercentage: number
  hasReachedGoal: boolean
  hasValidData: boolean
  hasGoal: boolean
  isGaining: boolean // User wants to gain weight
}

export function calculateProgressMetrics(
  startWeight: number | null,
  currentWeight: number | null,
  goalWeight: number | null
): ProgressMetrics {
  // Initialize default values
  const metrics: ProgressMetrics = {
    startWeight,
    currentWeight,
    goalWeight,
    weightLost: 0,
    weightRemaining: 0,
    totalWeightToLose: 0,
    progressPercentage: 0,
    hasReachedGoal: false,
    hasValidData: false,
    hasGoal: goalWeight !== null && goalWeight > 0,
    isGaining: false
  }

  // Check if we have minimum required data
  if (!startWeight || !currentWeight) {
    return metrics
  }

  metrics.hasValidData = true

  // Determine if user is trying to gain or lose weight
  if (goalWeight) {
    metrics.isGaining = goalWeight > startWeight
  }

  // Calculate weight change (can be positive or negative)
  const weightChange = startWeight - currentWeight
  
  // For losing weight: positive change means loss
  // For gaining weight: negative change means gain
  if (metrics.isGaining) {
    metrics.weightLost = Math.abs(Math.min(0, weightChange)) // Weight gained
  } else {
    metrics.weightLost = Math.max(0, weightChange) // Weight lost
  }

  // Calculate remaining weight to goal
  if (goalWeight) {
    if (metrics.isGaining) {
      // Gaining: how much more to gain
      metrics.weightRemaining = Math.max(0, goalWeight - currentWeight)
      metrics.totalWeightToLose = goalWeight - startWeight
      metrics.hasReachedGoal = currentWeight >= goalWeight
    } else {
      // Losing: how much more to lose
      metrics.weightRemaining = Math.max(0, currentWeight - goalWeight)
      metrics.totalWeightToLose = startWeight - goalWeight
      metrics.hasReachedGoal = currentWeight <= goalWeight
    }

    // Calculate progress percentage
    if (metrics.totalWeightToLose > 0) {
      const progress = metrics.isGaining 
        ? (currentWeight - startWeight) / metrics.totalWeightToLose
        : (startWeight - currentWeight) / metrics.totalWeightToLose
      
      // Clamp between 0 and 100
      metrics.progressPercentage = Math.min(100, Math.max(0, progress * 100))
    } else if (metrics.totalWeightToLose === 0) {
      // Start weight equals goal weight
      metrics.progressPercentage = 100
      metrics.hasReachedGoal = true
    }
  }

  return metrics
}

/**
 * Generate motivational insight message based on progress
 */
export function getMotivationalInsight(metrics: ProgressMetrics): string {
  const { 
    hasValidData, 
    hasGoal, 
    hasReachedGoal, 
    weightLost, 
    weightRemaining, 
    progressPercentage,
    isGaining 
  } = metrics

  // No weight entries yet
  if (!hasValidData) {
    return "Start logging your weight to track your progress over time."
  }

  // No goal set
  if (!hasGoal) {
    return "Add your goal weight in Profile to unlock progress tracking."
  }

  // Goal reached!
  if (hasReachedGoal) {
    return `🎉 Congratulations! You've reached your goal weight!`
  }

  // Just started (less than 5% progress)
  if (progressPercentage < 5) {
    return `You're just getting started on your journey. Stay consistent!`
  }

  // Good progress (5-30%)
  if (progressPercentage < 30) {
    const action = isGaining ? "gained" : "lost"
    return `You've ${action} ${Math.abs(weightLost).toFixed(1)}kg so far — ${Math.abs(weightRemaining).toFixed(1)}kg remaining to your goal.`
  }

  // Great progress (30-70%)
  if (progressPercentage < 70) {
    return `You're ${progressPercentage.toFixed(0)}% of the way to your goal. Keep going!`
  }

  // Almost there (70-99%)
  const action = isGaining ? "gain" : "lose"
  return `Almost there! Just ${Math.abs(weightRemaining).toFixed(1)}kg left to ${action}.`
}

/**
 * Format weight display with proper units
 */
export function formatWeight(weight: number | null, includeUnit: boolean = true): string {
  if (weight === null || weight === undefined || Number.isNaN(weight)) {
    return 'Not set'
  }
  return includeUnit ? `${weight.toFixed(1)} kg` : weight.toFixed(1)
}
