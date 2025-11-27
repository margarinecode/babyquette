"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardClient from "./dashboard-client"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [inventory, setInventory] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("supabase.auth.token")
        const userData = localStorage.getItem("supabase.auth.user")

        if (!token || !userData) {
          router.push("/auth/login")
          return
        }

        const user = JSON.parse(userData)
        setUser(user)

        // Load all data from API
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        const headers = {
          Authorization: `Bearer ${token}`,
          apikey: supabaseKey,
        }

        const [profileRes, inventoryRes, purchasesRes, ordersRes] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/inventory?user_id=eq.${user.id}`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/purchases?user_id=eq.${user.id}`, { headers }),
          fetch(`${supabaseUrl}/rest/v1/orders?user_id=eq.${user.id}`, { headers }),
        ])

        const profileData = await profileRes.json()
        const inventoryData = await inventoryRes.json()
        const purchasesData = await purchasesRes.json()
        const ordersData = await ordersRes.json()

        setProfile(profileData?.[0] || null)
        setInventory(Array.isArray(inventoryData) ? inventoryData : [])
        setPurchases(Array.isArray(purchasesData) ? purchasesData : [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } catch (error) {
        console.log("[v0] Error loading data:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardClient user={user} profile={profile} inventory={inventory} purchases={purchases} orders={orders} />
}
