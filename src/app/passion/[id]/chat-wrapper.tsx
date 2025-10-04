'use client'

import { useState } from 'react'
import ClientChat from './client-chat'
import PlanButton from './plan-button'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWrapperProps {
  initialMessages: Message[]
  passionId: string
  isCompleted: boolean
  existingPlan?: string
}

export default function ChatWrapper({ 
  initialMessages, 
  passionId, 
  isCompleted,
  existingPlan 
}: ChatWrapperProps) {
  const [isChatCompleted, setIsChatCompleted] = useState(isCompleted)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  return (
    <>
      <ClientChat 
        initialMessages={initialMessages} 
        passionId={passionId}
        isCompleted={isCompleted}
        onCompletionChange={setIsChatCompleted}
        onMessagesChange={setMessages}
      />
      
      {/* Access Plan Button - Shows when conversation is done */}
      {isChatCompleted && (
        <PlanButton 
          passionId={passionId}
          chatMessages={messages}
          existingPlan={existingPlan}
        />
      )}
    </>
  )
}

