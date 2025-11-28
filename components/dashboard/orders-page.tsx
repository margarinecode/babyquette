"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface Order {
  id: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  order_date: string
  total_price: number
  status: string
  description?: string
}

export default function OrdersPage({
  orders: initialOrders,
  userId,
}: {
  orders: Order[]
  userId: string
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    total_price: 0,
    status: "pending",
    description: "",
  })

  const apiCall = async (method: string, table: string, data?: any) => {
    const token = localStorage.getItem("supabase.auth.token")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
        Prefer: "return=representation",
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  }

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customer_name || formData.total_price <= 0) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const result = await apiCall("POST", "orders", {
        user_id: userId,
        ...formData,
        order_date: new Date().toISOString(),
      })

      if (result[0]) {
        setOrders([...orders, result[0]])
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          total_price: 0,
          status: "pending",
          description: "",
        })
        setIsAdding(false)
      }
    } catch (error) {
      alert("Error adding order: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleDeleteOrder = async (id: string) => {
    try {
      const token = localStorage.getItem("supabase.auth.token")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseKey,
        },
      })

      setOrders(orders.filter((o) => o.id !== id))
    } catch (error) {
      alert("Error deleting order: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-1">Track customer orders and deliveries</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Customer Name *</label>
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="John Doe"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="john@example.com"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <Input
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Price (Rp) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.total_price}
                    onChange={(e) => setFormData({ ...formData, total_price: Number(e.target.value) })}
                    placeholder="0.00"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option>pending</option>
                    <option>in-progress</option>
                    <option>completed</option>
                    <option>cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Order details..."
                    className="border-border"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-border">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">No orders yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">Amount</p>
                          <p className="font-medium text-foreground">Rp{order.total_price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs">Status</p>
                          <p
                            className={`font-medium capitalize ${
                              order.status === "completed"
                                ? "text-green-600"
                                : order.status === "pending"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {order.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs">Order Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(order.order_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs">Email</p>
                          <p className="font-medium text-foreground">{order.customer_email || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs">Phone</p>
                          <p className="font-medium text-foreground">{order.customer_phone || "—"}</p>
                        </div>
                      </div>
                      {order.description && (
                        <p className="text-sm text-muted-foreground mt-2">Description: {order.description}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDeleteOrder(order.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
