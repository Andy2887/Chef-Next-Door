'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-orange-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-900">Something went wrong!</CardTitle>
          <CardDescription className="text-orange-700">
            We encountered an unexpected error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Show error message in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-medium">Error Details:</p>
              <p className="text-red-700 text-sm mt-1">{error.message}</p>
              {error.digest && (
                <p className="text-red-600 text-xs mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={reset}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Home className="h-4 w-4 mr-2" />
                Go home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}