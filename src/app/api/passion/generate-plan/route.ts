import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { passionId, chatMessages } = await request.json()

    if (!passionId || !chatMessages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert chat messages to OpenAI format
    const openaiMessages = chatMessages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    // System prompt for passion plan generation
    const systemPrompt = `You are a passion discovery expert. Generate a comprehensive passion analysis with this exact structure:

## 🎯 **YOUR PRIMARY PASSION: [Specific Name]**

**Why This Fits You Perfectly:**
- Start: "Based on our conversation, you really enjoy [observation]. Here's why [Passion] is your match:"
- **Personal Connection:** List 4-5 specific things from conversation
- **Deep Analysis:** 2-3 paragraphs on WHY this aligns with their energy, values, competence, curiosity
- **What This Means:** Personal insight about their nature and fulfillment

**Your Action Plan:**
- **Week 1 - Basics:** 2-3 specific beginner activities with exact resources
- **Week 2-3 - Projects:** 2-3 specific small projects with clear instructions  
- **Week 4 - Decision:** "After 3 weeks, you'll know if this is for you"

**How to Test:**
- **Week 1:** "Try [activity] and see if you feel energized"
- **Week 2-3:** "Do [project] and notice if you lose track of time"
- **Success Signs:** 3-4 specific indicators this passion is right

**Resources:**
- **Learn:** Specific platforms, courses, books, YouTube channels
- **Practice:** Communities, forums, local groups
- **Tools:** Software, equipment, materials (budget-friendly options)

## 🌟 **YOUR SECONDARY PASSION: [Name]**
**Why This Could Fit:** 1-2 paragraphs + 2-3 conversation connections
**Quick Test:** "Try [activity] for a week"
**Start Here:** 1-2 specific resources

## ⭐ **YOUR THIRD PASSION: [Name]**  
**Why This Might Work:** 1-2 paragraphs + 2-3 conversation connections
**Quick Test:** "Try [activity] and see how it feels"
**Start Here:** 1-2 specific resources

## 🚀 **Your Next Steps:**
- Start with primary passion (strongest match)
- If not right after 3 weeks, try secondary
- Keep third as backup
- You'll know within weeks if something energizes you

**Closing:** Tailor to their intent (career/hobby/life direction)

**Guidelines:**
- Be SPECIFIC: "Software Development" not "Technology"
- Use "you" and "your" frequently
- Conversational, encouraging tone
- Make passions actionable and specific

**Tone:** Like a trusted friend giving personal insights. Comprehensive and detailed.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...openaiMessages
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const generatedPlan = completion.choices[0]?.message?.content || "Unable to generate plan at this time."

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
