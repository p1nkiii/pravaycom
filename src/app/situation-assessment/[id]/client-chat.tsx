'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ClientChatProps {
  initialMessages: Message[]
  conversationId: string
  onAssessmentComplete?: () => void
  isAssessmentComplete?: boolean
}

export default function ClientChat({ 
  initialMessages, 
  conversationId, 
  onAssessmentComplete,
  isAssessmentComplete = false
}: ClientChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(isAssessmentComplete)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading || isComplete) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    }

    // Add user message immediately
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/situation-assessment/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': document.cookie.split('; ').find((c) => c.startsWith('csrfToken='))?.split('=')[1] || ''
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Add AI response if available
      if (data.success && data.aiMessage) {
        setMessages(prev => [...prev, data.aiMessage])
        
        // Check if assessment is complete
        if (data.assessmentComplete) {
          setIsComplete(true)
          onAssessmentComplete?.()
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Messages Area - Scrollable */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className={`space-y-6 ${isComplete ? 'pb-32' : ''}`}>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl ${
                message.role === 'user' 
                  ? 'bg-gray-800 text-white' 
                  : 'border border-gray-200 text-gray-800'
              } rounded-lg p-5`}>
                <div className="text-xs font-medium mb-2 opacity-70">
                  {message.role === 'user' ? 'You' : 'Pravay'}
                </div>
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="border border-gray-200 rounded-lg p-5 max-w-xl">
                <div className="text-xs font-medium mb-2 opacity-70 text-gray-800">Pravay</div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      {!isComplete && (
        <div className="border-t border-gray-200 bg-white">
          <div className="p-8">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 border border-gray-200 rounded-lg px-5 py-3 focus:outline-none focus:border-gray-800 transition-colors text-gray-800"
                disabled={isLoading}
                required
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

