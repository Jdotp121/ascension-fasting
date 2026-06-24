import { Achievement } from '@/lib/achievements/definitions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Lock } from 'lucide-react'

interface AchievementCardProps {
  readonly achievement: Achievement
  readonly unlocked: boolean
  readonly unlockedAt: string | null
  readonly progress: {
    readonly current: number
    readonly target: number
    readonly unlocked: boolean
  }
}

export function AchievementCard({ achievement, unlocked, unlockedAt, progress }: AchievementCardProps) {
  const Icon = achievement.icon
  const isProgressBased = progress.target > 1 || achievement.id.includes('weight') || achievement.id === 'reached_goal_weight'

  const getProgressText = () => {
    if (achievement.id === 'reached_goal_weight') {
      return `${progress.current.toFixed(1)} kg / ${progress.target.toFixed(1)} kg`
    }
    if (achievement.id.includes('lost')) {
      return `${progress.current.toFixed(1)} kg / ${progress.target} kg`
    }
    return `${progress.current} / ${progress.target}`
  }

  return (
    <Card className={`${unlocked ? 'bg-white' : 'bg-gray-50 opacity-75'} transition-all`}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${unlocked ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gray-200'}`}>
            {unlocked ? (
              <Icon className={`w-6 h-6 ${achievement.iconColor}`} />
            ) : (
              <Lock className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base mb-1">{achievement.title}</CardTitle>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {unlocked ? (
          <div className="text-sm text-green-600 font-medium">
            ✓ Unlocked {unlockedAt ? new Date(unlockedAt).toLocaleDateString() : ''}
          </div>
        ) : (
          <>
            {isProgressBased && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {getProgressText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (progress.current / progress.target) * 100))}%` 
                    }}
                  />
                </div>
              </div>
            )}
            {!isProgressBased && (
              <p className="text-sm text-gray-500">Complete to unlock</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
