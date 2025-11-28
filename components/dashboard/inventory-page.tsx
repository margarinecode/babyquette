"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  cost_per_unit: number
  supplier?: string
}

export default function InventoryPage({
  inventory: initialInventory,
  userId,
}: {
  inventory: InventoryItem[]
  userId: string
}) {
  const [inventory, setInventory] = useState(initialInventory)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "Flowers",
    quantity: 0,
    unit: "stems",
    cost_per_unit: 0,
    supplier: "",
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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || formData.quantity <= 0 || formData.cost_per_unit <= 0) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const result = await apiCall("POST", "inventory", {
        user_id: userId,
        ...formData,
      })

      if (result[0]) {
        setInventory([...inventory, result[0]])
        setFormData({
          name: "",
          category: "Flowers",
          quantity: 0,
          unit: "stems",
          cost_per_unit: 0,
          supplier: "",
        })
        setIsAdding(false)
      }
    } catch (error) {
      alert("Error adding item: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem("supabase.auth.token")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      await fetch(`${supabaseUrl}/rest/v1/inventory?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseKey,
        },
      })

      setInventory(inventory.filter((item) => item.id !== id))
    } catch (error) {
      alert("Error deleting item: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track your flower materials and supplies</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Add New Inventory Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Item Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Red Roses"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option>Flowers</option>
                    <option>Greenery</option>
                    <option>Vases</option>
                    <option>Supplies</option>
                  </select>
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
                  <label className="block text-sm font-medium text-foreground mb-1">Unit</label>
                  <Input
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="stems, bunch, box"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Cost per Unit (Rp) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost_per_unit}
                    onChange={(e) => setFormData({ ...formData, cost_per_unit: Number(e.target.value) })}
                    placeholder="0.00"
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Supplier</label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                    className="border-border"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-border">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <div className="space-y-4">
        {inventory.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">No inventory items yet. Add one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {inventory.map((item) => (
              <Card key={item.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">Category</p>
                          <p className="font-medium text-foreground">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-xs">Quantity</p>
                          <p className="font-medium text-foreground">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs">Unit Cost</p>
                          <p className="font-medium text-foreground">Rp{item.cost_per_unit.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs">Total Value</p>
                          <p className="font-medium text-foreground">
                            Rp{(item.quantity * item.cost_per_unit).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {item.supplier && <p className="text-sm text-muted-foreground mt-2">Supplier: {item.supplier}</p>}
                    </div>
                    <Button
                      onClick={() => handleDeleteItem(item.id)}
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
