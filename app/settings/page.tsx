"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
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
  Award,
} from "lucide-react"
import Navigation from "@/components/Navigation"
import ImageCropper from "@/components/ImageCropper"
import { SuccessNotification } from "@/components/ui/success-notification"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState("")
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    avatar_url: "",
    num_recipes: 0,
    rating: 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [profileError, setProfileError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Not logged in")
        return
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, bio, email, avatar_url, num_recipes, rating")
        .eq("id", user.id)
        .single()
      if (error) {
        setError("Failed to load profile")
      } else if (data) {
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          bio: data.bio || "",
          email: data.email || "",
          avatar_url: data.avatar_url || "",
          num_recipes: data.num_recipes ?? 0,
          rating: data.rating ?? 0,
        })
        setProfileImageUrl(data.avatar_url || "")
      }
    }
    fetchProfile()
  }, [])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setOriginalImageUrl(imageUrl)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
      setFile(file)
    }
  }

  const handleCropComplete = (croppedImageBlob: Blob) => {
    // Convert blob to file for upload
    const croppedFile = new File([croppedImageBlob], file?.name || 'cropped-avatar.jpg', {
      type: 'image/jpeg',
    })
    setFile(croppedFile)

    // Create preview URL for the cropped image
    const croppedImageUrl = URL.createObjectURL(croppedImageBlob)
    setProfileImageUrl(croppedImageUrl)
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setFile(null)
    setOriginalImageUrl("")
    // Clear the input value
    const fileInput = document.getElementById('profile-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Helper for uploading avatar
  const handleImageUpload = async () => {
    console.log("handleImageUpload triggered!");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user){
      console.log("User is not signed in");
      return;
    }
    if (file){
      console.log("Preparing to upload file!");
      const ext = file.name.split('.').pop();
      const uuid = crypto.randomUUID();
      const file_path = `users/${user.id}/profile_image/${uuid}.${ext}`;
      console.log("File path: ", file_path);
      const { error } = await supabase.storage.from('chef-next-door-images').upload(file_path, file);
      if (error){
        console.log("Error: ", error.message);
        throw error;
      }
      console.log("Image successfully uploaded to Supabase Storage! Retrieving public url...");
      const { data } = supabase.storage.from('chef-next-door-images').getPublicUrl(file_path);
      if (data.publicUrl){
        console.log("We get the URL! Saving to user profile")
        // Save the public URL to the user's profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: data.publicUrl })
          .eq("id", user.id)
        if (updateError) {
          throw updateError;
        }
        setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
        // Clean up object URL if it exists
        if (profileImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(profileImageUrl)
        }
        setProfileImageUrl(data.publicUrl);
        setFile(null);
        // Show success notification
        setShowSuccessNotification(true);
      }
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setProfileError("First name and last name are required.")
      return
    }
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Not logged in")
      setSaving(false)
      return
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: profile.bio,
        avatar_url: profileImageUrl,
      })
      .eq("id", user.id)
    if (updateError) {
      setError("Failed to update profile")
    } else {
      // Show success notification
      setShowSuccessNotification(true)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navigation />

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
                      <AvatarImage src={profileImageUrl} alt="Profile" />
                      <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">
                        {profile.firstName?.[0]?.toUpperCase() || ''}{profile.lastName?.[0]?.toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-[#e85d04] text-white rounded-full p-2 cursor-pointer hover:bg-orange-700 transition-colors shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  {file && (
                    <div className="flex flex-col gap-2 items-center">
                      <Button
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-white/80 backdrop-blur-sm transition-all"
                        type="button"
                        onClick={handleImageUpload}
                      >
                        Upload Avatar
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-700"
                        type="button"
                        onClick={() => {
                          setFile(null)
                          // Clean up object URL if it exists
                          if (profileImageUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(profileImageUrl)
                          }
                          setProfileImageUrl(profile.avatar_url)
                          // Clear the input value to allow selecting the same file again
                          const fileInput = document.getElementById('profile-upload') as HTMLInputElement
                          if (fileInput) {
                            fileInput.value = ''
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  <CardTitle className="text-orange-900">{profile.firstName} {profile.lastName}</CardTitle>
                  <CardDescription className="text-orange-600">{profile.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="font-semibold text-orange-900">{profile.num_recipes}</span>
                      </div>
                      <p className="text-xs text-orange-600">Recipes</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="font-semibold text-orange-900">{profile.rating}</span>
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
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-orange-800">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleProfileChange}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-orange-800">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleProfileChange}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-orange-800">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us about yourself and your cooking journey..."
                        className="border-orange-200 focus:border-orange-400 min-h-[100px]"
                      />
                    </div>
                    {profileError && <div className="text-red-600 text-sm">{profileError}</div>}
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    <Button className="bg-[#e85d04] hover:bg-orange-700 text-white" type="submit" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
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
                  <Button className="bg-[#e85d04] hover:bg-orange-700 text-white">
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
                      onClick={() => router.push('/my-recipes')}
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

      {/* Image Cropper Modal */}
      {showCropper && (
        <ImageCropper
          src={originalImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Success Notification */}
      <SuccessNotification
        message="Profile updated successfully!"
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
      />
    </div>
  )
}
