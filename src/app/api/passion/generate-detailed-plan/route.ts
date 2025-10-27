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

    const { conversationId, passionNumber } = await request.json()

    if (!conversationId || !passionNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate passionNumber (must be 1, 2, or 3)
    const passionNum = parseInt(passionNumber)
    if (passionNum < 1 || passionNum > 3) {
      return NextResponse.json({ error: 'Invalid passion number' }, { status: 400 })
    }

    // Fetch the conversation with BOTH chats and existing plan
    const { data: conversation, error: fetchError } = await supabase
      .from('passion')
      .select('assessment_chat, chat, plan')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Parse the plan to get the specific passion
    let planData
    try {
      planData = JSON.parse(conversation.plan)
    } catch {
      return NextResponse.json({ error: 'Invalid plan data' }, { status: 400 })
    }

    const passionIndex = passionNum - 1
    const targetPassion = planData.passions[passionIndex]

    if (!targetPassion) {
      return NextResponse.json({ error: 'Passion not found' }, { status: 404 })
    }

    // Check if detailed plan already exists for this passion
    if (targetPassion.detailedPlan) {
      return NextResponse.json({ 
        success: true,
        message: 'Detailed plan already exists'
      })
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

    // Combine both conversations
    const allMessages = [...assessmentMessages, ...passionMessages]

    // System prompt for detailed plan generation
    const systemPrompt = `Generate action plan for: "${targetPassion.name}".

You have: assessment (time, energy, constraints) + conversation + why it fits: "${targetPassion.whyItFits}"

Generate 5 sections:

1. BEGINNER PROJECT:
   - Small project to test this passion
   - What to build/do (specific)
   - Why this tests if it fits

2. INDICATORS:
   - Signs you LOVE it (4-5 feelings/behaviors)
   - Signs it's NOT for you (3-4 warnings)

3. ACTION PLAN:
   - Tailored to their schedule/time
   - Step-by-step to complete project
   - Include resources/tools needed (specific names, links if helpful)

4. 24-HOUR START:
   - ONE very specific task they can do immediately
   - Should take 15-30 minutes max
   - Must start the project

5. CAREER POSSIBILITIES:
   - 3-4 real job paths
   - Brief description

Output ONLY JSON:
{
  "beginnerProject": {
    "name": "...",
    "description": "...",
    "whyThisTestsIt": "..."
  },
  "indicators": {
    "positive": ["...", "..."],
    "negative": ["...", "..."]
  },
  "actionPlan": {
    "steps": ["...", "..."],
    "schedule": "...",
    "estimatedTime": "...",
    "resources": ["tool/resource 1", "link or name 2", ...]
  },
  "action24Hour": {
    "what": "Very specific task (15-30 min)",
    "how": "Step-by-step instructions",
    "why": "..."
  },
  "careerPossibilities": [
    { "title": "...", "description": "..." }
  ]
}

Keep it concise.`

    // Call OpenAI API with full conversations
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...allMessages
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const detailedPlanJson = completion.choices[0]?.message?.content || '{}'

    // Parse the detailed plan
    let detailedPlan
    try {
      detailedPlan = JSON.parse(detailedPlanJson)
    } catch (error) {
      console.error('Error parsing detailed plan JSON:', error)
      return NextResponse.json({ error: 'Failed to parse plan' }, { status: 500 })
    }

    // Update the plan JSON by adding detailedPlan to the specific passion
    planData.passions[passionIndex].detailedPlan = detailedPlan

    // Save updated plan back to database
    const { error: updateError } = await supabase
      .from('passion')
      .update({ 
        plan: JSON.stringify(planData),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating plan:', updateError)
      return NextResponse.json({ error: 'Failed to save detailed plan' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      detailedPlan
    })

  } catch (error) {
    console.error('Detailed plan generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

