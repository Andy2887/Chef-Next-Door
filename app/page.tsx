"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ChefHat } from "lucide-react"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  type Recipe = {
    id: string
    title: string
    author?: string
    chef_id?: string
    image_url?: string | null
    cook_time?: number | null
    servings?: number | null
    rating?: number | null
    tags: string[]
    created_at?: string
    // add other fields as needed
  }
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchFeatured = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6)
      if (!error && data) setFeaturedRecipes(data)
    }
    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

      {/* Hero Section with Background Image */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-kitchen.png"
            alt="Friendly chef cooking in a warm kitchen"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/60 via-orange-800/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content with Scroll Animation */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div
                className="space-y-8 transition-all duration-300 ease-out"
                style={{
                  transform: `translateY(${scrollY * 0.5}px)`,
                  opacity: Math.max(0, 1 - scrollY / 400),
                }}
              >
                {/* Main Title */}
                <h1
                  className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight drop-shadow-2xl"
                  style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                  }}
                >
                  Your Kitchen,
                  <br />
                  <span className="text-orange-200">Your Stories</span>
                </h1>

                {/* Description */}
                <p
                  className="text-xl lg:text-2xl text-orange-100 leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
                  style={{
                    transform: `translateY(${scrollY * 0.4}px)`,
                  }}
                >
                  Share your favorite recipes, discover new flavors, and connect with fellow food lovers in our warm
                  community of home chefs.
                </p>

                {/* Action Buttons */}
                <div
                  className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
                  style={{
                    transform: `translateY(${scrollY * 0.6}px)`,
                  }}
                >
                  <Link href="/create">
                    <Button
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                    >
                      Start Cooking
                    </Button>
                  </Link>
                  <Link href="/recipes">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/80 text-white hover:bg-white hover:text-orange-800 px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      Browse Recipes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          style={{
            opacity: Math.max(0, 1 - scrollY / 200),
          }}
        >
          <div className="flex flex-col items-center space-y-2 text-white/80">
            <span className="text-sm font-medium drop-shadow">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-20 bg-white relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-orange-900 mb-6">Featured Recipes</h2>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto">
              Discover the most loved recipes from our community of passionate home cooks
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 hover:scale-105 group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={recipe.image_url || "/placeholder.svg"}
                      alt={recipe.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-orange-900">{recipe.rating ?? "-"}</span>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-900 line-clamp-2 group-hover:text-orange-700 transition-colors">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="text-orange-600">by {recipe.author ?? "Unknown"}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4 text-sm text-orange-700">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.cook_time ? `${recipe.cook_time} min` : "-"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings ? `${recipe.servings} servings` : "-"}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(recipe.tags || []).slice(0, 3).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 text-xs hover:bg-orange-200 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-kitchen.png')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-orange-900 mb-6">Join Our Cooking Community</h2>
          <p className="text-xl text-orange-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with passionate home cooks, share your culinary creations, and discover new favorites every day.
            Your next favorite recipe is just a click away.
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-105"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-orange-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <ChefHat className="h-6 w-6" />
                <span className="text-xl font-bold">Chef Next Door</span>
              </div>
              <p className="text-orange-200 leading-relaxed">
                Your personal cookbook platform for sharing and discovering amazing recipes from home chefs around the
                world.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Recipes</h3>
              <ul className="space-y-3 text-orange-200">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Popular
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Quick & Easy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Healthy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Community</h3>
              <ul className="space-y-3 text-orange-200">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Join Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Share Recipe
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tips & Tricks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-orange-200">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-800 mt-12 pt-8 text-center text-orange-200">
            <p>&copy; 2024 Chef Next Door. All rights reserved. Made with ❤️ for home cooks everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
