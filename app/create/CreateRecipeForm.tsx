"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Upload, Clock, Users, DiffIcon as Difficulty, Save, Eye, ImageIcon } from "lucide-react"
import Navigation from "@/components/Navigation"


export default function CreateRecipeForm() {
  const [ingredients, setIngredients] = useState([""])
  const [instructions, setInstructions] = useState([""])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  const addInstruction = () => {
    setInstructions([...instructions, ""])
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-kitchen.png')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-900 mb-4">Share Your Recipe</h1>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto">
              Share your culinary creations with our community of food lovers
            </p>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Basic Information</CardTitle>
                <CardDescription>Tell us about your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-orange-800">
                      Recipe Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Grandma's Chocolate Chip Cookies"
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-orange-800">
                      Category *
                    </Label>
                    <Select>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="main-course">Main Course</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-orange-800">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your recipe, what makes it special, and any background story..."
                    className="border-orange-200 focus:border-orange-400 min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prep-time" className="text-orange-800 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Prep Time (min)
                    </Label>
                    <Input
                      id="prep-time"
                      type="number"
                      placeholder="15"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cook-time" className="text-orange-800 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Cook Time (min)
                    </Label>
                    <Input
                      id="cook-time"
                      type="number"
                      placeholder="25"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings" className="text-orange-800 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Servings
                    </Label>
                    <Input
                      id="servings"
                      type="number"
                      placeholder="4"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-orange-800 flex items-center">
                      <Difficulty className="h-4 w-4 mr-1" />
                      Difficulty
                    </Label>
                    <Select>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Image */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Recipe Image</CardTitle>
                <CardDescription>Upload a beautiful photo of your finished dish</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Recipe preview"
                        width={400}
                        height={300}
                        className="mx-auto rounded-lg shadow-md max-h-64 object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                        onClick={() => setImagePreview(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-orange-700 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-orange-600">PNG, JPG, GIF up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Ingredients</CardTitle>
                <CardDescription>List all ingredients with quantities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g., 2 cups all-purpose flour"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Instructions</CardTitle>
                <CardDescription>Step-by-step cooking instructions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Describe this step in detail..."
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        className="border-orange-200 focus:border-orange-400 min-h-[80px]"
                      />
                    </div>
                    {instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="border-red-300 text-red-600 hover:bg-red-50 mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInstruction}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Tags</CardTitle>
                <CardDescription>Add tags to help others discover your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-700 px-3 py-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag (e.g., vegetarian, quick, comfort food)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="border-orange-200 focus:border-orange-400"
                  />
                  <Button type="button" onClick={addTag} className="bg-orange-600 hover:bg-orange-700 text-white">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-8">
              <Button
                type="button"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                  Publish Recipe
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
