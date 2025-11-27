"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple redirect logic - check localStorage for auth token
    const token = localStorage.getItem("supabase.auth.token")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
