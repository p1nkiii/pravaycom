import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { startTest } from './actions'
import ConversationCard from './conversation-card'
import BuyButton from './buy-button'
import PaymentMessage from './payment-message'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's passion conversations
  const { data: passions, error } = await supabase
    .from('passion')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching passions:', error)
  }

  // Check user's credits
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits, total_purchased')
    .eq('id', user.id)
    .single()

  const credits = profile?.credits || 0
  const hasCredits = credits > 0

  // Get user's first name from user metadata
  const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">PassionAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <form action="/auth/logout" method="post">
                <button 
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentMessage />

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600">
            Continue your passion discovery journey or start a new conversation.
          </p>
        </div>

        {/* Quick Stats */}
        {passions && passions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{passions.length}</p>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">
                    {passions.filter(p => p.done).length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">
                    {passions.filter(p => !p.done).length}
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start New Conversation or Buy Credits */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 mb-8">
          <div className="text-center">
            {hasCredits ? (
              <>
                <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 mb-4">
                  <span className="text-white font-semibold">{credits} {credits === 1 ? 'Credit' : 'Credits'} Available</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to discover more about yourself?
                </h2>
                <p className="text-gray-300 mb-6">
                  Start a new conversation with our AI to explore your passions and interests.
                </p>
                <form action={startTest}>
                  <button 
                    type="submit"
                    className="bg-white text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Start New Conversation
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 mb-4">
                  <span className="text-white font-semibold">0 Credits Available</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎯 Unlock Your Passion Discovery Journey
                </h2>
                <p className="text-gray-300 mb-4">
                  Purchase credits to access AI-powered conversations that help you discover your true passions.
                </p>
                <ul className="text-gray-300 mb-6 text-left max-w-md mx-auto space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>1 Credit = 1 Complete Passion Discovery Session</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Personalized AI-guided conversation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Credits never expire</span>
                  </li>
                </ul>
                <BuyButton />
              </>
            )}
          </div>
        </div>

        {/* Recent Conversations */}
        {passions && passions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Conversations</h2>
            <div className="grid gap-4">
              {passions.slice(0, 5).map((passion, index) => (
                <ConversationCard 
                  key={passion.id}
                  passion={passion}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!passions || passions.length === 0) && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6">Start your first conversation to begin discovering your passions!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 PassionAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
