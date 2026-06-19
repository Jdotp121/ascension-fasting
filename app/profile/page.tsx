'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">Error loading profile: {error || 'Profile not found'}</p>
            </CardContent>
          </Card>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account and settings</p>
        </div>

        <div className="space-y-6">
          <ProfileForm profile={profile} onSave={updateProfile} />

          {/* Logout Section */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Logout</h3>
                  <p className="text-sm text-gray-600 mt-1">Sign out of your account</p>
                </div>
                <Button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  variant="secondary"
                  className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
