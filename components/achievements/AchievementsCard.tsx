import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Trophy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface AchievementsCardProps {
  readonly unlockedCount: number
  readonly totalCount: number
}

export function AchievementsCard({ unlockedCount, totalCount }: AchievementsCardProps) {
  const router = useRouter()
  const percentage = Math.round((unlockedCount / totalCount) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {unlockedCount} / {totalCount}
              </p>
              <p className="text-sm text-gray-600 mt-1">Unlocked</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${(unlockedCount / totalCount) * 219.8} 219.8`}
                  className="text-yellow-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/achievements')} 
            variant="outline"
            className="w-full"
          >
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
