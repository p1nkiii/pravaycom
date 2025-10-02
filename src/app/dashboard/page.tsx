import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { startTest } from './actions'
import Link from 'next/link'
import BuyButton from './buy-button'
import PaymentMessage from './payment-message'
import PlanViewer from './plan-viewer'

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

  const totalConversations = passions?.length || 0
  const completedConversations = passions?.filter(p => p.done).length || 0

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Pravay</h1>
        <form action="/auth/logout" method="post">
          <button 
            type="submit"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      <PaymentMessage />

      {/* Main Dashboard */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {firstName}.
            </h2>
            <p className="text-lg text-gray-600">
              Continue your passion discovery journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-3xl font-bold text-gray-800 mb-1">{credits}</div>
              <div className="text-sm text-gray-600">Credits Available</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-3xl font-bold text-gray-800 mb-1">{totalConversations}</div>
              <div className="text-sm text-gray-600">Total Conversations</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-3xl font-bold text-gray-800 mb-1">{completedConversations}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Action Section */}
          <div className="border border-gray-200 rounded-lg p-8 mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {hasCredits ? 'Ready to discover more?' : 'Get started with credits'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form action={startTest}>
                <button
                  type="submit"
                  disabled={!hasCredits}
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-800 w-full sm:w-auto"
                >
                  Start New Conversation
                </button>
              </form>
              <BuyButton />
            </div>
          </div>

          {/* Recent Conversations */}
          {passions && passions.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Recent Conversations</h3>
                <div className="text-sm text-gray-600">
                  {passions.length} {passions.length === 1 ? 'conversation' : 'conversations'}
                </div>
              </div>
              
              <div className="space-y-3">
                {passions.slice(0, 6).map((passion) => (
                  <div key={passion.id} className="border border-gray-200 rounded-lg p-5 hover:border-gray-800 transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <Link 
                        href={`/passion/${passion.id}`}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-sm text-gray-600">
                            {new Date(passion.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          {passion.done && (
                            <div className="inline-flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                              ✓ Complete
                            </div>
                          )}
                        </div>
                        <div className="text-gray-800 font-medium group-hover:text-gray-900 line-clamp-2">
                          {passion.initial_answer || 'Passion Discovery Conversation'}
                        </div>
                      </Link>
                      
                      <div className="flex items-center gap-3">
                        {passion.plan && (
                          <PlanViewer 
                            plan={passion.plan}
                            conversationTitle={passion.initial_answer || 'Passion Discovery Conversation'}
                          />
                        )}
                        <Link href={`/passion/${passion.id}`}>
                          <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!passions || passions.length === 0) && (
            <div className="border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No conversations yet</h3>
              <p className="text-gray-600">
                Start your first conversation to begin discovering your passions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
