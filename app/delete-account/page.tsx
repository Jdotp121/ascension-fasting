'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ArrowLeft, AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DeleteAccountPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setIsAuthenticated(true)
        setUserEmail(user.email || null)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Delete user profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (profileError) throw profileError

      // Delete fasting records
      await supabase.from('fasts').delete().eq('user_id', user.id)

      // Delete weight entries
      await supabase.from('weight_entries').delete().eq('user_id', user.id)

      // Delete user achievements
      await supabase.from('user_achievements').delete().eq('user_id', user.id)

      // Note: Actual auth user deletion requires admin API or RPC function
      // For now, we'll sign them out and show success message
      await supabase.auth.signOut()

      // Redirect to confirmation page
      alert('Account deletion request received. Your data has been removed and you have been logged out. Please contact support@ascensionfasting.com to complete account deletion.')
      router.push('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account. Please contact support.'
      console.error('Error deleting account:', message)
      setError(message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link href={isAuthenticated ? '/profile' : '/'}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isAuthenticated ? 'Back to Profile' : 'Back to Home'}
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Delete Account</h1>
                <p className="text-gray-600">
                  Permanently delete your Ascension Fasting account and all associated data
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="space-y-6">
                {/* Warning Section */}
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-red-900 font-semibold mb-2">Warning: This action cannot be undone</h3>
                      <p className="text-red-800 text-sm mb-2">
                        Deleting your account will permanently remove:
                      </p>
                      <ul className="list-disc pl-5 text-red-800 text-sm space-y-1">
                        <li>Your profile information</li>
                        <li>All fasting records and history</li>
                        <li>All weight tracking entries</li>
                        <li>All achievements and progress</li>
                        <li>Your account access</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                {userEmail && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Account to be deleted:</p>
                    <p className="font-medium text-gray-900">{userEmail}</p>
                  </div>
                )}

                {/* Confirmation Input */}
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-bold">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="DELETE"
                    disabled={deleting}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={deleting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleting || confirmText !== 'DELETE'}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete My Account
                      </>
                    )}
                  </Button>
                </div>

                {/* Support Contact */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Need help or have questions?{' '}
                    <a 
                      href="mailto:support@ascensionfasting.com" 
                      className="text-blue-600 hover:underline"
                    >
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-900">
                    You must be logged in to delete your account.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/login" className="flex-1">
                    <Button variant="primary" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
