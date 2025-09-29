'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function startTest() {
  const supabase = await createClient()
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Insert a new entry into the passion table with initial AI message
  const initialChat = [
    {
      role: "assistant",
      content: "Hi! I'm here to help you discover your passion through conversation. I'll ask you some personalized questions based on your responses. Are you looking to discover your passion for career purposes, hobbies, or just general life direction?"
    }
  ]

  const { data, error } = await supabase
    .from('passion')
    .insert({
      user_id: user.id,
      chat: initialChat,
      done: false,
      plan: null // or empty string, depending on your preference
    })
    .select()

  if (error) {
    console.error('Error creating passion entry:', error)
    throw new Error('Failed to start test')
  }

  // Redirect to the specific passion page
  redirect(`/passion/${data[0].id}`)
}
