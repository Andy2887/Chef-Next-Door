"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChefHat,
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Settings,
  Heart,
  BookOpen,
  Users,
  Award,
} from "lucide-react"

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=120&width=120")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-800">Chef Next Door</span>
            </Link>
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

      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-kitchen.png')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-900 mb-4">Account Settings</h1>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto">Manage your profile and account preferences</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="border-orange-200 sticky top-24">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">SJ</AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-orange-600 text-white rounded-full p-2 cursor-pointer hover:bg-orange-700 transition-colors shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <CardTitle className="text-orange-900">Sarah Johnson</CardTitle>
                  <CardDescription className="text-orange-600">Home Baker & Recipe Enthusiast</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="font-semibold text-orange-900">23</span>
                      </div>
                      <p className="text-xs text-orange-600">Recipes</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="font-semibold text-orange-900">1.2k</span>
                      </div>
                      <p className="text-xs text-orange-600">Likes</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="font-semibold text-orange-900">456</span>
                      </div>
                      <p className="text-xs text-orange-600">Followers</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="font-semibold text-orange-900">4.8</span>
                      </div>
                      <p className="text-xs text-orange-600">Rating</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge className="w-full justify-center bg-orange-100 text-orange-700">
                      <Award className="h-3 w-3 mr-1" />
                      Top Contributor
                    </Badge>
                    <Badge className="w-full justify-center bg-amber-100 text-amber-700">
                      <Heart className="h-3 w-3 mr-1" />
                      Community Favorite
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Information */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and bio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-orange-800">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        defaultValue="Sarah"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-orange-800">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        defaultValue="Johnson"
                        className="border-orange-200 focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-orange-800">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="sarah.johnson@example.com"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-orange-800">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your cooking journey..."
                      defaultValue="Passionate home baker with over 10 years of experience. I love creating family-friendly recipes that bring people together around the dinner table."
                      className="border-orange-200 focus:border-orange-400 min-h-[100px]"
                    />
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Password Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Password & Security
                  </CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-orange-800">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        className="border-orange-200 focus:border-orange-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-800"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-orange-800">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className="border-orange-200 focus:border-orange-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-800"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-orange-800">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="border-orange-200 focus:border-orange-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-800"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-900 mb-2">Password Requirements:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number</li>
                      <li>• Contains at least one special character</li>
                    </ul>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common account actions and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <BookOpen className="h-6 w-6" />
                      <span>View My Recipes</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Heart className="h-6 w-6" />
                      <span>Saved Recipes</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Users className="h-6 w-6" />
                      <span>Following</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Mail className="h-6 w-6" />
                      <span>Messages</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="text-red-900 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    Irreversible actions that will affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator className="bg-red-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900">Log Out</h4>
                      <p className="text-sm text-red-700">Sign out of your account on this device</p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                  <Separator className="bg-red-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
