import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { type SupabaseClient } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function createUserProfile(supabase: SupabaseClient) {
  console.log('🔄 Starting createUserProfile function...')
  
  // Get the current user (now verified)
  const { data: { user } } = await supabase.auth.getUser()
  
  console.log('👤 User data:', user ? `Found user: ${user.email}` : 'No user found')
  
  if (user) {
    // Extract data from user metadata
    const firstName = user.user_metadata?.first_name
    const age = user.user_metadata?.age
    
    console.log('📋 User metadata:')
    console.log('- first_name:', firstName)
    console.log('- age:', age)
    console.log('- full metadata:', user.user_metadata)
    
    // Check if profile already exists (prevent duplicates)
    console.log('🔍 Checking if profile already exists...')
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    console.log('🔍 Profile check result:', existingProfile ? 'PROFILE EXISTS' : 'NO PROFILE FOUND')
    if (checkError) console.log('🔍 Profile check error:', checkError.message)
    
    if (!existingProfile) {
      console.log('💾 Creating new user profile...')
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
        console.error('❌ Error creating user profile:', profileError)
        // Don't throw error - user is still verified even if profile creation fails
      } else {
        console.log('✅ User profile created successfully for:', user.email)
      }
    } else {
      console.log('ℹ️ User profile already exists for:', user.email)
    }
  } else {
    console.log('❌ No user found - cannot create profile')
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  console.log('🔍 Email verification debug:')
  console.log('- token_hash:', token_hash ? 'EXISTS' : 'MISSING')
  console.log('- type:', type)
  console.log('- full URL:', request.url)

  if (token_hash && type) {
    const supabase = await createClient()

    console.log('🔄 Calling verifyOtp...')
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    console.log('✅ VerifyOtp result:', error ? `ERROR: ${error.message}` : 'SUCCESS')
    
    if (!error) {
      // If it's an email verification, create profile and redirect to success page
      if (type === 'email') {
        console.log('📧 Email verification detected, creating profile...')
        await createUserProfile(supabase)
        console.log('🎉 Redirecting to success page')
        redirect('/auth/verification-success')
      }
      // For all other types (password recovery, magic links, etc.), redirect to login
      // This forces users to go through the normal login flow instead of auto-dashboard access
      console.log('🔄 Non-email type, redirecting to login')
      redirect('/login')
    } else {
      console.log('❌ Verification error, redirecting to error page')
    }
  } else {
    console.log('❌ Missing token_hash or type, redirecting to error page')
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}