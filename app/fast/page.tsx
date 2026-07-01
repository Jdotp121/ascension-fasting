'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { FastTypeSelector } from '@/components/fast/FastTypeSelector'
import { DurationSelector } from '@/components/fast/DurationSelector'
import { ActiveFastTimer } from '@/components/fast/ActiveFastTimer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useFast } from '@/hooks/useFast'
import { FastType, Fast } from '@/types'
import { Loader2, AlertCircle } from 'lucide-react'
import { FastCompletionSummary } from '@/components/fast/FastCompletionSummary'

type FlowStep = 'select-type' | 'select-duration' | 'active-fast' | 'completed'

export default function FastPage() {
  const { activeFast, loading, error, startFast, endFast } = useFast()
  const [selectedType, setSelectedType] = useState<FastType | null>(null)
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-type')
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [completedFast, setCompletedFast] = useState<Fast | null>(null)


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
      const finishedFast = await endFast()
      setCompletedFast(finishedFast)
      setCurrentStep('completed')
      setSelectedType(null)
    } catch (err) {
      console.error('Error ending fast:', err)
      alert('Failed to end fast. Please try again.')
    } finally {
      setIsEnding(false)
    }
  }

  // Handle starting a new fast from the completion summary
  const handleStartNewFastFromSummary = () => {
    setCompletedFast(null)
    setCurrentStep('select-type')
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

    // Fast just completed - show completion summary with post-fast suggestions link
    if (currentStep === 'completed' && completedFast) {
      return (
        <FastCompletionSummary
          fast={completedFast}
          onStartNewFast={handleStartNewFastFromSummary}
        />
      )
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

  // Compute subtitle based on current state
  const getSubtitle = () => {
    if (activeFast) return undefined
    if (currentStep === 'completed') return 'Nice work — here\'s a quick summary'
    if (currentStep === 'select-type') return 'Start a new fasting journey'
    return 'Set your fasting duration'
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <AppPageLayout 
          title={activeFast ? undefined : "Fast Tracking"}
          subtitle={getSubtitle()}
          hideHeader={!!activeFast}
        >
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

          {/* Health Disclaimer - show when selecting a fast, not when fast is active */}
          {!activeFast && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Health Disclaimer</p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Ascension Fasting is for general wellness tracking only and does not provide medical advice, 
                    diagnosis, or treatment. Speak to a qualified health professional before fasting, especially 
                    if you have a medical condition, are pregnant, under 18, or taking medication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {renderContent()}
        </AppPageLayout>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
