"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { login } from './actions'
import Navigation from "@/components/Navigation"
import { FailNotification } from "@/components/ui/fail-notification"

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showFailNotification, setShowFailNotification] = useState(false)
  const [failMessage, setFailMessage] = useState("")

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Create FormData for the login action
      const formDataForAction = new FormData()
      formDataForAction.append('email', formData.email)
      formDataForAction.append('password', formData.password)
      
      // Call the login action
      const result = await login(formDataForAction)
      
      // Check if there's an error from the login action
      if (result?.error) {
        setFailMessage(result.error)
        setShowFailNotification(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setFailMessage('Server Side Error. Please try again later.')
      setShowFailNotification(true)
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navigation />

      {/* Fail Notification */}
      <FailNotification
        message={failMessage}
        isVisible={showFailNotification}
        onClose={() => setShowFailNotification(false)}
        autoClose={true}
        duration={5000}
      />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-orange-900 leading-tight">Welcome Back to Your Kitchen</h1>
                <p className="text-xl text-orange-700 leading-relaxed">
                  Sign in to access your saved recipes, share new creations, and connect with fellow food enthusiasts.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-800">Access your personal recipe collection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-800">Share your culinary creations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-800">Connect with the cooking community</span>
                </div>
              </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="w-full max-w-md mx-auto">
              <Card className="border-orange-200 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-orange-900">Sign In</CardTitle>
                  <CardDescription className="text-orange-600">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-orange-800 font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={`pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                            errors.email ? "border-red-400" : ""
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-orange-800 font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className={`pl-10 pr-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                            errors.password ? "border-red-400" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                      <Link href="/forgot-password" className="text-orange-600 hover:text-orange-800 text-sm">
                        Forgot your password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#e85d04] hover:bg-orange-700 text-white py-3 text-lg font-semibold transition-all hover:scale-105"
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="mt-6 text-center">
                    <p className="text-orange-700">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="text-orange-600 hover:text-orange-800 font-semibold">
                        Sign up here
                      </Link>
                    </p>
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
