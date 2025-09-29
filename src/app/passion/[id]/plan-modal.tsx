'use client'

import { useState, useEffect } from 'react'

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  passionId: string
  chatMessages: any[]
  existingPlan?: string
}

export default function PlanModal({ isOpen, onClose, passionId, chatMessages, existingPlan }: PlanModalProps) {
  const [plan, setPlan] = useState(existingPlan || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const generatePlan = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/passion/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passionId,
          chatMessages
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      const data = await response.json()
      setPlan(data.plan)
    } catch (error) {
      console.error('Error generating plan:', error)
      setError('Failed to generate your passion plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate plan when modal opens if no existing plan
  useEffect(() => {
    if (isOpen && !existingPlan && !plan && !isLoading) {
      generatePlan()
    }
  }, [isOpen, existingPlan, plan, isLoading])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Your Passion Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-600">Generating your personalized plan...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={generatePlan}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {plan && !isLoading && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br>') }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
