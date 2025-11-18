import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if profile already exists (prevent duplicates)
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()
      
      if (!existingProfile) {
        // Extract data from user metadata or OAuth provider data
        const firstName = data.user.user_metadata?.full_name?.split(' ')[0] || 
                         data.user.user_metadata?.name?.split(' ')[0] || 
                         data.user.email?.split('@')[0] || 
                         'User'
        
        // Insert into user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            first_name: firstName,
            age: null, // OAuth doesn't provide age, user can update later
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }
      
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Return the user to an error page with instructions if authentication failed
  return NextResponse.redirect(`${origin}/login?error=oauth_error&message=${encodeURIComponent('Failed to authenticate with Google')}`)
}

