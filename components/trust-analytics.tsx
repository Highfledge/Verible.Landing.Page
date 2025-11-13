"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/stores/auth-store"
import { usersAPI } from "@/lib/api/client"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ExtractionMetrics {
  totalCount: number
  totalCountChange: string
  totalCountChangeValue: number
  averagePulseScore: number
  averagePulseScoreChange: string
  averagePulseScoreChangeValue: number
  highRiskCount: number
  highRiskCountChange: string
  highRiskCountChangeValue: number
}

interface Seller {
  id: string
  sellerId: string
  platform: string
  profileUrl: string
  pulseScore: number
  extractedAt: string
  createdAt: string
}

interface ExtractionsData {
  sellers: Seller[]
  metrics: ExtractionMetrics
  timeRange: string
}

export function TrustAnalytics() {
  const { isLoggedIn, user, isBuyerView } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<"7 Days" | "30 Days">("7 Days")
  const [metrics, setMetrics] = useState<ExtractionMetrics | null>(null)
  const [sellers, setSellers] = useState<Seller[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Convert period to API format
  const getTimeRange = (period: "7 Days" | "30 Days"): string => {
    switch (period) {
      case "7 Days":
        return "7d"
      case "30 Days":
        return "30d"
      default:
        return "7d"
    }
  }

  // Format change text
  const formatChange = (change: string, label: string): string => {
    if (label === "Avg. Pulse Score") {
      // For pulse score, show points
      return `${change} points`
    } else {
      // For counts, show percentage with period context
      const periodText = selectedPeriod === "7 Days" ? "week" : "month"
      return `${change} from last ${periodText}`
    }
  }

  // Fetch extractions data
  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      setIsLoading(false)
      return
    }

    const fetchExtractions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const timeRange = getTimeRange(selectedPeriod)
        const response = await usersAPI.getMyExtractions({ timeRange })
        
        if (response.success && response.data) {
          setMetrics(response.data.metrics)
          setSellers(response.data.sellers || [])
        } else {
          setError("Failed to load analytics")
        }
      } catch (err: any) {
        console.error("Error fetching extractions:", err)
        setError(err.response?.data?.message || "Failed to load analytics")
        toast.error("Failed to load trust analytics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchExtractions()
  }, [selectedPeriod, isLoggedIn, user])

  // Only show for logged-in buyers (or sellers viewing as buyer)
  const isBuyer = isLoggedIn && (user?.role === "user" || (user?.role === "seller" && isBuyerView))
  if (!isBuyer) {
    return null
  }

  const periods = ["7 Days", "30 Days"] as const

  // Process sellers data for charts
  const processChartData = () => {
    if (sellers.length === 0) {
      return {
        dailyExtractions: [],
        pulseScoreTrend: [],
        pulseScoreDistribution: []
      }
    }

    // Group by date for daily extractions (bar chart)
    const dailyMap = new Map<string, { count: number; timestamp: number }>()
    sellers.forEach(seller => {
      const date = new Date(seller.extractedAt)
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const existing = dailyMap.get(dateKey)
      if (existing) {
        existing.count++
      } else {
        dailyMap.set(dateKey, { count: 1, timestamp: date.getTime() })
      }
    })
    const dailyExtractions = Array.from(dailyMap.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([date, data]) => ({ date, count: data.count }))

    // Create pulse score trend (line chart) - average pulse score per day
    const pulseScoreByDate = new Map<string, { scores: number[]; timestamp: number }>()
    sellers.forEach(seller => {
      const date = new Date(seller.extractedAt)
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const existing = pulseScoreByDate.get(dateKey)
      if (existing) {
        existing.scores.push(seller.pulseScore)
      } else {
        pulseScoreByDate.set(dateKey, { scores: [seller.pulseScore], timestamp: date.getTime() })
      }
    })
    const pulseScoreTrend = Array.from(pulseScoreByDate.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([date, data]) => ({
        date,
        avgScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
      }))

    // Pulse score distribution (for bar chart alternative)
    const distribution = [0, 0, 0, 0, 0] // 0-20, 21-40, 41-60, 61-80, 81-100
    sellers.forEach(seller => {
      const score = seller.pulseScore
      if (score <= 20) distribution[0]++
      else if (score <= 40) distribution[1]++
      else if (score <= 60) distribution[2]++
      else if (score <= 80) distribution[3]++
      else distribution[4]++
    })

    return {
      dailyExtractions,
      pulseScoreTrend,
      pulseScoreDistribution: distribution
    }
  }

  const chartData = processChartData()

  // Build metrics array from API data or use defaults
  const displayMetrics = metrics ? [
    {
      label: "Sellers Analyzed",
      value: metrics.totalCount.toString(),
      change: formatChange(metrics.totalCountChange, "Sellers Analyzed"),
      changeColor: metrics.totalCountChangeValue >= 0 ? "text-green-600" : "text-red-600",
      icon: Users,
      iconColor: "text-green-600",
    },
    {
      label: "Avg. Pulse Score",
      value: metrics.averagePulseScore.toFixed(1),
      change: formatChange(metrics.averagePulseScoreChange, "Avg. Pulse Score"),
      changeColor: metrics.averagePulseScoreChangeValue >= 0 ? "text-blue-600" : "text-red-600",
      icon: Shield,
      iconColor: "text-blue-600",
    },
    {
      label: "High-Risk Detected",
      value: metrics.highRiskCount.toString(),
      change: formatChange(metrics.highRiskCountChange, "High-Risk Detected"),
      changeColor: metrics.highRiskCountChangeValue >= 0 ? "text-red-600" : "text-green-600",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
  ] : [
    {
      label: "Sellers Analyzed",
      value: "0",
      change: "Loading...",
      changeColor: "text-gray-600",
      icon: Users,
      iconColor: "text-green-600",
    },
    {
      label: "Avg. Pulse Score",
      value: "0.0",
      change: "Loading...",
      changeColor: "text-gray-600",
      icon: Shield,
      iconColor: "text-blue-600",
    },
    {
      label: "High-Risk Detected",
      value: "0",
      change: "Loading...",
      changeColor: "text-gray-600",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
  ]

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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {displayMetrics.map((metric, index) => {
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
        )}

        {/* Graph Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                USERS: LAST {selectedPeriod.toUpperCase()} USING MEDIAN
              </h3>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading charts...</span>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : sellers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No extraction data available for this period</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Chart - Daily Extractions Bar Chart */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Daily Extractions</h4>
                  <div className="h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-4">
                    <div className="relative w-full h-full flex items-end justify-center">
                      {chartData.dailyExtractions.length > 0 ? (
                        <>
                          {/* Bar chart */}
                          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-2 pb-2 gap-1">
                            {chartData.dailyExtractions.map((item, index) => {
                              const maxCount = Math.max(...chartData.dailyExtractions.map(d => d.count), 1)
                              const height = (item.count / maxCount) * 100
                              return (
                                <div key={index} className="flex flex-col items-center flex-1">
                                  <div
                                    className="w-full bg-blue-400 rounded-t min-w-[20px]"
                                    style={{ height: `${height}%` }}
                                  />
                                  <span className="text-[10px] text-gray-600 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                                    {item.date}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                          {/* Statistics overlay */}
                          <div className="absolute top-4 left-4 text-xs font-semibold text-gray-700 space-y-1">
                            <div>Total: {sellers.length}</div>
                            <div>Avg/Day: {(sellers.length / chartData.dailyExtractions.length).toFixed(1)}</div>
                            <div>Peak: {Math.max(...chartData.dailyExtractions.map(d => d.count))}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-500">No data</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Chart - Pulse Score Trend Line Graph */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Average Pulse Score Trend</h4>
                  <div className="h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-4">
                    <div className="relative w-full h-full flex items-end justify-center">
                      {chartData.pulseScoreTrend.length > 0 ? (
                        <>
                          <svg className="absolute bottom-0 left-0 right-0 h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <defs>
                              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            
                            {/* Calculate line points */}
                            {(() => {
                              const minScore = Math.min(...chartData.pulseScoreTrend.map(d => d.avgScore), 0)
                              const maxScore = Math.max(...chartData.pulseScoreTrend.map(d => d.avgScore), 100)
                              const scoreRange = maxScore - minScore || 100
                              const width = 300
                              const height = 200
                              const padding = 20
                              const chartWidth = width - padding * 2
                              const chartHeight = height - padding * 2
                              
                              const points = chartData.pulseScoreTrend.map((item, index) => {
                                const x = padding + (index / (chartData.pulseScoreTrend.length - 1 || 1)) * chartWidth
                                const normalizedScore = (item.avgScore - minScore) / scoreRange
                                const y = padding + chartHeight - (normalizedScore * chartHeight)
                                return `${x},${y}`
                              }).join(' ')
                              
                              return (
                                <>
                                  {/* Pulse score line */}
                                  <polyline
                                    points={points}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                  />
                                  {/* Data points */}
                                  {chartData.pulseScoreTrend.map((item, index) => {
                                    const x = padding + (index / (chartData.pulseScoreTrend.length - 1 || 1)) * (width - padding * 2)
                                    const normalizedScore = (item.avgScore - minScore) / scoreRange
                                    const y = padding + (height - padding * 2) - (normalizedScore * (height - padding * 2))
                                    return (
                                      <circle key={index} cx={x} cy={y} r="4" fill="#3b82f6" />
                                    )
                                  })}
                                </>
                              )
                            })()}
                          </svg>
                          {/* Statistics overlay */}
                          <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-700 space-y-1 text-right">
                            <div>Avg: {metrics?.averagePulseScore.toFixed(1) || '0'}</div>
                            <div>High: {Math.max(...chartData.pulseScoreTrend.map(d => d.avgScore)).toFixed(1)}</div>
                            <div>Low: {Math.min(...chartData.pulseScoreTrend.map(d => d.avgScore)).toFixed(1)}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-500">No data</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

