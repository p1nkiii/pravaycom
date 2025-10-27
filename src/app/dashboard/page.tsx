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
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Pravay</h1>
          <form action="/auth/logout" method="post">
            <button 
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-sky-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <PaymentMessage />

      {/* Main Dashboard */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          {/* Header Section */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-3">
              Welcome back, {firstName}
            </h2>
            <p className="text-xl text-gray-600">
              Continue your passion discovery journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">{credits}</div>
              <div className="text-sm text-gray-600 font-medium">Credits Available</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">{totalConversations}</div>
              <div className="text-sm text-gray-600 font-medium">Total Conversations</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">{completedConversations}</div>
              <div className="text-sm text-gray-600 font-medium">Completed</div>
            </div>
          </div>

          {/* Action Section */}
          <div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {hasCredits ? 'Ready to discover more?' : 'Get started with credits'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form action={startTest}>
                <button
                  type="submit"
                  disabled={!hasCredits}
                  className="bg-gray-900 text-white px-10 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900 w-full sm:w-auto text-lg"
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
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900">Recent Conversations</h3>
                <div className="text-sm text-gray-600 font-medium">
                  {passions.length} {passions.length === 1 ? 'conversation' : 'conversations'}
                </div>
              </div>
              
              <div className="space-y-4">
                {passions.slice(0, 6).map((passion) => (
                  <div key={passion.id} className="bg-sky-50 border-2 border-sky-200 rounded-xl p-6 hover:border-sky-400 hover:bg-sky-100 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <Link 
                        href={`/passion/${passion.id}`}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-sm text-gray-500 font-medium">
                            {new Date(passion.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          {passion.done && (
                            <div className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Complete
                            </div>
                          )}
                        </div>
                        <div className="text-gray-900 font-semibold text-lg group-hover:text-gray-700 line-clamp-2">
                          {passion.initial_answer || 'Passion Discovery Test'}
                        </div>
                      </Link>
                      
                      <div className="flex items-center gap-3">
                        {passion.plan && (
                          <PlanViewer 
                            plan={passion.plan}
                            conversationId={passion.id}
                          />
                        )}
                        <Link href={`/passion/${passion.id}`}>
                          <div className="text-gray-400 group-hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-16 text-center shadow-lg">
              <div className="text-gray-300 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No conversations yet</h3>
              <p className="text-gray-600 text-lg">
                Start your first conversation to begin discovering your passions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
