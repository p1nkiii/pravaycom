'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PlanButtonProps {
  passionId: string
  chatMessages: Message[]
  existingPlan?: string
}

export default function PlanButton({ passionId, existingPlan }: PlanButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGeneratePlan = async () => {
    // If plan already exists, just redirect
    if (existingPlan) {
      router.push(`/plan/${passionId}`)
      return
    }

    // Generate plan
    setIsGenerating(true)
    try {
      const csrf = document.cookie.split('; ').find((c) => c.startsWith('csrfToken='))?.split('=')[1] || ''
      const response = await fetch('/api/passion/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrf
        },
        body: JSON.stringify({
          passionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      // Redirect to plan page
      router.push(`/plan/${passionId}`)
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Failed to generate plan. Please try again.')
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-20">
      <button 
        onClick={handleGeneratePlan}
        disabled={isGenerating}
        className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : existingPlan ? 'View Career' : 'Generate Plan'}
      </button>
    </div>
  )
}
