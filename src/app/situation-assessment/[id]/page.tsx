import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatWrapper from './chat-wrapper'

interface AssessmentPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SituationAssessmentPage({ params }: AssessmentPageProps) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Await params in Next.js 15
  const { id } = await params

  // Fetch the specific conversation entry
  const { data: conversation, error } = await supabase
    .from('passion')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !conversation) {
    redirect('/dashboard')
  }

  // If stage is not situation_assessment, redirect to passion page
  if (conversation.stage === 'passion_discovery') {
    redirect(`/passion/${id}`)
  }

  // Parse chat messages from JSON
  const chatMessages = Array.isArray(conversation.assessment_chat) ? conversation.assessment_chat : []
  const isAssessmentDone = conversation.assessment_done || false

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pravay</h1>
          <p className="text-xs text-gray-500 mt-1">Situation Assessment</p>
        </div>
        <a 
          href="/dashboard" 
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          Back to Dashboard
        </a>
      </div>

      {/* Main Content - Full Height Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatWrapper 
          initialMessages={chatMessages} 
          conversationId={id}
          isAssessmentComplete={isAssessmentDone}
        />
      </div>
    </div>
  )
}

