'use client'

import { FastType } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Droplet, Apple, Clock } from 'lucide-react'

interface FastTypeSelectorProps {
  readonly onSelect: (type: FastType) => void
}

const FAST_TYPES = [
  {
    type: 'water' as FastType,
    name: 'Water Fast',
    description: 'Water and electrolytes only',
    icon: Droplet,
    color: 'blue',
    recommendations: [
      'Stay hydrated',
      'Consider electrolytes',
      'Listen to your body'
    ]
  },
  {
    type: 'juice' as FastType,
    name: 'Juice Fast',
    description: 'Fresh juices and water',
    icon: Apple,
    color: 'green',
    recommendations: [
      'Fresh vegetable juices',
      'Avoid high sugar fruits',
      'Drink plenty of water'
    ]
  },
  {
    type: 'intermittent' as FastType,
    name: 'Intermittent Fast',
    description: 'Time-restricted eating',
    icon: Clock,
    color: 'purple',
    recommendations: [
      'Common: 16:8 or 18:6',
      'Break fast mindfully',
      'Stay consistent'
    ]
  }
]

export function FastTypeSelector({ onSelect }: FastTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Fast Type</h2>
        <p className="mt-2 text-gray-600">Select the fasting method that suits your goals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {FAST_TYPES.map((fastType) => {
          const Icon = fastType.icon
          return (
            <Card
              key={fastType.type}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => onSelect(fastType.type)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-full bg-${fastType.color}-100 flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 text-${fastType.color}-600`} />
                </div>
                <CardTitle>{fastType.name}</CardTitle>
                <p className="text-sm text-gray-600">{fastType.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-gray-600">
                  {fastType.recommendations.map((rec) => (
                    <li key={rec} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
