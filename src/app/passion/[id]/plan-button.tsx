'use client'

import { useState } from 'react'
import PlanModal from './plan-modal'

interface PlanButtonProps {
  passionId: string
  chatMessages: any[]
  existingPlan?: string
}

export default function PlanButton({ passionId, chatMessages, existingPlan }: PlanButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-20 right-8 z-20">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors"
        >
          Access Plan
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
