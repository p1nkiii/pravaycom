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
    } catch (e) {
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
    const assessmentMessages = assessmentChat.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content
    }))

    // Convert passion chat to OpenAI format
    const passionMessages = passionChat.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content
    }))

    // Combine both conversations
    const allMessages = [...assessmentMessages, ...passionMessages]

    // System prompt for detailed plan generation
    const systemPrompt = `You are a passion action plan expert. Generate a detailed, personalized action plan for the passion: "${targetPassion.name}".

You have access to:
1. The user's situation assessment (their context, goals, constraints)
2. Their passion discovery conversation (their interests, energy, values)
3. Why this passion fits them: "${targetPassion.whyItFits}"

Generate these 8 sections:

1. TAILORED TESTING PLAN (4 weeks):
   - Week 1: Specific activities considering their schedule/energy
   - Week 2: First real project
   - Week 3-4: Personal project they care about
   - Each week: What to do, when to do it (based on their constraints), what to notice

2. SUCCESS INDICATORS:
   - ✅ Signs this IS their passion (5-6 specific signals)
   - ❌ Signs this ISN'T their passion (4-5 warning signals)

3. COMMON OBSTACLES:
   - List 4-5 obstacles they'll likely face based on their situation
   - For each: Why it happens, how to handle it, specific action
   - Examples: time, skill doubts, money, getting stuck, lack of support

4. 24-HOUR ACTION PLAN:
   - ONE specific thing to do in next 24 hours
   - Make it tiny and achievable
   - Explain why it matters

5. RESOURCES & LINKS:
   - Learn: 3-4 specific courses/tutorials/videos (mention names, can say "search for X")
   - Practice: 2-3 communities/platforms/forums (be specific)
   - Tools: 3-4 free tools/software (actual names and what they're for)

6. REALITY CHECK:
   - Time to know if they like it
   - Time to get decent
   - Time to make money (if applicable)
   - Honest difficulty level
   - Cost to start

7. DECISION FRAMEWORK (After 4 weeks):
   - ✅ If they loved it: Next steps, how to level up
   - 😐 If they liked it but not obsessed: Questions to ask, variations to try
   - ❌ If it felt like work: What they learned, why it's valuable data

IMPORTANT:
- Use simple, everyday language
- Reference their specific situation from assessment (time, energy, constraints)
- Be realistic and honest
- Make everything actionable and specific
- Tailor the testing plan to THEIR schedule and energy level

Output ONLY valid JSON in this format:
{
  "testingPlan": {
    "week1": { "schedule": "...", "activities": "...", "whatToNotice": "..." },
    "week2": { "schedule": "...", "activities": "...", "whatToNotice": "..." },
    "week3_4": { "schedule": "...", "activities": "...", "whatToNotice": "..." }
  },
  "successIndicators": {
    "positive": ["signal 1", "signal 2", ...],
    "negative": ["signal 1", "signal 2", ...]
  },
  "obstacles": [
    { "name": "...", "why": "...", "solution": "...", "action": "..." }
  ],
  "action24Hour": {
    "what": "...",
    "how": "...",
    "why": "..."
  },
  "resources": {
    "learn": ["resource 1", "resource 2", ...],
    "practice": ["resource 1", "resource 2", ...],
    "tools": ["tool 1", "tool 2", ...]
  },
  "realityCheck": {
    "timeToKnow": "...",
    "timeToGetDecent": "...",
    "timeToMakeMoney": "...",
    "difficulty": "...",
    "costToStart": "..."
  },
  "decisionFramework": {
    "ifLoved": "...",
    "ifLiked": "...",
    "ifFeltLikeWork": "..."
  }
}

Do NOT include any text outside the JSON.`

    // Call OpenAI API with full conversations
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...allMessages
      ],
      temperature: 0.7,
      max_tokens: 2500
    })

    const detailedPlanJson = completion.choices[0]?.message?.content || '{}'

    // Parse the detailed plan
    let detailedPlan
    try {
      detailedPlan = JSON.parse(detailedPlanJson)
    } catch (e) {
      console.error('Error parsing detailed plan JSON:', e)
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

