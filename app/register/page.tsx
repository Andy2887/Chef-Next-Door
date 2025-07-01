import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import RegisterForm from "./RegisterForm"

export default async function RegisterPage() {
  // Server-side authentication check
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser()

  if (data?.user) {
    redirect('/recipes')
  }
  return <RegisterForm/>
}