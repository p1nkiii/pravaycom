import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientChat from './client-chat'

interface PassionPageProps {
  params: {
    id: string
  }
}

export default async function PassionIdPage({ params }: PassionPageProps) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the specific passion entry
  const { data: passion, error } = await supabase
    .from('passion')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !passion) {
    redirect('/dashboard')
  }

  // Parse chat messages from JSON
  const chatMessages = Array.isArray(passion.chat) ? passion.chat : []

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Sticky at top */}
      <nav className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">PassionAI</h1>
            </div>
            <div className="flex items-center">
              <a 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full Height Chat */}
      <main className="h-[calc(100vh-4rem)]">
        <ClientChat 
          initialMessages={chatMessages} 
          passionId={params.id}
          isCompleted={passion.done}
        />
      </main>

    </div>
  )
}
