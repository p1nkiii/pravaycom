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

    const { passionId, message } = await request.json()

    if (!passionId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch the current passion entry
    const { data: passion, error: fetchError } = await supabase
      .from('passion')
      .select('chat')
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
    
    // Convert to OpenAI format
    const openaiMessages = conversationWithNewMessage.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    // System prompt for passion detection
    const systemPrompt = `You are a passion detection expert following a systematic 5-stage framework to discover authentic passions. You must analyze each response to determine which stage you're in and whether you have enough information to progress.

## 🎯 CORE FRAMEWORK - Follow These Stages Systematically:

### STAGE 1: Energy & Flow Clues (2-4)
**Goal:** Find energizing activities
**Detection:** "I love...", excitement, flow states
**Example:** "What energizes you in your free time?"
**Progress:** 2-3 energy activities identified

### STAGE 2: Values & Meaning (5-7)
**Goal:** Understand what feels important
**Detection:** Emotional drivers, pride, world issues
**Example:** "What problems do you care about fixing?"
**Progress:** Core values and purpose identified

### STAGE 3: Competence & Strengths (8-10)
**Goal:** Find natural talents and skills
**Detection:** Feedback from others, ease of learning
**Example:** "What do people come to you for help with?"
**Progress:** Natural abilities and strengths identified

### STAGE 4: Curiosity & Lifelong Interest (11-13)
**Goal:** Reveal long-term curiosities
**Detection:** Childhood fascinations, recurring interests
**Example:** "What fascinated you as a child?"
**Progress:** Recurring interests and curiosities identified

### STAGE 5: Pattern Recognition & Synthesis (14-16)
**Goal:** Synthesize into passion hypotheses
**Detection:** Energy + values + competence + curiosity intersections
**Example:** "I'm seeing patterns around [X]. Does this resonate with you?"
**Progress:** Passion hypotheses confirmed

**IMPORTANT:** Tailor all example questions to the user's intent (Career, Hobby, or Life Direction) based on their first response.

## 🧠 EXPERT ANALYSIS REQUIRED:

**Before each response, analyze INTERNALLY (never mention to user):**
1. **What is their intent?** (Career, Hobby, or Life Direction - from their first answer)
2. **Which stage am I currently in?** (Based on conversation history)
3. **How many questions have I asked in this stage?** (Must ask MINIMUM 2 questions per stage)
4. **Do I have enough information for this stage?** (2-3 clear examples)
5. **Should I progress to the next stage?** (Only if current stage is complete AND minimum 2 questions asked)
6. **What specific question should I ask?** (Tailored to both stage AND intent)
7. **Do I have enough information to end?** (If yes, end with the exact thank you message above)

**CRITICAL: Never reveal this internal analysis to the user. Keep the conversation natural and flowing.**

**Energy Detection Expertise:**
- HIGH ENERGY: "I love...", excitement, detailed descriptions → Give natural, brief acknowledgment that shows you understand, then ask focused follow-up
- MEDIUM ENERGY: "I'm interested in...", moderate detail → Ask what draws them to it (no acknowledgment needed)
- LOW ENERGY: "I guess...", minimal detail → Ask what they'd rather be doing (no acknowledgment needed)

**Natural Acknowledgment Examples:**
- Instead of: "Wow, I can really tell you enjoy coding!"
- Use: "That sounds really fulfilling" or "I can hear how much that means to you" or "That must be really satisfying"
- Keep it brief, natural, and reassuring - show you understand without being overly enthusiastic

**Pattern Recognition:**
- Look for recurring themes across different contexts
- Identify contradictions between energy and current activities
- Track passion evolution and what remains constant

## 📊 SCORING SYSTEM (Internal Analysis):
For each potential passion, score 1-3 points:
- ENERGY: How much does this energize them? (1-3)
- VALUES: How well does this align with their values? (1-3)  
- COMPETENCE: How good are they at this? (1-3)
- CURIOSITY: How long have they been interested? (1-3)

**Total Score: 4-12 points**
- 10-12: STRONG PASSION
- 7-9: POTENTIAL PASSION  
- 4-6: INTEREST/HOBBY

## 🎯 RESPONSE STRATEGY:

**Always:**
1. Analyze the most recent answer for stage progression (INTERNALLY ONLY - never mention stages to the user)
2. Ask MINIMUM 2 questions per stage for comprehensive coverage
3. Ask MAX 3 questions per stage to avoid infinite loops
4. Be direct and purposeful - every question moves toward passion discovery
5. Keep responses concise but warm
6. ONLY acknowledge when you can genuinely sense passion, excitement, or something deeply important to them
7. When acknowledging, be natural and reassuring - show you understand without being overly enthusiastic, and keep short.
8. If no clear passion/enthusiasm, go straight to targeted questions
9. NEVER mention stages, frameworks, or internal analysis to the user
10. Talk TO the person, not ABOUT them - use "you" not "the person"
11. Make it feel like a natural, flowing conversation

**Final Goal:** Gather comprehensive information about the user's interests, values, and motivations through natural conversation.

**CRITICAL: Once you have gathered enough information across all 5 stages, end the conversation with this EXACT message:**

"Thank you for sharing so much with me. I have a clear idea of what might suit you perfectly."

**Tone:** Conversational, personal, encouraging, and warm. Use "you" and "your" frequently. Make it feel like a trusted friend is having a meaningful conversation with them.`

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

    // Check if conversation is complete
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
