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
      .select('chat, done')
      .eq('id', passionId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !passion) {
      return NextResponse.json({ error: 'Passion entry not found' }, { status: 404 })
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

    // System prompt for a shorter passion discovery flow
    const systemPrompt = `You are an upbeat career discovery guide. Keep the conversation short and natural (about 8-10 total questions). Responses must be warm, plain language, and at most 4 sentences.

Conversation flow:
1. Current Situation (1-2 questions): confirm work/study status, time/energy, and goal for the career change. If the user already told you, acknowledge it and move on quickly.
2. Energy & Interests (2-3 questions): uncover what excites them, what they look forward to, and moments of flow.
3. Strengths & Evidence (2-3 questions): discover skills they use naturally and what others rely on them for.
4. Meaning & Fit (2-3 questions): dig into problems they care about, lifestyles they want, and constraints that matter.

Reference earlier answers briefly so the conversation feels connected. After each answer decide if you truly need another question; keep it efficient.

When you have enough insight to propose directions, summarise key takeaways, reflect them back, and end with EXACTLY:
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
