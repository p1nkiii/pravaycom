'use client'

import { useState } from 'react'
import PlanModal from './plan-modal'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PlanButtonProps {
  passionId: string
  chatMessages: Message[]
  existingPlan?: string
}

export default function PlanButton({ passionId, chatMessages, existingPlan }: PlanButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-8 right-8 z-20">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors"
        >
          View Plan
        </button>
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        passionId={passionId}
        chatMessages={chatMessages}
        existingPlan={existingPlan}
      />
    </>
  )
}
