'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { FastType } from '@/types'
import { ArrowLeft, Calendar } from 'lucide-react'

interface DurationSelectorProps {
  readonly fastType: FastType
  readonly onBack: () => void
  readonly onStart: (durationHours: number) => void
}

const DURATION_PRESETS = {
  water: [
    { hours: 24, label: '24 Hours', description: 'One day fast' },
    { hours: 36, label: '36 Hours', description: 'Extended fast' },
    { hours: 48, label: '48 Hours', description: 'Two day fast' },
    { hours: 72, label: '72 Hours', description: 'Three day fast' }
  ],
  juice: [
    { hours: 24, label: '24 Hours', description: 'One day cleanse' },
    { hours: 48, label: '48 Hours', description: 'Two day cleanse' },
    { hours: 72, label: '72 Hours', description: 'Three day cleanse' }
  ],
  intermittent: [
    { hours: 16, label: '16 Hours', description: '16:8 method' },
    { hours: 18, label: '18 Hours', description: '18:6 method' },
    { hours: 20, label: '20 Hours', description: '20:4 method' },
    { hours: 24, label: '24 Hours', description: 'OMAD (One meal a day)' }
  ]
}

export function DurationSelector({ fastType, onBack, onStart }: DurationSelectorProps) {
  const [customHours, setCustomHours] = useState<number>(24)

  const presets = DURATION_PRESETS[fastType]

  const handleStart = (hours: number) => {
    if (hours > 0 && hours <= 168) { // Max 1 week
      onStart(hours)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Set Duration</h2>
          <p className="text-gray-600">How long will you fast?</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {presets.map((preset) => (
          <Card
            key={preset.hours}
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
            onClick={() => handleStart(preset.hours)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{preset.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="custom-hours" className="block text-sm font-medium text-gray-700 mb-2">
                Hours
              </label>
              <input
                type="number"
                id="custom-hours"
                min="1"
                max="168"
                value={customHours}
                onChange={(e) => setCustomHours(Number.parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={() => handleStart(customHours)}
              disabled={customHours < 1 || customHours > 168}
            >
              Start Fast
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Maximum duration: 168 hours (7 days)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
