"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ChefHat } from "lucide-react"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mock data for featured recipes
  const featuredRecipes = [
    {
      id: 1,
      title: "Grandma's Chocolate Chip Cookies",
      author: "Sarah Johnson",
      image: "/placeholder.svg?height=200&width=300",
      cookTime: "25 min",
      servings: 24,
      rating: 4.8,
      tags: ["Dessert", "Easy", "Family Favorite"],
    },
    {
      id: 2,
      title: "Homemade Pasta Carbonara",
      author: "Marco Rossi",
      image: "/placeholder.svg?height=200&width=300",
      cookTime: "20 min",
      servings: 4,
      rating: 4.9,
      tags: ["Italian", "Quick", "Comfort Food"],
    },
    {
      id: 3,
      title: "Fresh Garden Salad",
      author: "Emma Green",
      image: "/placeholder.svg?height=200&width=300",
      cookTime: "10 min",
      servings: 2,
      rating: 4.6,
      tags: ["Healthy", "Vegetarian", "Quick"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-800">Chef Next Door</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/recipes" className="text-orange-700 hover:text-orange-900 font-medium transition-colors">
                Browse Recipes
              </Link>
              <Link href="/create" className="text-orange-700 hover:text-orange-900 font-medium transition-colors">
                Share Recipe
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-white/80 backdrop-blur-sm transition-all"
              >
                Sign In
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-all">Join Now</Button>
            </div>
          </div>
        </div>
      </nav>

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
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 hover:scale-105 group"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-orange-900">{recipe.rating}</span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-900 line-clamp-2 group-hover:text-orange-700 transition-colors">
                    {recipe.title}
                  </CardTitle>
                  <CardDescription className="text-orange-600">by {recipe.author}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4 text-sm text-orange-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
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
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/recipes">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent px-8 py-3 text-lg transition-all hover:scale-105"
              >
                View All Recipes
              </Button>
            </Link>
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
