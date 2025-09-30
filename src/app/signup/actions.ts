'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Get form data
  const firstName = formData.get('first_name') as string
  const age = formData.get('age') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate age
  const ageNum = parseInt(age)
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
    redirect('/signup?error=Please enter a valid age between 0 and 120')
  }

  // Validate password length
  if (password.length < 6) {
    redirect('/signup?error=Password must be at least 6 characters')
  }

  // Sign up the user with metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        age: ageNum,
      },
    },
  })

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  if (data.user) {
    // Check if session exists (email verification status)
    if (data.session) {
      // Email verification DISABLED - user is logged in immediately
      revalidatePath('/dashboard', 'layout')
      redirect('/dashboard')
    } else {
      // Email verification ENABLED - user needs to verify email first
      redirect('/signup/check-email?email=' + encodeURIComponent(email))
    }
  }

  redirect('/signup?error=Something went wrong')
}
