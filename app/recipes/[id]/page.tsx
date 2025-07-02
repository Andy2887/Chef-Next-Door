"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Textarea } from "@/components/ui/textarea"
// import { Separator } from "@/components/ui/separator"
import { Clock, Users, Star, Heart, Share2, Bookmark } from "lucide-react"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"

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
    bio?: string | null
  }
}

export default function RecipeDetailPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true)
      const supabase = createClient()
      // Get recipe id from URL
      const id = window.location.pathname.split("/").pop()
      if (!id) return
      const { data, error } = await supabase
        .from('recipes')
        .select(`*, profiles:chef_id(id, first_name, last_name, avatar_url, bio)`)
        .eq('id', id)
        .single()
      if (!error && data) {
        setRecipe(data as Recipe)
      }
      setLoading(false)
    }
    fetchRecipe()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!recipe) return <div>Recipe not found.</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Recipe Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-orange-600 mb-4">
              <Link href="/recipes" className="hover:text-orange-800">
                Recipes
              </Link>
              <span>/</span>
              <span className="text-orange-800">{recipe.title}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h1 className="text-4xl font-bold text-orange-900 mb-4">{recipe.title}</h1>
                <p className="text-lg text-orange-700 mb-6">{recipe.description}</p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={recipe.profiles?.avatar_url ?? undefined} alt={recipe.profiles?.first_name ?? undefined} />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {`${recipe.profiles?.first_name ?? ""}${recipe.profiles?.last_name ? " " + recipe.profiles.last_name[0] : ""}`.trim()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-orange-900">{recipe.profiles?.first_name} {recipe.profiles?.last_name}</p>
                    <p className="text-sm text-orange-600">{recipe.profiles?.bio}</p>
                  </div>
                </div>

                {/* Recipe Stats */}
                <div className="flex items-center space-x-6 mb-6 text-orange-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{recipe.cook_time} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-5 w-5" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span>
                      {recipe.rating} ({recipe.total_reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-700">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`border-orange-300 ${isLiked ? "bg-orange-100 text-orange-800" : "text-orange-700 hover:bg-orange-100"}`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    {recipe.total_reviews + (isLiked ? 1 : 0)}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsSaved(!isSaved)}
                    className={`border-orange-300 ${isSaved ? "bg-orange-100 text-orange-800" : "text-orange-700 hover:bg-orange-100"}`}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Recipe Image */}
              <div className="relative">
                <Image
                  src={recipe.image_url || "/placeholder.svg"}
                  alt={recipe.title}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ingredients */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">Ingredients</CardTitle>
                  <CardDescription>Everything you need to make this recipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="text-orange-800">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">Instructions</CardTitle>
                  <CardDescription>Step-by-step cooking guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="bg-[#e85d04] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <p className="text-orange-800 leading-relaxed">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Comments Section
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comments ({comments.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  Add Comment
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this recipe..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-orange-200 focus:border-orange-400 min-h-[100px]"
                    />
                    <Button className="bg-[#e85d04] hover:bg-orange-700 text-white">Post Comment</Button>
                  </div>

                  <Separator className="bg-orange-200" />

                  Comments List
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                            <AvatarFallback className="bg-orange-100 text-orange-700 text-sm">
                              {comment.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-orange-900">{comment.author}</span>
                              <span className="text-sm text-orange-600">{comment.createdAt}</span>
                            </div>
                            <p className="text-orange-800 leading-relaxed">{comment.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-0"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                {comment.likes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-0"
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recipe Info */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">Recipe Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Prep Time</span>
                    <span className="font-semibold text-orange-900">{recipe.prep_time} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Cook Time</span>
                    <span className="font-semibold text-orange-900">{recipe.cook_time} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Total Time</span>
                    <span className="font-semibold text-orange-900">{recipe.prep_time! + recipe.cook_time!} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Servings</span>
                    <span className="font-semibold text-orange-900">{recipe.servings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Difficulty</span>
                    <span className="font-semibold text-orange-900">{recipe.difficulty_level}</span>
                  </div>
                </CardContent>
              </Card>

              {/* More from Author */}
              {/* <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">More from {recipe.author.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/placeholder.svg?height=60&width=60"
                        alt="Recipe thumbnail"
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-orange-900">Banana Bread</h4>
                        <p className="text-sm text-orange-600">4.7 ★ • 45 min</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/placeholder.svg?height=60&width=60"
                        alt="Recipe thumbnail"
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-orange-900">Apple Pie</h4>
                        <p className="text-sm text-orange-600">4.9 ★ • 90 min</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                  >
                    View All Recipes
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
