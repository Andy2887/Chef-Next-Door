'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  // Get form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Sign up the user
  const { data: authData, error } = await supabase.auth.signUp(data)
  
  if (error) {
    console.error('Login error:', error)
    return { error: error.message }
  }

  if (!authData.user) {
    return { error: 'Login failed' }
  }

  revalidatePath('/', 'layout')
  redirect('/verify-email')
}