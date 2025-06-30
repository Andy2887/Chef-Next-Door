import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import SignInForm from "./SignInForm"

export default async function LoginPage() {
  // Server-side authentication check
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser()

  if (data?.user) {
    redirect('/recipes')
  }
  return <SignInForm/>
}