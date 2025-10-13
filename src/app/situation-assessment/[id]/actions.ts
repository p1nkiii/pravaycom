'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function completeAssessment(conversationId: string) {
  const supabase = await createClient()
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the conversation
  const { data: conversation, error: fetchError } = await supabase
    .from('passion')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !conversation) {
    throw new Error('Conversation not found')
  }

  // Verify we're in the correct stage
  if (conversation.stage !== 'situation_assessment') {
    throw new Error('Invalid conversation stage')
  }

  // Get assessment chat history
  const assessmentChat = Array.isArray(conversation.assessment_chat) ? conversation.assessment_chat : []

  // Generate summary of assessment using OpenAI
  const conversationText = assessmentChat.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
  
  const summaryPrompt = `Summarize this situation assessment conversation in 2-3 concise sentences covering:
1. User's current life situation (work/study/transition)
2. Their motivation and goals
3. Key constraints or context

Conversation:
${conversationText}

Summary:`

  const summaryCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "user", content: summaryPrompt }
    ],
    temperature: 0.5,
    max_tokens: 150
  })

  const assessmentContext = summaryCompletion.choices[0]?.message?.content || "User completed situation assessment."

  // Initialize passion discovery chat with context-aware message
  const initialPassionChat = [
    {
      role: "assistant",
      content: "Great! Now let's explore what actually excites you. Are you here to figure out your career, hobbies, or just general life direction?"
    }
  ]

  // Update the conversation to passion discovery stage
  const { error: updateError } = await supabase
    .from('passion')
    .update({
      stage: 'passion_discovery',
      assessment_completed_at: new Date().toISOString(),
      assessment_context: assessmentContext,
      chat: initialPassionChat,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Error updating conversation:', updateError)
    throw new Error('Failed to transition to passion discovery')
  }

  // Redirect to passion discovery page
  redirect(`/passion/${conversationId}`)
}

