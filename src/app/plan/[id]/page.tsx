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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Passion Discovery</h1>
        <a 
          href="/dashboard" 
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors inline-flex items-center"
        >
          ← Back to Dashboard
        </a>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="space-y-8">
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
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <p className="text-gray-600 mb-4">No passions generated yet.</p>
            <a 
              href={`/passion/${id}`}
              className="text-gray-800 hover:underline font-medium"
            >
              Go back to chat
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

