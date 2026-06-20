'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, X } from 'lucide-react'

interface AddWeightEntryProps {
  readonly onAdd: (weight: number, date?: string) => Promise<void>
}

export function AddWeightEntry({ onAdd }: AddWeightEntryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const weightNum = Number.parseFloat(weight)
    
    if (Number.isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
      setError('Weight must be between 20kg and 500kg')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onAdd(weightNum, date)
      setWeight('')
      setDate(new Date().toISOString().split('T')[0])
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || 'Failed to add weight entry')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2"
        size="lg"
      >
        <Plus className="w-5 h-5" />
        Log Weight
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Log Weight Entry</CardTitle>
          <button
            onClick={() => {
              setIsOpen(false)
              setError(null)
              setWeight('')
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              min="20"
              max="500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="75.5"
              required
              helperText="Enter your weight in kilograms (20-500 kg)"
            />
            <p className="text-xs text-gray-500 italic px-1">
              Morning weigh-ins on an empty stomach provide the most reliable trend data.
            </p>
          </div>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            helperText="Only one entry allowed per day"
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setError(null)
                setWeight('')
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={loading}
              disabled={loading}
            >
              Save Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
