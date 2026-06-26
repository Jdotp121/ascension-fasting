'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MainGoal, Sex } from '@/types'
import { AlertCircle } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    age: '',
    sex: '' as Sex | '',
    height_cm: '',
    current_weight_kg: '',
    goal_weight_kg: '',
    main_goal: '' as MainGoal | '',
  })

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!userId) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          age: formData.age ? Number.parseInt(formData.age) : null,
          sex: formData.sex || null,
          height_cm: formData.height_cm ? Number.parseFloat(formData.height_cm) : null,
          current_weight_kg: formData.current_weight_kg ? Number.parseFloat(formData.current_weight_kg) : null,
          goal_weight_kg: formData.goal_weight_kg ? Number.parseFloat(formData.goal_weight_kg) : null,
          main_goal: formData.main_goal || null,
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Help us personalize your fasting experience
          </p>
        </div>

        {/* Health Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Health Disclaimer</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Ascension Fasting is for general wellness tracking only and does not provide medical advice, 
                diagnosis, or treatment. Speak to a qualified health professional before fasting, especially 
                if you have a medical condition, are pregnant, under 18, or taking medication.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-lg shadow-md space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Age"
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="25"
              min="1"
              max="150"
            />

            <Select
              label="Sex"
              id="sex"
              value={formData.sex}
              onChange={(e) => handleInputChange('sex', e.target.value)}
              options={[
                { value: '', label: 'Select...' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' },
              ]}
            />

            <Input
              label="Height (cm)"
              type="number"
              id="height_cm"
              value={formData.height_cm}
              onChange={(e) => handleInputChange('height_cm', e.target.value)}
              placeholder="175"
              step="0.1"
              min="1"
            />

            <Input
              label="Current Weight (kg)"
              type="number"
              id="current_weight_kg"
              value={formData.current_weight_kg}
              onChange={(e) => handleInputChange('current_weight_kg', e.target.value)}
              placeholder="75.0"
              step="0.1"
              min="1"
              required
            />

            <Input
              label="Goal Weight (kg)"
              type="number"
              id="goal_weight_kg"
              value={formData.goal_weight_kg}
              onChange={(e) => handleInputChange('goal_weight_kg', e.target.value)}
              placeholder="70.0"
              step="0.1"
              min="1"
              required
            />

            <Select
              label="Main Goal"
              id="main_goal"
              value={formData.main_goal}
              onChange={(e) => handleInputChange('main_goal', e.target.value)}
              options={[
                { value: '', label: 'Select your main goal...' },
                { value: 'weight_loss', label: 'Weight Loss' },
                { value: 'health', label: 'Health & Wellness' },
                { value: 'discipline', label: 'Discipline & Mental Clarity' },
                { value: 'religious', label: 'Religious/Spiritual' },
                { value: 'longevity', label: 'Longevity' },
              ]}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              isLoading={loading}
            >
              Complete Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
