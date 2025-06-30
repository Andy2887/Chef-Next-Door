"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChefHat, Clock, Users, Star, Search, Filter, Heart, TrendingUp, Sparkles } from "lucide-react"
import Navigation from "@/components/Navigation"

export default function RecipesDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("featured")

  // Mock data for featured recipes
  const featuredRecipes = [
    {
      id: "chocolate-chip-cookies",
      title: "Grandma's Chocolate Chip Cookies",
      description: "The perfect chewy cookies with crispy edges that everyone will love",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 25,
      prepTime: 15,
      servings: 24,
      rating: 4.8,
      reviewCount: 127,
      likes: 89,
      difficulty: "Easy",
      tags: ["Dessert", "Baking", "Family Favorite"],
      featured: true,
      createdAt: "2 days ago",
    },
    {
      id: "pasta-carbonara",
      title: "Authentic Italian Carbonara",
      description: "Creamy, rich pasta dish made with eggs, cheese, and pancetta",
      author: {
        name: "Marco Rossi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 20,
      prepTime: 10,
      servings: 4,
      rating: 4.9,
      reviewCount: 203,
      likes: 156,
      difficulty: "Medium",
      tags: ["Italian", "Pasta", "Quick"],
      featured: true,
      createdAt: "1 week ago",
    },
    {
      id: "avocado-toast",
      title: "Gourmet Avocado Toast",
      description: "Elevated avocado toast with poached egg and everything seasoning",
      author: {
        name: "Emma Green",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 10,
      prepTime: 5,
      servings: 2,
      rating: 4.6,
      reviewCount: 89,
      likes: 67,
      difficulty: "Easy",
      tags: ["Healthy", "Breakfast", "Vegetarian"],
      featured: true,
      createdAt: "3 days ago",
    },
    {
      id: "beef-stir-fry",
      title: "Asian Beef Stir Fry",
      description: "Quick and flavorful stir fry with tender beef and crisp vegetables",
      author: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 15,
      prepTime: 20,
      servings: 4,
      rating: 4.7,
      reviewCount: 145,
      likes: 98,
      difficulty: "Medium",
      tags: ["Asian", "Stir Fry", "Quick"],
      featured: true,
      createdAt: "5 days ago",
    },
  ]

  // Mock data for latest recipes
  const latestRecipes = [
    {
      id: "lemon-bars",
      title: "Tangy Lemon Bars",
      description: "Bright and citrusy bars with a buttery shortbread crust",
      author: {
        name: "Lisa Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 45,
      prepTime: 20,
      servings: 16,
      rating: 4.5,
      reviewCount: 34,
      likes: 28,
      difficulty: "Easy",
      tags: ["Dessert", "Citrus", "Baking"],
      featured: false,
      createdAt: "2 hours ago",
    },
    {
      id: "mushroom-risotto",
      title: "Creamy Mushroom Risotto",
      description: "Rich and creamy risotto with mixed wild mushrooms",
      author: {
        name: "Antonio Silva",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 35,
      prepTime: 15,
      servings: 4,
      rating: 4.8,
      reviewCount: 67,
      likes: 52,
      difficulty: "Hard",
      tags: ["Italian", "Vegetarian", "Comfort Food"],
      featured: false,
      createdAt: "5 hours ago",
    },
    {
      id: "chicken-tacos",
      title: "Spicy Chicken Tacos",
      description: "Flavorful chicken tacos with homemade salsa and guacamole",
      author: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 25,
      prepTime: 30,
      servings: 6,
      rating: 4.7,
      reviewCount: 91,
      likes: 73,
      difficulty: "Medium",
      tags: ["Mexican", "Spicy", "Dinner"],
      featured: false,
      createdAt: "8 hours ago",
    },
    {
      id: "blueberry-muffins",
      title: "Fluffy Blueberry Muffins",
      description: "Light and fluffy muffins bursting with fresh blueberries",
      author: {
        name: "Jennifer White",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 20,
      prepTime: 15,
      servings: 12,
      rating: 4.6,
      reviewCount: 78,
      likes: 61,
      difficulty: "Easy",
      tags: ["Breakfast", "Baking", "Berries"],
      featured: false,
      createdAt: "12 hours ago",
    },
    {
      id: "salmon-teriyaki",
      title: "Glazed Salmon Teriyaki",
      description: "Perfectly glazed salmon with homemade teriyaki sauce",
      author: {
        name: "Kenji Tanaka",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 20,
      prepTime: 10,
      servings: 4,
      rating: 4.9,
      reviewCount: 112,
      likes: 94,
      difficulty: "Medium",
      tags: ["Japanese", "Seafood", "Healthy"],
      featured: false,
      createdAt: "1 day ago",
    },
    {
      id: "vegetable-curry",
      title: "Coconut Vegetable Curry",
      description: "Aromatic curry with mixed vegetables in coconut milk",
      author: {
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=300&width=400",
      cookTime: 30,
      prepTime: 20,
      servings: 6,
      rating: 4.4,
      reviewCount: 56,
      likes: 42,
      difficulty: "Medium",
      tags: ["Indian", "Vegan", "Curry"],
      featured: false,
      createdAt: "1 day ago",
    },
  ]

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

  const RecipeCard = ({ recipe }: { recipe: any }) => (
    <Link href={`/recipes/${recipe.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 hover:scale-[1.02] group h-full">
        <div className="relative overflow-hidden">
          <Image
            src={recipe.image || "/placeholder.svg"}
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
            <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
          </div>
          {recipe.featured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-orange-600 text-white">
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
          <CardDescription className="text-orange-600 line-clamp-2">{recipe.description}</CardDescription>
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipe.author.avatar || "/placeholder.svg"} alt={recipe.author.name} />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                {recipe.author.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-orange-600">by {recipe.author.name}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4 text-sm text-orange-700">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{recipe.likes}</span>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-kitchen.png')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-orange-900 mb-4">Browse Recipes</h1>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto">
              Discover amazing recipes from our community of passionate home chefs
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                <Input
                  placeholder="Search recipes, ingredients, or chefs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <Button
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-white/80 backdrop-blur-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-orange-200">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("featured")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "featured" ? "bg-orange-600 text-white shadow-md" : "text-orange-700 hover:bg-orange-50"
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2 inline" />
                Featured Recipes
              </button>
              <button
                onClick={() => setActiveTab("latest")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "latest" ? "bg-orange-600 text-white shadow-md" : "text-orange-700 hover:bg-orange-50"
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2 inline" />
                Latest Recipes
              </button>
            </div>
          </div>
        </div>

        {/* Featured Recipes Section */}
        {activeTab === "featured" && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-orange-900 mb-2">Featured Recipes</h2>
                <p className="text-orange-700">Hand-picked favorites from our community</p>
              </div>
              <Badge className="bg-orange-100 text-orange-700 px-4 py-2">{featuredRecipes.length} recipes</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Recipes Section */}
        {activeTab === "latest" && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-orange-900 mb-2">Latest Recipes</h2>
                <p className="text-orange-700">Fresh recipes from our newest contributors</p>
              </div>
              <Badge className="bg-orange-100 text-orange-700 px-4 py-2">{latestRecipes.length} recipes</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent px-8 py-3 text-lg transition-all hover:scale-105"
          >
            Load More Recipes
          </Button>
        </div>
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
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">Subscribe</Button>
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
