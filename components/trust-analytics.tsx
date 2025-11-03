"use client"

import { useState } from "react"
import { useAuth } from "@/lib/stores/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Shield, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrustAnalytics() {
  const { isLoggedIn, user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<"7 Days" | "30 Days" | "90 Days">("7 Days")
  
  // Only show for logged-in buyers
  if (!isLoggedIn || user?.role !== "user") {
    return null
  }

  const metrics = [
    {
      label: "Sellers Analyzed",
      value: "53",
      change: "+12% from last week",
      changeColor: "text-green-600",
      icon: Users,
      iconColor: "text-green-600",
    },
    {
      label: "Avg. Pulse Score",
      value: "90.6",
      change: "+2.1 points",
      changeColor: "text-blue-600",
      icon: Shield,
      iconColor: "text-blue-600",
    },
    {
      label: "High-Risk Detected",
      value: "1",
      change: "-8% from last week",
      changeColor: "text-red-600",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
  ]

  const periods = ["7 Days", "30 Days", "90 Days"] as const

  return (
    <div className="w-full">
      {/* Header with Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Trust Analytics</h2>
          <div className="flex items-center space-x-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedPeriod === period
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={cn("w-5 h-5", metric.iconColor)} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div className={cn("text-sm font-medium", metric.changeColor)}>
                      {metric.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Graph Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                USERS: LAST 7 DAYS USING MEDIAN
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Chart - Bar/Histogram */}
              <div className="space-y-2">
                <div className="h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-4">
                  <div className="relative w-full h-full flex items-end justify-center">
                    {/* Simple bar chart representation */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-4 pb-2">
                      {[40, 55, 65, 85, 72, 60, 75].map((height, index) => (
                        <div
                          key={index}
                          className="w-8 bg-blue-400 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    {/* Statistics overlay */}
                    <div className="absolute top-4 left-4 text-xs font-semibold text-gray-700 space-y-1">
                      <div>0.7%</div>
                      <div>2.7Mpv/s</div>
                      <div>40.6%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Chart - Line Graph */}
              <div className="space-y-2">
                <div className="h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-4">
                  <div className="relative w-full h-full flex items-end justify-center">
                    {/* Line chart */}
                    <svg className="absolute bottom-0 left-0 right-0 h-full w-full" viewBox="0 0 300 200">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Blue line */}
                      <polyline
                        points="20,180 50,160 80,140 110,120 140,130 170,135 200,125 230,140 260,130 280,135"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                      
                      {/* Green line */}
                      <polyline
                        points="20,170 50,150 80,130 110,110 140,120 170,125 200,115 230,130 260,120 280,125"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      
                      {/* Data points */}
                      {[
                        [50, 160],
                        [80, 140],
                        [110, 120],
                        [140, 130],
                        [170, 135],
                        [200, 125],
                        [230, 140],
                      ].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" />
                      ))}
                    </svg>
                    {/* Statistics overlay */}
                    <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-700 space-y-1 text-right">
                      <div>479K</div>
                      <div>17min</div>
                      <div>2pv/s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

