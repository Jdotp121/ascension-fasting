'use client'

import { useState, useEffect } from 'react'
import { UserProfile, Sex, MainGoal } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Save, Loader2 } from 'lucide-react'

interface ProfileFormProps {
  readonly profile: UserProfile
  readonly onSave: (updates: ProfileFormData) => Promise<{ success: boolean; error?: string }>
}

export interface ProfileFormData {
  name: string
  age: number | null
  sex: Sex | null
  height_cm: number | null
  goal_weight_kg: number | null
  main_goal: MainGoal | null
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name,
    age: profile.age,
    sex: profile.sex,
    height_cm: profile.height_cm,
    goal_weight_kg: profile.goal_weight_kg,
    main_goal: profile.main_goal
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync form state when the profile prop changes (e.g. after a refetch).
  // This is a legitimate prop-to-state sync pattern; deriving the form from
  // props on every render would lose user input.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: profile.name,
      age: profile.age,
      sex: profile.sex,
      height_cm: profile.height_cm,
      goal_weight_kg: profile.goal_weight_kg,
      main_goal: profile.main_goal
    })
  }, [profile])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Name is required'
    }

    // Age validation
    if (formData.age !== null) {
      if (formData.age < 13 || formData.age > 100) {
        newErrors.age = 'Age must be between 13 and 100'
      }
    }

    // Height validation
    if (formData.height_cm !== null) {
      if (formData.height_cm < 100 || formData.height_cm > 250) {
        newErrors.height_cm = 'Height must be between 100cm and 250cm'
      }
    }

    // Goal weight validation
    if (formData.goal_weight_kg !== null) {
      if (formData.goal_weight_kg < 20 || formData.goal_weight_kg > 500) {
        newErrors.goal_weight_kg = 'Goal weight must be between 20kg and 500kg'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the validation errors' })
      return
    }

    setSaving(true)
    setMessage(null)

    const result = await onSave(formData)

    setSaving(false)

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 5000)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
    }
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <Input
              id="age"
              type="number"
              value={formData.age ?? ''}
              onChange={(e) => handleInputChange('age', e.target.value ? Number.parseInt(e.target.value) : null)}
              className={errors.age ? 'border-red-500' : ''}
              placeholder="Enter your age"
              min="13"
              max="100"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
              Sex
            </label>
            <Select
              id="sex"
              value={formData.sex ?? ''}
              onChange={(e) => handleInputChange('sex', e.target.value || null)}
              options={[
                { value: '', label: 'Select sex' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' }
              ]}
            />
          </div>

          {/* Height */}
          <div>
            <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <Input
              id="height_cm"
              type="number"
              value={formData.height_cm ?? ''}
              onChange={(e) => handleInputChange('height_cm', e.target.value ? Number.parseFloat(e.target.value) : null)}
              className={errors.height_cm ? 'border-red-500' : ''}
              placeholder="Enter your height in cm"
              min="100"
              max="250"
              step="0.1"
            />
            {errors.height_cm && (
              <p className="mt-1 text-sm text-red-600">{errors.height_cm}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Health Goals Card */}
      <Card>
        <CardHeader>
          <CardTitle>Health Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Weight (read-only) */}
          <div>
            <label htmlFor="current_weight" className="block text-sm font-medium text-gray-700 mb-2">
              Current Weight (kg)
            </label>
            <Input
              id="current_weight"
              type="number"
              value={profile.current_weight_kg ?? ''}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500">
              Update your weight from the Weight page
            </p>
          </div>

          {/* Goal Weight */}
          <div>
            <label htmlFor="goal_weight_kg" className="block text-sm font-medium text-gray-700 mb-2">
              Goal Weight (kg)
            </label>
            <Input
              id="goal_weight_kg"
              type="number"
              value={formData.goal_weight_kg ?? ''}
              onChange={(e) => handleInputChange('goal_weight_kg', e.target.value ? Number.parseFloat(e.target.value) : null)}
              className={errors.goal_weight_kg ? 'border-red-500' : ''}
              placeholder="Enter your goal weight in kg"
              min="20"
              max="500"
              step="0.1"
            />
            {errors.goal_weight_kg && (
              <p className="mt-1 text-sm text-red-600">{errors.goal_weight_kg}</p>
            )}
          </div>

          {/* Main Goal */}
          <div>
            <label htmlFor="main_goal" className="block text-sm font-medium text-gray-700 mb-2">
              Main Goal
            </label>
            <Select
              id="main_goal"
              value={formData.main_goal ?? ''}
              onChange={(e) => handleInputChange('main_goal', e.target.value || null)}
              options={[
                { value: '', label: 'Select your main goal' },
                { value: 'weight_loss', label: 'Weight Loss' },
                { value: 'health', label: 'Health' },
                { value: 'discipline', label: 'Discipline' },
                { value: 'religious', label: 'Religious' },
                { value: 'longevity', label: 'Longevity' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
