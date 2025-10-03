'use client'

import { useState } from 'react'

interface PlanViewerProps {
  plan: string
  conversationTitle: string
}

export default function PlanViewer({ plan, conversationTitle }: PlanViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
        className="text-gray-800 border border-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors"
      >
        View Plan
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Passion Plan</h2>
                <p className="text-sm text-gray-600 mt-1">{conversationTitle}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="prose max-w-none text-gray-800 whitespace-pre-wrap break-words">
                {plan}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

