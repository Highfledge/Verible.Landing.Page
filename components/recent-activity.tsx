"use client"

import { CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/stores/auth-store"
import { Card } from "@/components/ui/card"

export function RecentActivity() {
  const { isLoggedIn, user } = useAuth()
  
  // Only show for logged-in buyers
  if (!isLoggedIn || user?.role !== "user") {
    return null
  }

  // Mock activity data - in real app, this would come from an API
  const activities = [
    {
      id: 1,
      type: "verification",
      message: "Seller verification submitted for Sola",
      category: "furniture",
      timeAgo: "20 minutes ago",
      icon: CheckCircle2,
      iconColor: "bg-green-500",
    },
  ]

  if (activities.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <Card
              key={activity.id}
              className="p-4 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`${activity.iconColor} rounded-full p-2 flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.category} • {activity.timeAgo}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

