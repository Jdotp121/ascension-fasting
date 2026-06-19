'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { Footer } from '@/components/ui/Footer'
import { FastTypeSelector } from '@/components/fast/FastTypeSelector'
import { DurationSelector } from '@/components/fast/DurationSelector'
import { ActiveFastTimer } from '@/components/fast/ActiveFastTimer'
import { useFast } from '@/hooks/useFast'
import { FastType } from '@/types'
import { Loader2, AlertCircle } from 'lucide-react'

type FlowStep = 'select-type' | 'select-duration' | 'active-fast'

export default function FastPage() {
  const { activeFast, loading, error, startFast, endFast } = useFast()
  const [selectedType, setSelectedType] = useState<FastType | null>(null)
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-type')
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)

  // Handle fast type selection
  const handleTypeSelect = (type: FastType) => {
    setSelectedType(type)
    setCurrentStep('select-duration')
  }

  // Handle back from duration selection
  const handleBackToTypeSelection = () => {
    setCurrentStep('select-type')
    setSelectedType(null)
  }

  // Handle starting a new fast
  const handleStartFast = async (durationHours: number) => {
    if (!selectedType) return

    setIsStarting(true)
    try {
      await startFast(selectedType, durationHours)
      setCurrentStep('active-fast')
    } catch (err) {
      console.error('Error starting fast:', err)
      alert('Failed to start fast. Please try again.')
    } finally {
      setIsStarting(false)
    }
  }

  // Handle ending the fast
  const handleEndFast = async () => {
    setIsEnding(true)
    try {
      await endFast()
      setCurrentStep('select-type')
      setSelectedType(null)
    } catch (err) {
      console.error('Error ending fast:', err)
      alert('Failed to end fast. Please try again.')
    } finally {
      setIsEnding(false)
    }
  }

  // Determine what to show
  const renderContent = () => {
    // Loading state
    if (loading && !activeFast) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )
    }

    // Error state
    if (error && !activeFast) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )
    }

    // Ending fast - show loading state
    if (isEnding) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Ending your fast...</p>
          </div>
        </div>
      )
    }

    // Active fast exists - show timer
    if (activeFast) {
      return <ActiveFastTimer fast={activeFast} onEndFast={handleEndFast} />
    }

    // Starting a fast - show appropriate step
    if (isStarting) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Starting your fast...</p>
          </div>
        </div>
      )
    }

    // Show flow based on current step
    switch (currentStep) {
      case 'select-type':
        return <FastTypeSelector onSelect={handleTypeSelect} />
      
      case 'select-duration':
        return selectedType ? (
          <DurationSelector 
            fastType={selectedType}
            onBack={handleBackToTypeSelection}
            onStart={handleStartFast}
          />
        ) : null
      
      default:
        return <FastTypeSelector onSelect={handleTypeSelect} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8 flex-1">
        {!activeFast && (
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fast Tracking</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              {currentStep === 'select-type' && 'Start a new fasting journey'}
              {currentStep === 'select-duration' && 'Set your fasting duration'}
            </p>
          </div>
        )}

        {error && !activeFast && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {renderContent()}
      </main>

      <BottomNav />
    </div>
  )
}
