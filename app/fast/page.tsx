'use client'

import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Timer } from 'lucide-react'

export default function FastPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fast Tracking</h1>
          <p className="mt-2 text-gray-600">Start and manage your fasts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-6 h-6" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Fast tracking features will be implemented in Phase 2</p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
