'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Loader2, Trash2, ExternalLink } from 'lucide-react'
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <AppPageLayout>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </AppPageLayout>
        <BottomNav />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <AppPageLayout>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">Error loading profile: {error || 'Profile not found'}</p>
            </CardContent>
          </Card>
        </AppPageLayout>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <AppPageLayout title="Profile" subtitle="Manage your account and settings">
        <div className="space-y-6">
          <ProfileForm profile={profile} onSave={updateProfile} />

          {/* Account Actions */}
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-4">
                {/* Logout */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Logout</h4>
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

                {/* Delete Account */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Delete Account</h4>
                    <p className="text-sm text-gray-600 mt-1">Permanently delete your account and all data</p>
                  </div>
                  <Link href="/delete-account">
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3 text-sm">
                <Link href="/support" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Support Center
                </Link>
                <Link href="/privacy" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
                <Link href="/terms" className="flex items-center text-blue-600 hover:underline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Terms of Service
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppPageLayout>

      <BottomNav />
    </div>
  )
}
