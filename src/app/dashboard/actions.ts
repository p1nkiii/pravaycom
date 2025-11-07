'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function startTest() {
  const supabase = await createClient()
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current credits
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  const currentCredits = profile?.credits ?? 0

  // Guard: require at least 1 credit
  if (currentCredits < 1) {
    redirect('/dashboard?payment=required')
  }

  // Optimistic decrement to avoid race conditions
  const { data: afterDecrement } = await supabase
    .from('user_profiles')
    .update({
      credits: currentCredits - 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .eq('credits', currentCredits)
    .select('credits')

  // If no row was updated (credits changed meanwhile), re-check
  if (!afterDecrement || afterDecrement.length === 0) {
    const { data: recheck } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (!recheck || (recheck.credits ?? 0) < 1) {
      redirect('/dashboard?payment=required')
    }

    // Try one more time with the latest value
    const nextCredits = recheck.credits
    const { data: afterSecondTry } = await supabase
      .from('user_profiles')
      .update({
        credits: nextCredits - 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .eq('credits', nextCredits)
      .select('credits')

    if (!afterSecondTry || afterSecondTry.length === 0) {
      redirect('/dashboard?payment=required')
    }
  }

  // Insert a new entry into the passion table with initial conversation message
  const initialChat = [
    {
      role: "assistant" as const,
      content:
        "Hey! I'm excited to help you discover career paths that actually fit you. Before we dive in, tell me a bit about your current situation. Are you working, studying, or in between right now? Anything about your energy, time, or goals I should know before we dig into what excites you?",
    },
  ]

  const { data, error } = await supabase
    .from('passion')
    .insert({
      user_id: user.id,
      assessment_chat: [],
      assessment_started_at: new Date().toISOString(),
      chat: initialChat,
      done: false,
      plan: null
    })
    .select()

  if (error) {
    console.error('Error creating passion entry:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    // Attempt to refund the credit on failure
    const { data: latest } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    const creditsNow = latest?.credits ?? 0
    await supabase
      .from('user_profiles')
      .update({
        credits: creditsNow + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    throw new Error(`Failed to start test: ${error.message || 'Unknown error'}`)
  }

  // Redirect directly to the passion assessment conversation
  redirect(`/passion/${data[0].id}`)
}
