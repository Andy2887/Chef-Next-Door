'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type SignUpForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function signup(form: SignUpForm) {
  const supabase = await createClient()

  // Sign up the user
  const { data: authData, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  })

  if (error) {
    console.error('Signup error:', error)
    return { error: error.message }
  }

  if (!authData.user) {
    return { error: 'Signup failed' }
  }

  // Create profile in the database
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
    })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    if (profileError.message === 'duplicate key value violates unique constraint "profiles_email_key"'){
      return { error: 'Email already exists!' }
    }
    return { error: profileError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/verify-email')
}