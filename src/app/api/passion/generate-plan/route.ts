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

    const { passionId } = await request.json()

    if (!passionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch the conversation with BOTH assessment and passion chats
    const { data: conversation, error: fetchError } = await supabase
      .from('passion')
      .select('assessment_chat, chat')
      .eq('id', passionId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Parse both conversations
    const assessmentChat = Array.isArray(conversation.assessment_chat) ? conversation.assessment_chat : []
    const passionChat = Array.isArray(conversation.chat) ? conversation.chat : []

    // Convert assessment chat to OpenAI format
    const assessmentMessages = assessmentChat.map((msg: { role: string; content: string }) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content
    }))

    // Convert passion chat to OpenAI format
    const passionMessages = passionChat.map((msg: { role: string; content: string }) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content
    }))

    // Combine both conversations (assessment first, then passion)
    const allMessages = [...assessmentMessages, ...passionMessages]

    // System prompt for passion overview generation
    const systemPrompt = `You are a passion discovery expert. Based on BOTH the situation assessment conversation AND the passion discovery conversation, identify the user's top 3 passions.

CRITICAL: Make passions SPECIFIC, REAL-WORLD, and ACTION-BASED. Avoid vague/abstract ideas like "Problem Solving," "Learning," or "Self-Improvement." Each passion must be something they can DO, CREATE, or EXPLORE.

Good examples: "Game Development," "Writing Personal Growth Blogs," "Designing Eco-Friendly Products," "Urban Photography," "Sustainable Cooking"
Bad examples: "Creativity," "Constant Learning," "Helping Others," "Technology"

For each passion, provide:

1. **Name**: Specific activity they can pursue (e.g., "Game Development" not "Technology")

2. **What It Is**: 2-3 sentences explaining what this passion actually involves. Keep it simple and clear.

3. **Why It Fits You**: 3-4 paragraphs explaining why this passion matches them personally. Include:
   - How it connects to their interests and energy (from passion chat)
   - How it matches their skills or background
   - How it fits their situation and constraints (from assessment chat)
   - Personal insight about what this means for them
   - Reference specific things they mentioned, but don't use direct quotes

IMPORTANT:
- Use simple, everyday language
- Each passion must be a specific real-world activity, not a trait or mindset
- Explain clearly why this matches based on what they shared in both conversations
- Make it personal and encouraging
- Be realistic about their situation (time, energy, constraints from assessment)

Output ONLY valid JSON in this exact format:
{
  "passions": [
    {
      "name": "Passion Name Here",
      "whatItIs": "2-3 sentences here...",
      "whyItFits": "3-4 paragraphs here with quotes and connections..."
    },
    {
      "name": "Second Passion",
      "whatItIs": "...",
      "whyItFits": "..."
    },
    {
      "name": "Third Passion",
      "whatItIs": "...",
      "whyItFits": "..."
    }
  ]
}

Do NOT include any text outside the JSON.`

    // Call OpenAI API with both conversations
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...allMessages
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const generatedPlan = completion.choices[0]?.message?.content || '{"passions":[]}'

    // Update the passion entry with the generated plan
    const { error: updateError } = await supabase
      .from('passion')
      .update({ 
        plan: generatedPlan,
        updated_at: new Date().toISOString()
      })
      .eq('id', passionId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating plan:', updateError)
      return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      plan: generatedPlan
    })

  } catch (error) {
    console.error('Plan generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
