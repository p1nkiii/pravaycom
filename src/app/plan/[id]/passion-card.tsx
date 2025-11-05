'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Passion {
  name: string
  whatItIs: string
  whyItFits: string
  detailedPlan?: unknown
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

  const getNumberLabel = (idx: number) => {
    if (idx === 0) return '1st'
    if (idx === 1) return '2nd'
    return '3rd'
  }

  return (
    <div className="bg-white border-2 border-sky-200 rounded-2xl p-8 hover:border-sky-400 hover:shadow-xl transition-all">
      {/* Passion Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-16 h-16 rounded-xl bg-sky-500 flex items-center justify-center text-white flex-shrink-0">
          <span className="text-2xl font-bold">{index + 1}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {passion.name}
            </h2>
            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
              {getNumberLabel(index)} Match
            </span>
          </div>
          <div className="h-1 w-24 bg-sky-500 rounded-full"></div>
        </div>
      </div>

      {/* What It Is */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What It Is
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg pl-7">
          {passion.whatItIs}
        </p>
      </div>

      {/* Why It Fits You */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why This Fits You
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
          {passion.whyItFits}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTryPassion}
        disabled={isGenerating}
        className="bg-sky-500 text-white px-10 py-4 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-lg shadow-lg hover:shadow-xl"
      >
        {isGenerating ? 'Generating Action Plan...' : passion.detailedPlan ? 'Try This Career' : 'Try This Career'}
      </button>
    </div>
  )
}

