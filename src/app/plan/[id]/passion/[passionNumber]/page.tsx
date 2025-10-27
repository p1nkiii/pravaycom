import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface PassionDetailPageProps {
  params: Promise<{
    id: string
    passionNumber: string
  }>
}

export default async function PassionDetailPage({ params }: PassionDetailPageProps) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Await params in Next.js 15
  const { id, passionNumber } = await params

  // Validate passion number
  const passionNum = parseInt(passionNumber)
  if (isNaN(passionNum) || passionNum < 1 || passionNum > 3) {
    redirect(`/plan/${id}`)
  }

  // Fetch the conversation with the plan
  const { data: conversation, error } = await supabase
    .from('passion')
    .select('plan')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !conversation || !conversation.plan) {
    redirect('/dashboard')
  }

  // Parse the JSON plan
  let planData
  try {
    planData = JSON.parse(conversation.plan)
  } catch (e) {
    console.error('Error parsing plan:', e)
    redirect(`/plan/${id}`)
  }

  // Get the specific passion
  const passionIndex = passionNum - 1
  const passion = planData.passions?.[passionIndex]

  if (!passion) {
    redirect(`/plan/${id}`)
  }

  // Check if detailed plan exists
  const detailedPlan = passion.detailedPlan

  if (!detailedPlan) {
    // Detailed plan not generated yet, redirect to overview
    redirect(`/plan/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Link 
            href={`/plan/${id}`}
            className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors inline-flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Passions
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{passion.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{passion.whatItIs}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="space-y-12">
          
          {/* Beginner Project */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Your Beginner Project
              </h2>
            </div>
            
            {detailedPlan.beginnerProject && (
              <div className="bg-sky-50 rounded-xl p-8 border border-sky-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {detailedPlan.beginnerProject.name}
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <div>
                    <span className="font-semibold text-gray-900">What to build: </span>
                    <span>{detailedPlan.beginnerProject.description}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Why this tests it: </span>
                    <span>{detailedPlan.beginnerProject.whyThisTestsIt}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Indicators */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Indicators to Look For
              </h2>
            </div>
            
            {detailedPlan.indicators && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-sky-50 rounded-xl p-6 border-2 border-sky-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Signs You LOVE It
                  </h3>
                  <ul className="space-y-3">
                    {detailedPlan.indicators.positive?.map((signal: string, idx: number) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-3">
                        <span className="text-gray-900 font-bold mt-1">•</span>
                        <span className="leading-relaxed">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sky-50 rounded-xl p-6 border-2 border-sky-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Signs It&apos;s NOT For You
                  </h3>
                  <ul className="space-y-3">
                    {detailedPlan.indicators.negative?.map((signal: string, idx: number) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-3">
                        <span className="text-gray-900 font-bold mt-1">•</span>
                        <span className="leading-relaxed">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Action Plan */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Your Action Plan
              </h2>
            </div>
            
            {detailedPlan.actionPlan && (
              <div className="bg-sky-50 rounded-xl p-8 border border-sky-200">
                <div className="space-y-6">
                  {detailedPlan.actionPlan.schedule && (
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-sky-200">
                      <span className="font-bold text-gray-900 text-lg">Schedule: </span>
                      <span className="text-gray-700 text-lg">{detailedPlan.actionPlan.schedule}</span>
                    </div>
                  )}
                  
                  {detailedPlan.actionPlan.estimatedTime && (
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-sky-200">
                      <span className="font-bold text-gray-900 text-lg">Estimated Time: </span>
                      <span className="text-gray-700 text-lg">{detailedPlan.actionPlan.estimatedTime}</span>
                    </div>
                  )}

                  {detailedPlan.actionPlan.steps && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Steps:</h3>
                      <ol className="space-y-4">
                        {detailedPlan.actionPlan.steps.map((step: string, idx: number) => (
                          <li key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-sky-200 flex items-start gap-4">
                            <span className="font-bold text-white bg-sky-500 rounded-full w-8 h-8 flex items-center justify-center min-w-[32px]">{idx + 1}</span>
                            <span className="text-gray-700 leading-relaxed pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {detailedPlan.actionPlan.resources && detailedPlan.actionPlan.resources.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Resources & Tools Needed:</h3>
                      <ul className="space-y-2">
                        {detailedPlan.actionPlan.resources.map((resource: string, idx: number) => (
                          <li key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-sky-200 flex items-start gap-3">
                            <span className="text-gray-400 mt-1">→</span>
                            <span className="text-gray-700 leading-relaxed">{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 24-Hour Start */}
          <section className="bg-sky-500 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">
                Start Today - 24 Hour Action
              </h2>
            </div>
            
            {detailedPlan.action24Hour && (
              <div className="bg-white/10 rounded-xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div>
                    <span className="font-bold text-lg">What to do: </span>
                    <span className="text-lg">{detailedPlan.action24Hour.what}</span>
                  </div>
                  <div>
                    <span className="font-bold text-lg">How to do it: </span>
                    <span className="text-lg">{detailedPlan.action24Hour.how}</span>
                  </div>
                  <div>
                    <span className="font-bold text-lg">Why it matters: </span>
                    <span className="text-lg">{detailedPlan.action24Hour.why}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Career Possibilities */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Career Possibilities
              </h2>
            </div>
            
            {detailedPlan.careerPossibilities && (
              <div className="grid md:grid-cols-2 gap-6">
                {detailedPlan.careerPossibilities.map((career: { title: string; description: string }, idx: number) => (
                  <div key={idx} className="bg-sky-50 rounded-xl p-6 border-2 border-sky-200 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {career.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{career.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Back Button */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href={`/plan/${id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Explore Other Passions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
