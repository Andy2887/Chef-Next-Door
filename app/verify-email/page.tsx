"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, ArrowRight } from "lucide-react"
import Navigation from "@/components/Navigation"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Illustration */}
            <div className="space-y-8">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/hero-kitchen.png"
                    alt="Cooking illustration"
                    width={600}
                    height={400}
                    className="w-full h-auto opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-orange-900">Welcome to Chef Next Door!</h2>
                <p className="text-lg text-orange-700 leading-relaxed">
                  You&apos;re just one step away from joining our amazing community of home chefs. We can&apos;t wait to see what
                  delicious recipes you&apos;ll share with us!
                </p>
              </div>
            </div>

            {/* Right Side - Verification Message */}
            <div className="w-full max-w-md mx-auto">
              <Card className="border-orange-200 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-orange-900">Check Your Email</CardTitle>
                  <CardDescription className="text-orange-600 text-lg">
                    We&apos;ve sent a verification link to your email address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-green-800 font-medium">Registration Successful!</p>
                        <p className="text-green-700 text-sm">Your account has been created successfully.</p>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-900">What&apos;s next?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-sm font-semibold">1</span>
                        </div>
                        <p className="text-orange-800">Check your email inbox (and spam folder)</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-sm font-semibold">2</span>
                        </div>
                        <p className="text-orange-800">Click the verification link in the email</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-sm font-semibold">3</span>
                        </div>
                        <p className="text-orange-800">Sign in and start sharing your recipes!</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/login">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold transition-all hover:scale-105">
                        Go to Login
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
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
