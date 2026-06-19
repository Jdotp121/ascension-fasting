'use client'

import { Header } from '@/components/navigation/Header'
import { BottomNav } from '@/components/navigation/BottomNav'
import { FastHistoryList } from '@/components/fast/FastHistoryList'
import { useFastHistory } from '@/hooks/useFastHistory'

export default function HistoryPage() {
  const { fasts, loading, error } = useFastHistory()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fast History</h1>
          <p className="mt-2 text-gray-600">View your fasting history and statistics</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your fasting history...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error loading history: {error}</p>
          </div>
        )}

        {!loading && !error && <FastHistoryList fasts={fasts} />}
      </main>

      <BottomNav />
    </div>
  )
}
