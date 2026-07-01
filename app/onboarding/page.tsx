'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Sparkles, Clock, Target, TrendingUp, AlertCircle } from 'lucide-react'

interface OnboardingScreen {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const screens: OnboardingScreen[] = [
  {
    id: 1,
    title: 'Welcome to Ascension Fasting',
    description: 'Track your fasts, understand your fasting stage, and follow your progress toward your health goals.',
    icon: <Sparkles className="w-16 h-16 text-blue-600" />,
  },
  {
    id: 2,
    title: 'Choose Your Fasting Style',
    description: 'Start a water fast, juice fast, or intermittent fast with preset and custom durations.',
    icon: <Clock className="w-16 h-16 text-purple-600" />,
  },
  {
    id: 3,
    title: 'Set Your Weight Goal',
    description: 'Add your current weight and goal weight in Profile under Health Goals so Ascension can track your progress clearly.',
    icon: <Target className="w-16 h-16 text-green-600" />,
  },
  {
    id: 4,
    title: 'Track Your Journey',
    description: 'Log your weight, view your fasting history, and watch your progress build over time.',
    icon: <TrendingUp className="w-16 h-16 text-orange-600" />,
  },
  {
    id: 5,
    title: 'Important Note',
    description: 'Ascension Fasting is for tracking and educational purposes only. It does not provide medical advice. Please consult a qualified healthcare professional before beginning extended fasting, especially if you have a medical condition, are pregnant, under 18, or taking medication.',
    icon: <AlertCircle className="w-16 h-16 text-amber-600" />,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState(0)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUserId(user.id)

      // Check if user has already completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      }
    }
    
    checkUser()
  }, [router])

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    }
  }

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const handleComplete = async () => {
    if (!userId) return
    
    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)

      if (error) throw error

      router.push('/dashboard')
    } catch (err) {
      console.error('Error completing onboarding:', err)
      // Still redirect to dashboard even if there's an error
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    await handleComplete()
  }

  const screen = screens[currentScreen]
  const isLastScreen = currentScreen === screens.length - 1
  const isFirstScreen = currentScreen === 0

  const getProgressDotClassName = (index: number): string => {
    const baseClasses = 'h-2 rounded-full transition-all duration-300'
    
    if (index === currentScreen) {
      return `${baseClasses} w-8 bg-blue-600`
    }
    
    if (index < currentScreen) {
      return `${baseClasses} w-2 bg-blue-400`
    }
    
    return `${baseClasses} w-2 bg-gray-300`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            {screens.map((screen, index) => (
              <div
                key={screen.id}
                className={getProgressDotClassName(index)}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {currentScreen + 1} of {screens.length}
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {screen.icon}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
              {screen.title}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-700 text-center leading-relaxed max-w-xl mx-auto">
              {screen.description}
            </p>

            {/* Special styling for disclaimer screen */}
            {screen.id === 5 && (
              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900 text-center font-medium">
                  By continuing, you acknowledge that you understand this is a tracking tool only.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-3">
            {/* Skip Button - Only show on non-last screens */}
            {!isLastScreen && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="lg"
                className="sm:order-1"
                disabled={loading}
              >
                Skip
              </Button>
            )}

            {/* Back Button - Show after first screen */}
            {!isFirstScreen && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="sm:order-2"
                disabled={loading}
              >
                Back
              </Button>
            )}

            {/* Next/Get Started Button */}
            {isLastScreen ? (
              <Button
                onClick={handleComplete}
                variant="primary"
                size="lg"
                className="sm:order-3 sm:ml-auto"
                isLoading={loading}
              >
                Get Started
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="primary"
                size="lg"
                className="sm:order-3 sm:ml-auto"
                disabled={loading}
              >
                Next
              </Button>
            )}
          </div>
        </Card>

        {/* App Name Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Ascension Fasting
        </p>
      </div>
    </div>
  )
}
