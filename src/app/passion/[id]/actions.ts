'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const passionId = formData.get('passionId') as string
  const message = formData.get('message') as string

  if (!passionId || !message) {
    throw new Error('Missing required fields')
  }

  // Fetch the current passion entry
  const { data: passion, error: fetchError } = await supabase
    .from('passion')
    .select('chat')
    .eq('id', passionId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !passion) {
    throw new Error('Passion entry not found')
  }

  // Parse existing chat or initialize empty array
  const existingChat = Array.isArray(passion.chat) ? passion.chat : []
  
  // Add new user message
  const userMessage = {
    role: "user",
    content: message
  }

  // Generate fake AI response based on conversation length
  const aiResponses = [
    "That's really interesting! What specifically draws you to that?",
    "I can hear the passion in your response. What makes you feel most energized when you're doing this?",
    "That sounds fulfilling. How did you first discover this interest?",
    "I'm noticing some patterns here. What other activities give you that same feeling?",
    "That's wonderful! What would you say is the most rewarding part of this for you?",
    "I can tell this means a lot to you. What would you like to explore further in this area?",
    "That's fascinating! How do you see this fitting into your long-term goals?",
    "I'm getting a clear picture of what drives you. What other areas of your life connect to this passion?",
    "That's really insightful! What would you say are your core values around this?",
    "I can see the connection now. What would you like to do next with this passion?"
  ]

  const aiResponse = aiResponses[existingChat.length % aiResponses.length]

  const aiMessage = {
    role: "assistant", 
    content: aiResponse
  }

  // Update chat with both user and AI messages
  const updatedChat = [...existingChat, userMessage, aiMessage]

  // Update the passion entry with new chat
  const { error: updateError } = await supabase
    .from('passion')
    .update({ 
      chat: updatedChat,
      updated_at: new Date().toISOString()
    })
    .eq('id', passionId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Error updating chat:', updateError)
    throw new Error('Failed to save message')
  }
}
