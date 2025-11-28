"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface Purchase {
  id: string
  supplier_name: string
  quantity: number
  cost: number
  purchase_date: string
  status: string
  notes?: string
}

export default function PurchasesPage({
  purchases: initialPurchases,
  userId,
}: {
  purchases: Purchase[]
  userId: string
}) {
  const [purchases, setPurchases] = useState(initialPurchases)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    supplier_name: "",
    quantity: 0,
    cost: 0,
    status: "pending",
    notes: "",
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
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  }

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.supplier_name || formData.quantity <= 0 || formData.cost <= 0) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const result = await apiCall("POST", "purchases", {
        user_id: userId,
        ...formData,
        purchase_date: new Date().toISOString(),
      })

      if (result[0]) {
        setPurchases([...purchases, result[0]])
        setFormData({
          supplier_name: "",
          quantity: 0,
          cost: 0,
          status: "pending",
          notes: "",
        })
        setIsAdding(false)
      }
    } catch (error) {
      alert("Error adding purchase: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleDeletePurchase = async (id: string) => {
    try {
      const token = localStorage.getItem("supabase.auth.token")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      await fetch(`${supabaseUrl}/rest/v1/purchases?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseKey,
        },
      })

      setPurchases(purchases.filter((p) => p.id !== id))
    } catch (error) {
      alert("Error deleting purchase: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Tracking</h1>
          <p className="text-muted-foreground mt-1">Manage supplier purchases and orders</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Purchase
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Log New Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPurchase} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Supplier Name *</label>
                  <Input
                    value={formData.supplier_name}
                    onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                    placeholder="e.g., ABC Flowers Co."
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Quantity *</label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    placeholder="0"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Cost (Rp) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
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
                    <option>shipped</option>
                    <option>delivered</option>
                    <option>cancelled</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="border-border"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-border">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Log Purchase
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Purchases List */}
      <div className="space-y-4">
        {purchases.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">No purchases yet. Log one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{purchase.supplier_name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">Quantity</p>
                          <p className="font-medium text-foreground">{purchase.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs">Cost</p>
                          <p className="font-medium text-foreground">Rp{purchase.cost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs">Status</p>
                          <p className="font-medium text-foreground capitalize">{purchase.status}</p>
                        </div>
                        <div>
                          <p className="text-xs">Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(purchase.purchase_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs">Unit Cost</p>
                          <p className="font-medium text-foreground">
                            Rp{(purchase.cost / purchase.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {purchase.notes && <p className="text-sm text-muted-foreground mt-2">Notes: {purchase.notes}</p>}
                    </div>
                    <Button
                      onClick={() => handleDeletePurchase(purchase.id)}
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
