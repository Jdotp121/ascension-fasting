'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle, Mail, Home, LogIn } from 'lucide-react'

interface EmailConfirmationScreenProps {
  email: string
}

export function EmailConfirmationScreen({ email }: EmailConfirmationScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Account Created Successfully</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Confirmation Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    We've sent a confirmation email to:
                  </p>
                  <p className="font-semibold text-blue-900 mt-1 break-all">
                    {email}
                  </p>
                  <p className="text-sm text-blue-900 mt-3 leading-relaxed">
                    Please check your inbox and click the verification link before signing in.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                If you don't see the email:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Check your spam or junk folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Wait a few minutes for delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Make sure you entered the correct email address</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900 font-medium">
                ✅ After confirming your email, return here and log in to start your fasting journey!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link href="/login" className="block">
                <Button className="w-full" size="lg">
                  <LogIn className="w-5 h-5 mr-2" />
                  Go to Login
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
