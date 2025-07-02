import { ChefHat } from "lucide-react"

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <ChefHat className="h-16 w-16 text-orange-400 mx-auto mb-4 animate-pulse" />
        <p className="text-orange-700">{message}</p>
      </div>
    </div>
  )
}
