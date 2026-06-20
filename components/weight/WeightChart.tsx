'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { WeightEntry } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingDown } from 'lucide-react'

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

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            Weight Progress Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No weight entries yet. Start logging your weight to see your progress!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate Y-axis domain with padding
  const weights = chartData.map(d => d.weight)
  const minWeight = Math.min(...weights, goalWeight || Infinity)
  const maxWeight = Math.max(...weights)
  const padding = (maxWeight - minWeight) * 0.1 || 5
  const yMin = Math.floor(minWeight - padding)
  const yMax = Math.ceil(maxWeight + padding)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-6 h-6" />
          Weight Progress Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <div className="w-full" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[yMin, yMax]}
                stroke="#888"
                style={{ fontSize: '12px' }}
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              
              {/* Goal weight reference line */}
              {goalWeight && (
                <ReferenceLine 
                  y={goalWeight} 
                  stroke="#10b981" 
                  strokeDasharray="5 5"
                  label={{ value: 'Goal', position: 'right', fill: '#10b981', fontWeight: 'bold' }}
                />
              )}
              
              {/* Weight line */}
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Weight (kg)"
              />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-80 flex items-center justify-center">
            <div className="text-gray-400">Loading chart...</div>
          </div>
        )}

        {/* Chart Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span className="text-gray-600">Your Weight</span>
          </div>
          {goalWeight && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500" style={{ borderTop: '2px dashed' }}></div>
              <span className="text-gray-600">Goal Weight</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
