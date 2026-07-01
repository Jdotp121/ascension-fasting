'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  readonly children: React.ReactNode
}

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * 
 * Redirects unauthenticated users to /login
 * Redirects users who haven't completed onboarding to /onboarding
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip onboarding check if we're already on the onboarding page
      if (pathname === '/onboarding') {
        setOnboardingCompleted(true)
        setCheckingOnboarding(false)
        return
      }

      if (!loading && isAuthenticated) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

          if (profile?.onboarding_completed === false) {
            router.push('/onboarding')
            setOnboardingCompleted(false)
          } else {
            setOnboardingCompleted(true)
          }
        }
        setCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [isAuthenticated, loading, router, pathname])

  // Show loading state while checking auth or onboarding
  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content until authenticated and onboarding is checked
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // If onboarding not completed and we're not on onboarding page, show loading
  if (!onboardingCompleted && pathname !== '/onboarding') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
