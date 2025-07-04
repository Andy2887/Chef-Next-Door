"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChefHat, Clock, Users, Star, Heart, Sparkles } from "lucide-react"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import LoadingScreen from "@/components/ui/loading-screen"

type Recipe = {
  id: string
  chef_id: string
  title: string
  description: string | null
  ingredients: string[]
  instructions: string[]
  featured: boolean
  prep_time: number | null
  cook_time: number | null
  servings: number | null
  difficulty_level: string | null
  cuisine_type: string | null
  tags: string[]
  image_url: string | null
  rating: number
  total_reviews: number
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  }
}

export default function RecipesDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('recipes')
        .select(`*, profiles:chef_id(id, first_name, last_name, avatar_url)`)
        .order('created_at', { ascending: false })
      if (!error && data) {
        setRecipes(data as Recipe[])
      }
      setLoading(false)
    }
    fetchRecipes()
  }, [])

  const featuredRecipes = recipes.filter((r) => r.featured)
  const latestRecipes = recipes.filter((r) => !r.featured)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link href={`/recipes/${recipe.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 hover:scale-[1.02] group h-full">
        <div className="relative overflow-hidden">
          <Image
            src={recipe.image_url || "/placeholder.svg"}
            alt={recipe.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-orange-900">{recipe.rating}</span>
          </div>
          <div className="absolute top-3 left-3">
            <Badge className={getDifficultyColor(recipe.difficulty_level || "")}>
              {recipe.difficulty_level ? 
                recipe.difficulty_level.charAt(0).toUpperCase() + recipe.difficulty_level.slice(1).toLowerCase() : 
                "Unknown"
              }
            </Badge>
          </div>
          {recipe.featured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-[#e85d04] text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-900 line-clamp-2 group-hover:text-orange-700 transition-colors">
            {recipe.title}
          </CardTitle>
          <CardDescription className="text-orange-600 line-clamp-2">
            {recipe.description}
          </CardDescription>
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipe.profiles?.avatar_url ?? undefined} alt={recipe.profiles?.first_name ?? undefined} />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                {`${recipe.profiles?.first_name ?? ""}${recipe.profiles?.last_name ? " " + recipe.profiles.last_name[0] : ""}`.trim()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-orange-600">
              by {recipe.profiles?.first_name} {recipe.profiles?.last_name}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4 text-sm text-orange-700">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cook_time} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{recipe.total_reviews}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag: string) => (
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
  )

  if (loading) {
    return <LoadingScreen message="Loading recipes..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-kitchen.png')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-orange-900 mb-4">Browse Recipes</h1>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto">
              Discover amazing recipes from our community of passionate home chefs
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Recipes Section */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 bg-clip-text text-transparent mb-2">Featured Recipes</h2>
              <p className="text-orange-700">Hand-picked favorites from our community</p>
              <div className="flex items-center justify-center gap-3 my-4">
                <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-20"></div>
                <div className="relative">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-20"></div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Latest Recipes Section */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <div>
              <h2 className="text-4xl font-bold text-orange-900 mb-2">Latest Recipes</h2>
              <p className="text-orange-700">Fresh recipes from our newest contributors</p>
              <hr className="mt-4 border-orange-200 w-24 mx-auto" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-white border-t border-orange-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-orange-900 mb-4">Never Miss a Recipe</h2>
          <p className="text-orange-700 mb-8 max-w-2xl mx-auto">
            Get the latest recipes and cooking tips delivered straight to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <Input placeholder="Enter your email" className="border-orange-200 focus:border-orange-400" />
            <Button className="bg-[#e85d04] hover:bg-orange-700 text-white">Subscribe</Button>
          </div>
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
