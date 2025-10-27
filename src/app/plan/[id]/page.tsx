import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PassionCard from './passion-card'

interface PlanPageProps {
  params: Promise<{
    id: string
  }>
}

interface Passion {
  name: string
  whatItIs: string
  whyItFits: string
  detailedPlan?: {
    testingPlan?: unknown
    successIndicators?: unknown
    obstacles?: unknown
    action24Hour?: unknown
    resources?: unknown
    realityCheck?: unknown
    decisionFramework?: unknown
  }
}

export default async function PlanPage({ params }: PlanPageProps) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Await params in Next.js 15
  const { id } = await params

  // Fetch the conversation with the plan
  const { data: conversation, error } = await supabase
    .from('passion')
    .select('plan')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !conversation) {
    redirect('/dashboard')
  }

  // Check if plan exists
  if (!conversation.plan) {
    redirect(`/passion/${id}`)
  }

  // Parse the JSON plan
  let passions: Passion[] = []
  try {
    const planData = JSON.parse(conversation.plan)
    passions = planData.passions || []
  } catch (e) {
    console.error('Error parsing plan:', e)
    redirect(`/passion/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <a 
            href="/dashboard" 
            className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors inline-flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
          <h1 className="text-4xl font-bold text-gray-900">Your Passion Discovery</h1>
          <p className="text-lg text-gray-600 mt-3">Explore your top 3 personalized passion matches</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="space-y-6">
          {passions.map((passion, index) => (
            <PassionCard
              key={index}
              passion={passion}
              index={index}
              conversationId={id}
            />
          ))}
        </div>

        {/* Empty State */}
        {passions.length === 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-16 text-center shadow-lg">
            <p className="text-gray-600 text-lg mb-4">No passions generated yet.</p>
            <a 
              href={`/passion/${id}`}
              className="text-gray-900 hover:underline font-medium text-lg"
            >
              Go back to chat
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

