"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, User, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function Navigation() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <Link href="/" className="text-2xl font-bold text-orange-800 hover:text-orange-900 transition-colors">
              Chef Next Door
            </Link>
          </div>
          {!loading && (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-orange-700 hover:text-orange-900 font-medium transition-colors">
                  Home
                </Link>
                <Link href="/my-recipes" className="text-orange-700 hover:text-orange-900 font-medium transition-colors">
                  My Recipes
                </Link>
                <Link href="/recipes" className="text-orange-700 hover:text-orange-900 font-medium transition-colors">
                  Browse Recipes
                </Link>
                <Link href="/create" className="text-orange-700 hover:text-orange-900 font-medium transition-colors">
                  Share Recipe
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                {user ? (
                  // Authenticated user
                  <div className="flex items-center space-x-3">
                    <Link href="/settings">
                      <Button
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-white/80 backdrop-blur-sm transition-all"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-white/80 backdrop-blur-sm transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  // Unauthenticated user
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-white/80 backdrop-blur-sm transition-all"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-all">
                        Join Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}