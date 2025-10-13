'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Passion {
  name: string
  whatItIs: string
  whyItFits: string
  detailedPlan?: any
}

interface PassionCardProps {
  passion: Passion
  index: number
  conversationId: string
}

export default function PassionCard({ passion, index, conversationId }: PassionCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleTryPassion = async () => {
    const passionNumber = index + 1

    // If detailed plan already exists, just navigate
    if (passion.detailedPlan) {
      router.push(`/plan/${conversationId}/passion/${passionNumber}`)
      return
    }

    // Generate detailed plan
    setIsGenerating(true)
    try {
      const csrf = document.cookie.split('; ').find((c) => c.startsWith('csrfToken='))?.split('=')[1] || ''
      const response = await fetch('/api/passion/generate-detailed-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrf
        },
        body: JSON.stringify({
          conversationId,
          passionNumber
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate detailed plan')
      }

      // Redirect to passion detail page
      router.push(`/plan/${conversationId}/passion/${passionNumber}`)
    } catch (error) {
      console.error('Error generating detailed plan:', error)
      alert('Failed to generate action plan. Please try again.')
      setIsGenerating(false)
    }
  }

  const icons = ['🎯', '🌟', '⭐']

  return (
    <div className="border border-gray-200 rounded-lg p-8 hover:border-gray-800 transition-all">
      {/* Passion Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">
          {icons[index]}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {passion.name}
          </h2>
          <div className="h-1 w-20 bg-gray-800"></div>
        </div>
      </div>

      {/* What It Is */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          What It Is:
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {passion.whatItIs}
        </p>
      </div>

      {/* Why It Fits You */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Why This Fits You:
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {passion.whyItFits}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTryPassion}
        disabled={isGenerating}
        className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        {isGenerating ? 'Generating Action Plan...' : passion.detailedPlan ? 'View Action Plan' : 'Try This Passion'}
      </button>
    </div>
  )
}

