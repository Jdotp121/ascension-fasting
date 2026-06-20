'use client'

import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppPageLayout } from '@/components/layout/AppPageLayout'
import { FastHistoryList } from '@/components/fast/FastHistoryList'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useFastHistory } from '@/hooks/useFastHistory'
import { Loader2, AlertCircle } from 'lucide-react'

export default function HistoryPage() {
  const { fasts, loading, error } = useFastHistory()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <AppPageLayout title="Fast History" subtitle="View your fasting history and statistics">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading your fasting history...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error loading history</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && <FastHistoryList fasts={fasts} />}
      </AppPageLayout>

      <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
