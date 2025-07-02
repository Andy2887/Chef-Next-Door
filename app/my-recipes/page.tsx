"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChefHat,
  Clock,
  Users,
  Star,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Sparkles,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import Navigation from "@/components/Navigation"
import { SuccessNotification } from "@/components/ui/success-notification"
import { useRouter } from "next/navigation"

interface Recipe {
  id: string
  title: string
  description: string | null
  image_url: string | null
  cook_time: number | null
  prep_time: number | null
  servings: number | null
  rating: number
  total_reviews: number
  difficulty_level: string | null
  tags: string[] | null
  featured: boolean
  created_at: string
  updated_at: string
}

interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url: string | null
  bio: string | null
  rating: number
  total_reviews: number
  num_recipes: number
  created_at: string
}

export default function MyRecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          setError('Failed to load profile')
          return
        }

        setProfile(profileData)

        // Fetch user's recipes
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .eq('chef_id', user.id)
          .order('created_at', { ascending: false })

        if (recipesError) {
          console.error('Error fetching recipes:', recipesError)
          setError('Failed to load recipes')
          return
        }

        setRecipes(recipesData || [])
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
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

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else if (sortBy === "popular") {
      return (b.rating || 0) - (a.rating || 0)
    }
    return 0
  })

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`)
  }

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipeToDelete(recipeId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return

    setDeleting(true)
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated')
        return
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeToDelete)

      if (error) {
        console.error('Error deleting recipe:', error)
        setError('Failed to delete recipe')
        return
      }

      // Update profile recipe count in Supabase using the decrement function
      const { error: profileError } = await supabase.rpc('decrement_recipe_count', {
        user_id: user.id
      })
      
      if (profileError) {
        console.error('Error updating profile recipe count:', profileError)
        // Don't fail the deletion if profile update fails
      }

      // Remove recipe from state
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeToDelete))
      
      // Update profile recipe count in local state
      if (profile) {
        setProfile(prev => prev ? { ...prev, num_recipes: prev.num_recipes - 1 } : null)
      }

      // Show success notification
      setShowSuccessNotification(true)
      
      // Close dialog and reset state
      setDeleteDialogOpen(false)
      setRecipeToDelete(null)
    } catch (err) {
      console.error('Unexpected error deleting recipe:', err)
      setError('An unexpected error occurred while deleting recipe')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDeleteRecipe = () => {
    setDeleteDialogOpen(false)
    setRecipeToDelete(null)
  }

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 hover:scale-[1.02] group h-full cursor-pointer">
        <div className="relative overflow-hidden">
          <Image
            src={recipe.image_url || "/placeholder.svg"}
            alt={recipe.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            {recipe.featured && (
              <Badge className="bg-[#e85d04] text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          {recipe.difficulty_level && (
            <div className="absolute top-3 left-3">
              <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                {recipe.difficulty_level.charAt(0).toUpperCase() + recipe.difficulty_level.slice(1)}
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  handleViewRecipe(recipe.id)
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Recipe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Recipe
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={(e) => {
                  e.preventDefault()
                  handleDeleteRecipe(recipe.id)
                }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Recipe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-900 line-clamp-2 group-hover:text-orange-700 transition-colors">
            {recipe.title}
          </CardTitle>
          <CardDescription className="text-orange-600 line-clamp-2">
            {recipe.description || "No description available"}
          </CardDescription>
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
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{recipe.rating?.toFixed(1) || "0.0"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
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
          <div className="text-xs text-orange-500">
            Created {new Date(recipe.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4 animate-pulse" />
          <p className="text-orange-700">Loading your recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#e85d04] hover:bg-orange-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  // Calculate total likes from mock data since it's not in database
  const totalLikes = recipes.length * 45 // Mock calculation
  const totalViews = recipes.length * 234 // Mock calculation

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-kitchen.png')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={`${profile.first_name} ${profile.last_name}`} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold text-orange-900 mb-2">
                    {profile.first_name} {profile.last_name}&apos;s Recipes
                  </h1>
                </div>
              </div>
              <Link href="/create">
                <Button className="bg-[#e85d04] hover:bg-orange-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Recipe
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-900">{profile.num_recipes}</div>
                  <div className="text-sm text-orange-600">Total Recipes</div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-900">{totalLikes}</div>
                  <div className="text-sm text-orange-600">Total Likes</div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-900">{profile.total_reviews}</div>
                  <div className="text-sm text-orange-600">Total Reviews</div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-900">{totalViews}</div>
                  <div className="text-sm text-orange-600">Total Views</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
              <Input
                placeholder="Search your recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400 bg-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                onClick={() => setSortBy("newest")}
                className={
                  sortBy === "newest"
                    ? "bg-[#e85d04] hover:bg-orange-700 text-white"
                    : "border-orange-300 text-orange-700 hover:bg-orange-100 bg-white"
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Newest
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                onClick={() => setSortBy("popular")}
                className={
                  sortBy === "popular"
                    ? "bg-[#e85d04] hover:bg-orange-700 text-white"
                    : "border-orange-300 text-orange-700 hover:bg-orange-100 bg-white"
                }
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Most Popular
              </Button>
            </div>
          </div>

          {/* Recipe Grid */}
          {sortedRecipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-orange-900 mb-2">No recipes found</h3>
                <p className="text-orange-700 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or create a new recipe."
                    : "You haven't created any recipes yet. Start sharing your culinary creations!"}
                </p>
                <Link href="/create">
                  <Button className="bg-[#e85d04] hover:bg-orange-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Recipe
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Recipe</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this recipe? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={cancelDeleteRecipe}
                disabled={deleting}
                className="bg-black text-white border-black hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteRecipe}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      <SuccessNotification
        message="Recipe deleted successfully!"
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
      />
    </div>
  )
}