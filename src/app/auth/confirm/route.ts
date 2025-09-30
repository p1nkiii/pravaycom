import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { type SupabaseClient } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function createUserProfile(supabase: SupabaseClient) {
  // Get the current user (now verified)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Extract data from user metadata
    const firstName = user.user_metadata?.first_name
    const age = user.user_metadata?.age
    
    // Check if profile already exists (prevent duplicates)
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (!existingProfile) {
      // Insert into user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          age: age,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // Don't throw error - user is still verified even if profile creation fails
      }
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // If it's an email verification, create profile and redirect to success page
      if (type === 'email') {
        await createUserProfile(supabase)
        redirect('/auth/verification-success')
      }
      // For all other types (password recovery, magic links, etc.), redirect to login
      // This forces users to go through the normal login flow instead of auto-dashboard access
      redirect('/login')
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}