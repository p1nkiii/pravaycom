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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-5">
        <Link 
          href={`/plan/${id}`}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors inline-flex items-center mb-3"
        >
          ← Back to All Passions
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{passion.name}</h1>
        <p className="text-gray-600 mt-2">{passion.whatItIs}</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="space-y-10">
          
          {/* Testing Plan */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🗓️ Your 4-Week Testing Plan
            </h2>
            
            {detailedPlan.testingPlan && (
              <div className="space-y-6">
                {/* Week 1 */}
                {detailedPlan.testingPlan.week1 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Week 1</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Your Schedule: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week1.schedule}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">What to Do: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week1.activities}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">What to Notice: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week1.whatToNotice}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 2 */}
                {detailedPlan.testingPlan.week2 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Week 2</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Your Schedule: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week2.schedule}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">What to Do: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week2.activities}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">What to Notice: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week2.whatToNotice}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 3-4 */}
                {detailedPlan.testingPlan.week3_4 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Week 3-4</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Your Schedule: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week3_4.schedule}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">What to Do: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week3_4.activities}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">What to Notice: </span>
                        <span className="text-gray-600">{detailedPlan.testingPlan.week3_4.whatToNotice}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Success Indicators */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ Success Indicators
            </h2>
            
            {detailedPlan.successIndicators && (
              <div className="space-y-4">
                <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    ✅ Signs This IS Your Passion
                  </h3>
                  <ul className="space-y-2">
                    {detailedPlan.successIndicators.positive?.map((signal: string, idx: number) => (
                      <li key={idx} className="text-green-700 flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    ❌ Signs This ISN&apos;T Your Passion
                  </h3>
                  <ul className="space-y-2">
                    {detailedPlan.successIndicators.negative?.map((signal: string, idx: number) => (
                      <li key={idx} className="text-red-700 flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Obstacles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⚠️ Obstacles You&apos;ll Face
            </h2>
            
            {detailedPlan.obstacles && (
              <div className="space-y-4">
                {detailedPlan.obstacles.map((obstacle: { name: string; why: string; solution: string; action: string }, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {obstacle.name}
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      <div>
                        <span className="font-medium">Why it happens: </span>
                        <span>{obstacle.why}</span>
                      </div>
                      <div>
                        <span className="font-medium">How to handle it: </span>
                        <span>{obstacle.solution}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">Action: </span>
                        <span>{obstacle.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 24-Hour Action */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🎯 Do This in the Next 24 Hours
            </h2>
            
            {detailedPlan.action24Hour && (
              <div className="border-2 border-gray-800 bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-800">What to do: </span>
                    <span className="text-gray-700">{detailedPlan.action24Hour.what}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">How to do it: </span>
                    <span className="text-gray-700">{detailedPlan.action24Hour.how}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Why it matters: </span>
                    <span className="text-gray-700">{detailedPlan.action24Hour.why}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Resources */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔗 Resources & Links
            </h2>
            
            {detailedPlan.resources && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Learn the Basics</h3>
                  <ul className="space-y-2">
                    {detailedPlan.resources.learn?.map((resource: string, idx: number) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">→</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Practice & Build</h3>
                  <ul className="space-y-2">
                    {detailedPlan.resources.practice?.map((resource: string, idx: number) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">→</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Tools & Software</h3>
                  <ul className="space-y-2">
                    {detailedPlan.resources.tools?.map((resource: string, idx: number) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">→</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Reality Check */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💡 Reality Check
            </h2>
            
            {detailedPlan.realityCheck && (
              <div className="border border-gray-200 rounded-lg p-6 space-y-3 text-gray-700">
                <div>
                  <span className="font-medium">Time to know if you like it: </span>
                  <span>{detailedPlan.realityCheck.timeToKnow}</span>
                </div>
                <div>
                  <span className="font-medium">Time to get decent: </span>
                  <span>{detailedPlan.realityCheck.timeToGetDecent}</span>
                </div>
                <div>
                  <span className="font-medium">Time to make money: </span>
                  <span>{detailedPlan.realityCheck.timeToMakeMoney}</span>
                </div>
                <div>
                  <span className="font-medium">Difficulty level: </span>
                  <span>{detailedPlan.realityCheck.difficulty}</span>
                </div>
                <div>
                  <span className="font-medium">Cost to start: </span>
                  <span>{detailedPlan.realityCheck.costToStart}</span>
                </div>
              </div>
            )}
          </section>

          {/* Decision Framework */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📍 After 4 Weeks - Decision Time
            </h2>
            
            {detailedPlan.decisionFramework && (
              <div className="space-y-4">
                <div className="border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    ✅ If You Loved It
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{detailedPlan.decisionFramework.ifLoved}</p>
                </div>

                <div className="border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    😐 If You Liked It But Not Obsessed
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{detailedPlan.decisionFramework.ifLiked}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ❌ If It Felt Like Work
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{detailedPlan.decisionFramework.ifFeltLikeWork}</p>
                </div>
              </div>
            )}
          </section>

          {/* Back Button */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href={`/plan/${id}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Explore Other Passions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

