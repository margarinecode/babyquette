"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, FileText, TrendingUp } from "lucide-react"

interface Profile {
  business_name: string
}

interface InventoryItem {
  quantity: number
  cost_per_unit: number
  name: string
  unit: string
  id: string
}

interface Purchase {
  cost: number
}

interface Order {
  total_price: number
  status: string
  id: string
}

export default function DashboardHome({
  profile,
  inventory,
  purchases,
  orders,
}: {
  profile: Profile | null
  inventory: InventoryItem[]
  purchases: Purchase[]
  orders: Order[]
}) {
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.quantity * item.cost_per_unit, 0)
  const totalPurchaseCost = purchases.reduce((sum, p) => sum + p.cost, 0)
  const totalOrderRevenue = orders.reduce((sum, o) => sum + o.total_price, 0)
  const pendingOrders = orders.filter((o) => o.status === "pending").length

  const stats = [
    {
      title: "Total Inventory Value",
      value: `Rp${totalInventoryValue.toFixed(2)}`,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Purchases",
      value: `Rp${totalPurchaseCost.toFixed(2)}`,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Order Revenue",
      value: `Rp${totalOrderRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {profile?.business_name}!</h1>
        <p className="text-muted-foreground">Here&apos;s your business overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest {Math.min(5, orders.length)} orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{order.id.substring(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground">Rp{order.total_price.toFixed(2)}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === "completed"
                        ? "bg-green-100/50 text-green-700"
                        : order.status === "pending"
                          ? "bg-yellow-100/50 text-yellow-700"
                          : "bg-gray-100/50 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
            <CardDescription>Total {inventory.length} items tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Rp{(item.quantity * item.cost_per_unit).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
