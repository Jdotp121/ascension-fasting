'use client'

import { AlertCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-medium mb-1">Health Disclaimer</p>
            <p className="text-amber-800">
              Fasting may not be suitable for everyone. This app is for informational purposes only and is not medical advice. 
              Consult a healthcare professional before starting a fasting routine.
            </p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2026 Ascension Fasting. Part of the Ascension Ecosystem.</p>
        </div>
      </div>
    </footer>
  )
}
