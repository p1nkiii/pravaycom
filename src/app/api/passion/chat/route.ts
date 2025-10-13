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

    const { passionId, message } = await request.json()

    if (!passionId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch the current passion entry (including assessment context)
    const { data: passion, error: fetchError } = await supabase
      .from('passion')
      .select('chat, stage, assessment_context')
      .eq('id', passionId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !passion) {
      return NextResponse.json({ error: 'Passion entry not found' }, { status: 404 })
    }

    // Verify we're in the passion discovery stage
    if (passion.stage !== 'passion_discovery') {
      return NextResponse.json({ error: 'Invalid conversation stage' }, { status: 400 })
    }

    // Parse existing chat or initialize empty array
    const existingChat = Array.isArray(passion.chat) ? passion.chat : []
    
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

    // Build system prompt with optional assessment context
    let contextPrefix = ''
    if (passion.assessment_context) {
      contextPrefix = `IMPORTANT CONTEXT FROM SITUATION ASSESSMENT:
${passion.assessment_context}

Use this context to tailor your questions and make the conversation more relevant to their specific situation, goals, and constraints. Reference their context naturally in your questions.

---

`
    }

    // System prompt for passion detection (condensed version)
    const systemPrompt = `${contextPrefix}You are a passion discovery expert. Guide a natural conversation (NOT a questionnaire) through 5 stages. Ask 15-20 questions total, 2-3 per stage. Tailor to user's intent (career/hobby/life direction) from their first answer.

5 STAGES:
1. ENERGY (2-3Q): What energizes them, flow states, excitement
2. VALUES (3-4Q): What feels meaningful, problems they care about
3. STRENGTHS (3-4Q): Natural talents, what people ask them for help with
4. CURIOSITY (3-4Q): Long-term interests, childhood fascinations
5. SYNTHESIS (3-4Q): Connect patterns, confirm passion hypotheses

Style: Conversational, warm, empathetic. Use simple, everyday language - avoid jargon or complex words. Acknowledge emotions naturally when you sense genuine passion ("That sounds really fulfilling"). Keep brief. Don't mention stages/framework. Use "you" not "the person".

Energy detection: High energy (detailed, excited) → brief acknowledgment + follow-up. Low energy (vague, "I guess") → ask what they'd rather do.

When you have enough info across all 5 stages, end with EXACTLY:
"Thank you for sharing so much with me. I have a clear idea of what might suit you perfectly."`

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

    const aiResponse = completion.choices[0]?.message?.content || "I'm here to help you discover your passions. What activities energize you most?"

    // Create AI message
    const aiMessage = {
      role: "assistant",
      content: aiResponse
    }

    // Update chat with both user and AI messages
    const updatedChat = [...conversationWithNewMessage, aiMessage]

    // Check if conversation is complete (fixed typo)
    const isConversationComplete = aiResponse.includes("Thank you for sharing so much with me. I have a clear idea of what might suit you perfectly.")

    // Update the passion entry with new chat and done status
    const { error: updateError } = await supabase
      .from('passion')
      .update({ 
        chat: updatedChat,
        done: isConversationComplete,
        updated_at: new Date().toISOString()
      })
      .eq('id', passionId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating chat:', updateError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      aiMessage 
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
