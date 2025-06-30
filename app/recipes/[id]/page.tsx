"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Star, Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import Navigation from "@/components/Navigation"

export default function RecipeDetailPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [newComment, setNewComment] = useState("")

  // Mock recipe data
  const recipe = {
    id: 1,
    title: "Grandma's Chocolate Chip Cookies",
    description:
      "These are the most amazing chocolate chip cookies you'll ever taste! Passed down through generations, this recipe creates perfectly chewy cookies with crispy edges and gooey centers.",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Home baker and recipe enthusiast",
    },
    image: "/placeholder.svg?height=400&width=600",
    cookTime: 25,
    prepTime: 15,
    servings: 24,
    rating: 4.8,
    reviewCount: 127,
    likes: 89,
    tags: ["Dessert", "Easy", "Family Favorite", "Baking"],
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "¾ cup granulated sugar",
      "¾ cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips",
    ],
    instructions: [
      "Preheat your oven to 375°F (190°C). Line baking sheets with parchment paper.",
      "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
      "In a large bowl, cream together the softened butter and both sugars until light and fluffy, about 3-4 minutes.",
      "Beat in eggs one at a time, then add vanilla extract.",
      "Gradually mix in the flour mixture until just combined. Don't overmix.",
      "Fold in the chocolate chips until evenly distributed.",
      "Drop rounded tablespoons of dough onto prepared baking sheets, spacing them 2 inches apart.",
      "Bake for 9-11 minutes, or until edges are golden brown but centers still look slightly underbaked.",
      "Let cool on baking sheet for 5 minutes before transferring to a wire rack.",
    ],
    createdAt: "2 days ago",
  }

  // Mock comments data
  const comments = [
    {
      id: 1,
      author: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "These cookies turned out amazing! My kids absolutely loved them. I added a pinch of sea salt on top before baking - highly recommend!",
      createdAt: "1 day ago",
      likes: 5,
    },
    {
      id: 2,
      author: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "Perfect recipe! I've made these three times already. The texture is exactly what I was looking for - chewy with crispy edges.",
      createdAt: "3 days ago",
      likes: 8,
    },
  ]

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
                    <AvatarImage src={recipe.author.avatar || "/placeholder.svg"} alt={recipe.author.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {recipe.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-orange-900">{recipe.author.name}</p>
                    <p className="text-sm text-orange-600">{recipe.author.bio}</p>
                  </div>
                </div>

                {/* Recipe Stats */}
                <div className="flex items-center space-x-6 mb-6 text-orange-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-5 w-5" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span>
                      {recipe.rating} ({recipe.reviewCount} reviews)
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
                    {recipe.likes + (isLiked ? 1 : 0)}
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
                  src={recipe.image || "/placeholder.svg"}
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
                        <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <p className="text-orange-800 leading-relaxed">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comments ({comments.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this recipe..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-orange-200 focus:border-orange-400 min-h-[100px]"
                    />
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">Post Comment</Button>
                  </div>

                  <Separator className="bg-orange-200" />

                  {/* Comments List */}
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
              </Card>
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
                    <span className="font-semibold text-orange-900">{recipe.prepTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Cook Time</span>
                    <span className="font-semibold text-orange-900">{recipe.cookTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Total Time</span>
                    <span className="font-semibold text-orange-900">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Servings</span>
                    <span className="font-semibold text-orange-900">{recipe.servings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Difficulty</span>
                    <span className="font-semibold text-orange-900">Easy</span>
                  </div>
                </CardContent>
              </Card>

              {/* More from Author */}
              <Card className="border-orange-200">
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
