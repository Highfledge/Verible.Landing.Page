"use client"

import { Button } from "@/components/ui/button"
import { Search, AlertTriangle, Building2, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/stores/auth-store"

export function QuickActions() {
  const router = useRouter()
  const { isLoggedIn, user } = useAuth()
  
  // Only show for logged-in buyers
  if (!isLoggedIn || user?.role !== "user") {
    return null
  }

  const actions = [
    {
      label: "Seller Lookup",
      icon: Search,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => router.push("/seller-lookup")
    },
    {
      label: "Risk Alerts",
      icon: AlertTriangle,
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => router.push("/risk-alerts")
    },
    {
      label: "Verify Business",
      icon: Building2,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => router.push("/seller-onboarding")
    },
    {
      label: "Analytics",
      icon: BarChart3,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => router.push("/analytics")
    }
  ]

  return (
    <section className="w-full px-6 py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-gray-600">
            Access essential tools and features instantly
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                onClick={action.onClick}
                className={`${action.color} text-white h-auto py-3 px-4 flex flex-col items-center justify-center space-y-3 shadow-md hover:shadow-lg transition-all duration-200`}
              >
                <Icon className="w-8 h-8" />
                <span className="text-sm font-semibold">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

