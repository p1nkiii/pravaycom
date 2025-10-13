'use client'

import { useState } from 'react'
import ClientChat from './client-chat'
import { completeAssessment } from './actions'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWrapperProps {
  initialMessages: Message[]
  conversationId: string
  isAssessmentComplete: boolean
}

export default function ChatWrapper({ 
  initialMessages, 
  conversationId,
  isAssessmentComplete: initialAssessmentComplete
}: ChatWrapperProps) {
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(initialAssessmentComplete)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTransition = async () => {
    setIsTransitioning(true)
    // Note: completeAssessment redirects, which throws a Next.js redirect error
    // This is expected behavior, so we don't catch it
    await completeAssessment(conversationId)
  }

  return (
    <>
      <ClientChat 
        initialMessages={initialMessages} 
        conversationId={conversationId}
        onAssessmentComplete={() => setIsAssessmentComplete(true)}
        isAssessmentComplete={isAssessmentComplete}
      />
      
      {/* Transition Button - Active */}
      {isAssessmentComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Assessment Complete!</h3>
              <p className="text-sm text-gray-600 mt-1">Ready to discover your passion?</p>
            </div>
            <button
              onClick={handleTransition}
              disabled={isTransitioning}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{isTransitioning ? 'Preparing...' : 'Next: Discover Your Passion'}</span>
              {!isTransitioning && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

