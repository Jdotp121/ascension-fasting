'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { WeightEntry } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingDown, Calendar, Info } from 'lucide-react'

interface WeightChartProps {
  readonly weightEntries: WeightEntry[]
  readonly goalWeight: number | null
}

export function WeightChart({ weightEntries, goalWeight }: WeightChartProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sort entries by date ascending
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
  )

  // Format data for chart
  const chartData = sortedEntries.map(entry => ({
    date: new Date(entry.entry_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    weight: entry.weight_kg,
    fullDate: entry.entry_date
  }))

  // Empty state - no entries
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-gray-600" />
            Weight Progress Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No weight data yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start logging your weight to see your progress chart. Track your journey visually over time.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Only one entry - show message
  if (chartData.length === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-blue-600" />
            Weight Progress Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              One entry recorded
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              Great start! Log your weight regularly to see a trend line. We recommend logging at least 2-3 times per week for best results.
            </p>
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm font-medium text-blue-900">
                First entry: {chartData[0].weight.toFixed(1)} kg on {chartData[0].date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate Y-axis domain with padding
  const weights = chartData.map(d => d.weight)
  const minWeight = Math.min(...weights, goalWeight || Infinity)
  const maxWeight = Math.max(...weights)
  const padding = (maxWeight - minWeight) * 0.15 || 5 // Increased padding for better visibility
  const yMin = Math.floor(minWeight - padding)
  const yMax = Math.ceil(maxWeight + padding)

  // Calculate weight change
  const startWeight = chartData[0].weight
  const currentWeight = chartData.at(-1)!.weight
  const weightChange = startWeight - currentWeight
  const isLoss = weightChange > 0

  let weightChangeColorClass: string
  if (isLoss) {
    weightChangeColorClass = 'text-green-600'
  } else if (weightChange < 0) {
    weightChangeColorClass = 'text-orange-600'
  } else {
    weightChangeColorClass = 'text-gray-600'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-purple-600" />
            Weight Progress Chart
          </CardTitle>
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600">Entries:</span>
              <span className="font-semibold text-gray-900">{chartData.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600">Change:</span>
              <span className={`font-semibold ${weightChangeColorClass}`}>
                {isLoss ? '-' : '+'}{Math.abs(weightChange).toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mounted ? (
          <div className="w-full -ml-4 sm:ml-0" style={{ height: '360px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '13px', fontWeight: '500' }}
                  tick={{ fill: '#6b7280' }}
                  tickMargin={8}
                />
                <YAxis 
                  domain={[yMin, yMax]}
                  stroke="#6b7280"
                  style={{ fontSize: '13px', fontWeight: '500' }}
                  tick={{ fill: '#6b7280' }}
                  label={{ 
                    value: 'Weight (kg)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: '#6b7280', fontSize: '13px', fontWeight: '600' }
                  }}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}
                  itemStyle={{
                    color: '#8b5cf6',
                    fontWeight: '600'
                  }}
                  formatter={(value: any) => [`${value.toFixed(1)} kg`, 'Weight']}
                />
                
                {/* Goal weight reference line */}
                {goalWeight && (
                  <ReferenceLine 
                    y={goalWeight} 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    label={{ 
                      value: `Goal: ${goalWeight.toFixed(1)} kg`, 
                      position: 'right', 
                      fill: '#10b981', 
                      fontWeight: '700',
                      fontSize: '13px'
                    }}
                  />
                )}
                
                {/* Weight line */}
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ 
                    fill: '#8b5cf6', 
                    strokeWidth: 2, 
                    r: 6,
                    stroke: '#fff'
                  }}
                  activeDot={{ 
                    r: 8,
                    fill: '#7c3aed',
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                  name="Weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center" style={{ height: '360px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading chart...</p>
            </div>
          </div>
        )}

        {/* Chart Legend & Info */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-purple-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Your Weight</span>
            </div>
            {goalWeight && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-500 rounded-full" style={{ 
                  backgroundImage: 'repeating-linear-gradient(to right, #10b981 0px, #10b981 8px, transparent 8px, transparent 12px)' 
                }}></div>
                <span className="text-gray-700 font-medium">Goal Weight</span>
              </div>
            )}
          </div>
          
          {/* Helpful tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900 text-center leading-relaxed">
              💡 <strong>Tip:</strong> Log your weight regularly to see a clearer trend over time. Weight can fluctuate daily, so focus on the overall trend.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
