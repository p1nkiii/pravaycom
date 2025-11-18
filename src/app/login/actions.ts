'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Handle specific error cases
    if (error.message.includes('Email not confirmed')) {
      redirect('/login?error=email_not_verified&message=' + encodeURIComponent('Please verify your email before logging in. Check your inbox for the verification link.'))
    }
    
    if (error.message.includes('Invalid login credentials')) {
      redirect('/login?error=invalid_credentials&message=' + encodeURIComponent('Invalid email or password'))
    }
    
    // Generic error fallback
    redirect('/login?error=auth_error&message=' + encodeURIComponent(error.message))
  }

  // Additional check: Verify email is confirmed
  if (authData.user && !authData.user.email_confirmed_at) {
    redirect('/login?error=email_not_verified&message=' + encodeURIComponent('Please verify your email before logging in. Check your inbox for the verification link.'))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=oauth_error&message=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}