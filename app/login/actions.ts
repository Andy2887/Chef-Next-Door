'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
    console.error('Login error:', error)
    return { error: error.message }
  }

  if (!authData.user) {
    return { error: 'Login failed' }
  }

  revalidatePath('/', 'layout')
  redirect('/recipes')
}