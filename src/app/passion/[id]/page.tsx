import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientChat from './client-chat'
import PlanButton from './plan-button'

interface PassionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PassionIdPage({ params }: PassionPageProps) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Await params in Next.js 15
  const { id } = await params

  // Fetch the specific passion entry
  const { data: passion, error } = await supabase
    .from('passion')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !passion) {
    redirect('/dashboard')
  }

  // Parse chat messages from JSON
  const chatMessages = Array.isArray(passion.chat) ? passion.chat : []

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Pravay</h1>
        <a 
          href="/dashboard" 
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          Back to Dashboard
        </a>
      </div>

      {/* Main Content - Full Height Chat */}
      <div className="flex-1 overflow-hidden">
        <ClientChat 
          initialMessages={chatMessages} 
          passionId={id}
          isCompleted={passion.done}
        />
        
        {/* Access Plan Button - Shows when conversation is done */}
        {passion.done && (
          <PlanButton 
            passionId={id}
            chatMessages={chatMessages}
            existingPlan={passion.plan}
          />
        )}
      </div>
    </div>
  )
}
