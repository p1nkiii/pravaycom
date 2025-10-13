import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Basic CSRF check: header must match cookie value
    const csrfHeader = request.headers.get('x-csrf-token') || ''
    const csrfCookie = request.cookies.get('csrfToken')?.value || ''
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const supabase = await createClient()
    
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, message } = await request.json()

    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch the current conversation entry
    const { data: conversation, error: fetchError } = await supabase
      .from('passion')
      .select('assessment_chat, stage')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Verify we're in the assessment stage
    if (conversation.stage !== 'situation_assessment') {
      return NextResponse.json({ error: 'Invalid conversation stage' }, { status: 400 })
    }

    // Parse existing chat or initialize empty array
    const existingChat = Array.isArray(conversation.assessment_chat) ? conversation.assessment_chat : []
    
    // Add new user message
    const userMessage = {
      role: "user",
      content: message
    }

    // Prepare conversation for OpenAI (including the new user message)
    const conversationWithNewMessage = [...existingChat, userMessage]
    
    // Convert to OpenAI format with proper typing
    const openaiMessages = conversationWithNewMessage.map(msg => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content
    }))

    // System prompt for situation assessment (condensed version)
    const systemPrompt = `You are a Life Situation Assessment Expert. Guide a warm, natural conversation (NOT a questionnaire) to understand the user's context before passion discovery.

Ask 8-10 questions across 4 stages:

1. CURRENT SITUATION (2-3Q): What they're doing, how they feel about it, stable or stuck
2. GOALS & MOTIVATION (2-3Q): Why they're here, what they hope to achieve  
3. CONSTRAINTS (2-3Q): Time, money, commitments, responsibilities
4. MINDSET (1-2Q): Energy level, outlook (excited vs overwhelmed)

Style: Conversational, empathetic, concise. Use simple, everyday language - avoid jargon or complex words. Acknowledge emotions naturally. Each question feels like genuine curiosity, not a checklist.

When you have enough info, end with EXACTLY:
"Thanks for sharing that with me — I have a good sense of where you're at and what you're looking for. Let's start exploring what actually lights you up."`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...openaiMessages
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const aiResponse = completion.choices[0]?.message?.content || "Tell me more about where you are in life right now."

    // Create AI message
    const aiMessage = {
      role: "assistant",
      content: aiResponse
    }

    // Update chat with both user and AI messages
    const updatedChat = [...conversationWithNewMessage, aiMessage]

    // Check if assessment is complete (trigger phrase detected)
    const isAssessmentComplete = aiResponse.includes("Let's start exploring what actually lights you up")

    // Update the conversation entry with new chat
    const { error: updateError } = await supabase
      .from('passion')
      .update({ 
        assessment_chat: updatedChat,
        assessment_done: isAssessmentComplete,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating assessment chat:', updateError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      aiMessage,
      assessmentComplete: isAssessmentComplete
    })

  } catch (error) {
    console.error('Assessment chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

