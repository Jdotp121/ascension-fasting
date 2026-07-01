'use client'

import { useState, useEffect } from 'react'
import { Fast } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  getCurrentBodyStage, 
  getNextBodyStage, 
  getStageProgress,
  formatDetailedDuration,
  formatDuration,
  BODY_STAGES
} from '@/lib/fasting/bodyStages'
import { Timer, TrendingUp, AlertCircle, StopCircle } from 'lucide-react'

interface ActiveFastTimerProps {
  readonly fast: Fast
  readonly onEndFast: () => void
}

export function ActiveFastTimer({ fast, onEndFast }: ActiveFastTimerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showEndDialog, setShowEndDialog] = useState(false)

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const startTime = new Date(fast.start_time)
  const plannedEndTime = new Date(fast.planned_end_time)
  const elapsedMs = currentTime.getTime() - startTime.getTime()
  const elapsedHours = elapsedMs / (1000 * 60 * 60)
  const plannedDurationMs = plannedEndTime.getTime() - startTime.getTime()
  const plannedDurationHours = plannedDurationMs / (1000 * 60 * 60)
  const overallProgress = Math.min(100, (elapsedHours / plannedDurationHours) * 100)
  const remainingHours = plannedDurationHours - elapsedHours
  const isGoalReached = remainingHours <= 0

  const currentStage = getCurrentBodyStage(elapsedHours)
  const nextStage = getNextBodyStage(elapsedHours)
  const stageProgress = getStageProgress(elapsedHours)

  // Get fast type display name
  const getFastTypeName = (type: string) => {
    switch(type) {
      case 'water': return 'Water Fast'
      case 'juice': return 'Juice Fast'
      case 'intermittent': return 'Intermittent Fast'
      default: return type
    }
  }

  // Get stage color hex code
  const getStageColor = (color: string): string => {
    switch(color) {
      case 'green': return '#22c55e'
      case 'blue': return '#3b82f6'
      case 'purple': return '#a855f7'
      case 'yellow': return '#eab308'
      default: return '#6b7280'
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Timer Display */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                {getFastTypeName(fast.fast_type)}
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 font-mono whitespace-nowrap overflow-x-auto px-2 -mx-2">
              {formatDetailedDuration(elapsedHours)}
            </div>
            
            <p className="text-gray-600">
              Started {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to goal</span>
              <span>{formatDuration(elapsedHours)} / {formatDuration(plannedDurationHours)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
              />
            </div>
            
            {/* Remaining Time */}
            <div className="flex justify-between text-sm mt-2">
              {isGoalReached ? (
                <span className="text-green-600 font-semibold">Goal reached</span>
              ) : (
                <>
                  <span className="text-gray-600">Time remaining</span>
                  <span className="text-gray-900 font-medium">{formatDuration(remainingHours)}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Body Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Current Body Stage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{currentStage.name}</h3>
              <span className="text-sm text-gray-500">{formatDuration(elapsedHours)}</span>
            </div>
            <p className="text-gray-600">{currentStage.description}</p>
          </div>

          {/* Stage Progress */}
          {currentStage.maxHours && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Stage Progress</span>
                <span>{Math.min(100, Math.max(0, stageProgress)).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, stageProgress))}%`,
                    backgroundColor: getStageColor(currentStage.color)
                  }}
                />
              </div>
            </div>
          )}

          {/* Benefits */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Current Benefits:</h4>
            <ul className="space-y-1">
              {currentStage.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage */}
      {nextStage && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-5 h-5" />
              Next Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{nextStage.name}</h3>
                <p className="text-sm text-gray-600">{nextStage.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">In</p>
                <p className="font-semibold text-gray-900">
                  {formatDuration(nextStage.minHours - elapsedHours)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Stages Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Fasting Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BODY_STAGES.map((stage) => {
              const isPast = elapsedHours >= stage.minHours
              const isCurrent = currentStage.name === stage.name
              
              // Extract nested ternary into separate variables for better readability
              let containerClasses = 'flex items-center gap-3 p-3 rounded-lg transition-colors '
              if (isCurrent) {
                containerClasses += 'bg-blue-50 border-2 border-blue-500'
              } else if (isPast) {
                containerClasses += 'bg-gray-50'
              } else {
                containerClasses += 'bg-white border border-gray-200'
              }
              
              let dotClasses = 'w-3 h-3 rounded-full '
              if (isCurrent) {
                dotClasses += 'bg-blue-500 animate-pulse'
              } else if (isPast) {
                dotClasses += 'bg-green-500'
              } else {
                dotClasses += 'bg-gray-300'
              }
              
              return (
                <div 
                  key={stage.name}
                  className={containerClasses}
                >
                  <div className={dotClasses} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                        {stage.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {stage.minHours}h{stage.maxHours ? ` - ${stage.maxHours}h` : '+'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* End Fast Button */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
        onClick={() => setShowEndDialog(true)}
      >
        <StopCircle className="w-5 h-5" />
        End Fast
      </Button>

      {/* End Fast Confirmation Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>End Fast?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You&apos;ve been fasting for {formatDuration(elapsedHours)}. Are you sure you want to end your fast?
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Current Stage:</strong> {currentStage.name}
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  <strong>Duration:</strong> {formatDetailedDuration(elapsedHours)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEndDialog(false)}
                >
                  Continue Fasting
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setShowEndDialog(false)
                    onEndFast()
                  }}
                >
                  End Fast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
