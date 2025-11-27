"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import Sidebar from "@/components/sidebar"
import DashboardHome from "@/components/dashboard/dashboard-home"
import InventoryPage from "@/components/dashboard/inventory-page"
import PurchasesPage from "@/components/dashboard/purchases-page"
import OrdersPage from "@/components/dashboard/orders-page"

interface Profile {
  id: string
  business_name: string
  email: string
  phone?: string
}

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  cost_per_unit: number
  supplier?: string
}

interface Purchase {
  id: string
  supplier_name: string
  quantity: number
  cost: number
  purchase_date: string
  status: string
}

interface Order {
  id: string
  customer_name: string
  order_date: string
  total_price: number
  status: string
}

export default function DashboardClient({
  user,
  profile,
  inventory,
  purchases,
  orders,
}: {
  user: User
  profile: Profile | null
  inventory: InventoryItem[]
  purchases: Purchase[]
  orders: Order[]
}) {
  const [currentPage, setCurrentPage] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar profile={profile} currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {currentPage === "dashboard" && (
          <DashboardHome profile={profile} inventory={inventory} purchases={purchases} orders={orders} />
        )}
        {currentPage === "inventory" && <InventoryPage inventory={inventory} userId={user.id} />}
        {currentPage === "purchases" && <PurchasesPage purchases={purchases} userId={user.id} />}
        {currentPage === "orders" && <OrdersPage orders={orders} userId={user.id} />}
      </main>
    </div>
  )
}
