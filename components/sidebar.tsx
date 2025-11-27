"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BarChart3, Package, ShoppingCart, FileText, LogOut } from "lucide-react"

interface Profile {
  business_name: string
  email: string
}

export default function Sidebar({
  profile,
  currentPage,
  onPageChange,
}: {
  profile: Profile | null
  currentPage: string
  onPageChange: (page: string) => void
}) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "purchases", label: "Purchases", icon: ShoppingCart },
    { id: "orders", label: "Orders", icon: FileText },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Bouquet</h1>
        <p className="text-sm text-sidebar-accent-foreground mt-1">{profile?.business_name || "Business Dashboard"}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <p className="text-xs text-sidebar-accent-foreground px-2">{profile?.email}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/30 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
