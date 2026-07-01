'use client'

import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '@/lib/achievements/definitions'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface AchievementCelebrationProps {
  readonly achievementIds: string[]
  readonly onClose: () => void
}

export function AchievementCelebration({ achievementIds, onClose }: AchievementCelebrationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // setShow(true) triggers the entrance animation after mount. This is a
    // legitimate animation trigger pattern (mount with show=false, then
    // transition to show=true). CSS-only alternatives would require restructuring
    // the animation logic.
    if (achievementIds.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true)
    }
  }, [achievementIds])

  if (achievementIds.length === 0) return null

  const currentAchievement = ACHIEVEMENTS.find(a => a.id === achievementIds[currentIndex])
  
  if (!currentAchievement) return null

  const Icon = currentAchievement.icon

  const handleNext = () => {
    if (currentIndex < achievementIds.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close achievement celebration"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 ${show ? 'scale-100' : 'scale-95'}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Trophy animation */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-yellow-100 rounded-full animate-ping opacity-25" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                <Icon className={`w-16 h-16 ${currentAchievement.iconColor}`} />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-600">
              🏆 Achievement Unlocked!
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {currentAchievement.title}
            </h3>
            <p className="text-gray-600">
              {currentAchievement.description}
            </p>
          </div>

          {/* Progress indicator */}
          {achievementIds.length > 1 && (
            <div className="flex gap-2 justify-center">
              {achievementIds.map((achievementId, idx) => (
                <div
                  key={achievementId}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-8 bg-yellow-600' 
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {currentIndex < achievementIds.length - 1 ? (
              <>
                <Button onClick={handleClose} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button onClick={handleNext} variant="primary" className="flex-1">
                  Next ({currentIndex + 1}/{achievementIds.length})
                </Button>
              </>
            ) : (
              <Button onClick={handleClose} variant="primary" className="w-full">
                Awesome!
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
