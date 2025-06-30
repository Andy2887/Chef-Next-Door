import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import CreateRecipeForm from "./CreateRecipeForm"

export default async function CreateRecipePage() {
  // Server-side authentication check
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // Pass user data to client component if needed
  return <CreateRecipeForm/>
}