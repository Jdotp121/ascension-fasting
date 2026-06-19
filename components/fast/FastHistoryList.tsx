'use client'

import { Fast } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Clock, Calendar, TrendingUp, Award } from 'lucide-react'

interface FastHistoryListProps {
  fasts: Fast[]
}

export function FastHistoryList({ fasts }: FastHistoryListProps) {
  if (fasts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fasting History Yet</h3>
          <p className="text-gray-600">Start your first fast to see it appear here!</p>
        </CardContent>
      </Card>
    )
  }

  const getFastTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      water: 'Water Fast',
      juice: 'Juice Fast',
      intermittent: 'Intermittent Fast'
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    }
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`
  }

  // Calculate stats
  const totalFasts = fasts.length
  const totalHours = fasts.reduce((sum, fast) => sum + (fast.duration_hours || 0), 0)
  const longestFast = Math.max(...fasts.map(f => f.duration_hours || 0))
  const averageDuration = totalHours / totalFasts

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fasts</p>
              <p className="text-2xl font-bold text-gray-900">{totalFasts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Longest Fast</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(longestFast)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Duration</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(averageDuration)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fast History</h2>
        <div className="space-y-4">
          {fasts.map((fast) => (
            <Card key={fast.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{getFastTypeLabel(fast.fast_type)}</span>
                  <span className="text-sm font-normal text-gray-600">
                    {formatDate(fast.start_time)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Started</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(fast.start_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Ended</p>
                      <p className="text-sm font-medium text-gray-900">
                        {fast.actual_end_time ? formatTime(fast.actual_end_time) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {fast.duration_hours ? formatDuration(fast.duration_hours) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {fast.break_reason && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Break Reason</p>
                    <p className="text-sm text-gray-900">{fast.break_reason}</p>
                  </div>
                )}

                {fast.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Notes</p>
                    <p className="text-sm text-gray-900">{fast.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
