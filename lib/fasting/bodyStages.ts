// Body stages during fasting based on elapsed hours

export interface BodyStage {
  name: string
  description: string
  minHours: number
  maxHours: number | null
  color: string
  benefits: string[]
}

export const BODY_STAGES: BodyStage[] = [
  {
    name: 'Digestion',
    description: 'Your body is processing the last meal',
    minHours: 0,
    maxHours: 12,
    color: 'blue',
    benefits: [
      'Blood sugar stabilizing',
      'Digestive system at work',
      'Early insulin reduction'
    ]
  },
  {
    name: 'Glycogen Depletion',
    description: 'Body is using stored glucose',
    minHours: 12,
    maxHours: 24,
    color: 'indigo',
    benefits: [
      'Burning stored glycogen',
      'Growth hormone increase',
      'Fat burning begins'
    ]
  },
  {
    name: 'Ketosis Begins',
    description: 'Transitioning to fat burning',
    minHours: 24,
    maxHours: 48,
    color: 'purple',
    benefits: [
      'Ketone production starts',
      'Enhanced mental clarity',
      'Autophagy activation',
      'Inflammation reduction'
    ]
  },
  {
    name: 'Deep Ketosis',
    description: 'Full fat-burning mode activated',
    minHours: 48,
    maxHours: 72,
    color: 'pink',
    benefits: [
      'Peak autophagy',
      'Maximum fat burning',
      'Stem cell regeneration',
      'Deep cellular healing'
    ]
  },
  {
    name: 'Advanced Fasting',
    description: 'Extended therapeutic benefits',
    minHours: 72,
    maxHours: null,
    color: 'rose',
    benefits: [
      'Enhanced autophagy',
      'Immune system reset',
      'Maximum cellular repair',
      'Deep metabolic benefits'
    ]
  }
]

export function getCurrentBodyStage(elapsedHours: number): BodyStage {
  for (let i = BODY_STAGES.length - 1; i >= 0; i--) {
    const stage = BODY_STAGES[i]
    if (elapsedHours >= stage.minHours) {
      return stage
    }
  }
  return BODY_STAGES[0]
}

export function getNextBodyStage(elapsedHours: number): BodyStage | null {
  const currentIndex = BODY_STAGES.findIndex(stage => {
    if (stage.maxHours === null) {
      return elapsedHours >= stage.minHours
    }
    return elapsedHours >= stage.minHours && elapsedHours < stage.maxHours
  })
  
  if (currentIndex === -1 || currentIndex === BODY_STAGES.length - 1) {
    return null
  }
  
  return BODY_STAGES[currentIndex + 1]
}

export function getStageProgress(elapsedHours: number): number {
  const currentStage = getCurrentBodyStage(elapsedHours)
  
  if (currentStage.maxHours === null) {
    return 100
  }
  
  const stageElapsed = elapsedHours - currentStage.minHours
  const stageDuration = currentStage.maxHours - currentStage.minHours
  
  return Math.min(100, (stageElapsed / stageDuration) * 100)
}

export function formatDuration(hours: number): string {
  const totalMinutes = Math.floor(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  
  if (h === 0) {
    return `${m}m`
  }
  
  return `${h}h ${m}m`
}

export function formatDetailedDuration(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
