"use client"

import { useState, useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, Shield, BarChart3, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, CheckCircle2, Network, Globe, Brain, Eye, Clock, Star, Info, ChevronDown, Lock, Loader2 } from "lucide-react"
import { RecentActivity } from "@/components/recent-activity"
import { usersAPI } from "@/lib/api/client"
import { useAuth } from "@/lib/stores/auth-store"
import { cleanText } from "@/lib/utils/clean-data"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

const analyticsTabs = [
  { id: "overview", label: "Overview" },
  { id: "trust-ecosystem", label: "Trust Ecosystem" },
  { id: "scoring-model", label: "Scoring Model" },
  { id: "advanced", label: "Advanced" },
  { id: "platforms", label: "Platforms" },
  { id: "security", label: "Security" },
  { id: "reports", label: "Reports" },
]

const trustScoreRanges = [
  { range: "90-100", count: 3421, percentage: 22.8, color: "bg-green-500" },
  { range: "80-89", count: 5632, percentage: 37.5, color: "bg-blue-500" },
  { range: "70-79", count: 4123, percentage: 27.4, color: "bg-gray-400" },
  { range: "60-69", count: 1234, percentage: 8.2, color: "bg-orange-500" },
  { range: "Below 60", count: 612, percentage: 4.1, color: "bg-amber-700" },
]

const supportedPlatforms = [
  "Amazon",
  "eBay",
  "Etsy",
  "AliExpress",
  "Facebook Marketplace",
]

// Threat interface matching API response
interface Threat {
  sellerId: string
  sellerName: string
  platform: string
  usersAffected: number
  timeAgo: string
  location: string
  riskScore: number
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  description: string
  lastScored: string
  flagCount: number
}

// Helper function to get severity styling
const getSeverityStyles = (severity: string) => {
  const normalized = severity.toLowerCase()
  switch (normalized) {
    case "critical":
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeColor: "bg-red-100 text-red-700"
      }
    case "high":
      return {
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        badgeColor: "bg-orange-100 text-orange-700"
      }
    case "medium":
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        badgeColor: "bg-yellow-100 text-yellow-700"
      }
    case "low":
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        badgeColor: "bg-blue-100 text-blue-700"
      }
    default:
      return {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        badgeColor: "bg-gray-100 text-gray-700"
      }
  }
}

const platformCoverage = [
  { name: "Amazon", scans: 5420, coverage: 95, dotColor: "bg-orange-500" },
  { name: "eBay", scans: 3201, coverage: 89, dotColor: "bg-blue-500" },
  { name: "Etsy", scans: 1876, coverage: 92, dotColor: "bg-orange-500" },
  { name: "AliExpress", scans: 2145, coverage: 78, dotColor: "bg-red-500" },
  { name: "Facebook Marketplace", scans: 987, coverage: 85, dotColor: "bg-blue-500" },
]

const trustEcosystemFlow = [
  {
    title: "Data Collection",
    description: "Real-time seller behavior monitoring across 47 platforms",
    metric: "24/7",
    icon: Users,
    iconBg: "bg-blue-500",
  },
  {
    title: "Analysis Engine",
    description: "AI-powered trust factor calculation and risk assessment",
    metric: "156K/day",
    icon: Brain,
    iconBg: "bg-orange-500",
  },
  {
    title: "Trust Scoring",
    description: "Dynamic pulse score generation and real-time updates",
    metric: "82.4 avg",
    icon: Shield,
    iconBg: "bg-green-500",
  },
  {
    title: "User Protection",
    description: "Browser extension alerts and marketplace integration",
    metric: "2.8M users",
    icon: Eye,
    iconBg: "bg-blue-500",
  },
]

const platformPerformance = [
  {
    name: "Amazon",
    protectedUsers: 8924,
    avgPulseScore: 84.2,
    threatsBlocked: 23,
    growth: 12,
  },
  {
    name: "eBay",
    protectedUsers: 5632,
    avgPulseScore: 79.8,
    threatsBlocked: 18,
    growth: 8,
  },
  {
    name: "Etsy",
    protectedUsers: 3421,
    avgPulseScore: 88.1,
    threatsBlocked: 7,
    growth: 15,
  },
  {
    name: "AliExpress",
    protectedUsers: 2819,
    avgPulseScore: 72.4,
    threatsBlocked: 31,
    growth: 5,
  },
  {
    name: "Facebook Marketplace",
    protectedUsers: 1847,
    avgPulseScore: 81.6,
    threatsBlocked: 12,
    growth: 22,
  },
]

const scoringCriteria = [
  {
    title: "Account Age",
    icon: Clock,
    weight: 20,
    maxPoints: 20,
    description: "Length of time seller has been active on platform. Older accounts indicate stability and commitment.",
    exampleScore: 80,
    points: 16,
  },
  {
    title: "Review Quality",
    icon: Star,
    weight: 30,
    maxPoints: 30,
    description: "Average rating and total number of reviews. Higher ratings and more reviews increase trust.",
    exampleScore: 90,
    points: 27,
  },
  {
    title: "Complaint Index",
    icon: AlertTriangle,
    weight: 25,
    maxPoints: 25,
    description: "Number and severity of complaints filed against seller. Lower complaints increase score.",
    exampleScore: 92,
    points: 23,
  },
  {
    title: "Social Credibility",
    icon: Users,
    weight: 25,
    maxPoints: 25,
    description: "Social media presence, verified profiles, and third-party validations.",
    exampleScore: 68,
    points: 17,
  },
]

const verifiedDataSources = [
  "Platform APIs",
  "Return Patterns",
  "Third-party Data",
  "Review Sentiment",
  "Social Verification",
  "Complaint Databases",
]

const reportTypes = [
  {
    title: "Trust Score Report",
    description: "Comprehensive trust analysis",
    icon: BarChart3,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Security Report",
    description: "Threat detection summary",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Platform Report",
    description: "Cross-platform analytics",
    icon: Users,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Activity Report",
    description: "User engagement metrics",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

const platformPerformanceData = [
  {
    name: "Amazon",
    protectedUsers: 8924,
    protectedUsersGrowth: 12,
    threatsDetected: 23,
    coverage: 95,
  },
  {
    name: "eBay",
    protectedUsers: 5632,
    protectedUsersGrowth: 8,
    threatsDetected: 18,
    coverage: 95,
  },
  {
    name: "Etsy",
    protectedUsers: 3421,
    protectedUsersGrowth: 15,
    threatsDetected: 7,
    coverage: 95,
  },
  {
    name: "AliExpress",
    protectedUsers: 2819,
    protectedUsersGrowth: 5,
    threatsDetected: 31,
    coverage: 95,
  },
  {
    name: "Facebook Marketplace",
    protectedUsers: 1847,
    protectedUsersGrowth: 22,
    threatsDetected: 12,
    coverage: 95,
  },
]

function AnalyticsContent() {
  const { isLoggedIn, user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [advancedSubTab, setAdvancedSubTab] = useState("trust-trends")
  const [threats, setThreats] = useState<Threat[]>([])
  const [isLoadingThreats, setIsLoadingThreats] = useState(true)
  const [threatsError, setThreatsError] = useState<string | null>(null)

  // Fetch threats data
  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      setIsLoadingThreats(false)
      return
    }

    const fetchThreats = async () => {
      setIsLoadingThreats(true)
      setThreatsError(null)
      try {
        const response = await usersAPI.getTopThreats({
          limit: 10
        })
        
        if (response.success && response.data) {
          // Clean the threats data
          const cleanedThreats = response.data.threats.map((threat: Threat) => ({
            ...threat,
            sellerName: cleanText(threat.sellerName) || "Unknown Seller",
            description: cleanText(threat.description) || "No description available",
            location: cleanText(threat.location) || "Not specified"
          }))
          setThreats(cleanedThreats)
        } else {
          setThreatsError("Failed to load threats")
        }
      } catch (err: any) {
        console.error("Error fetching threats:", err)
        setThreatsError(err.response?.data?.message || "Failed to load threats")
      } finally {
        setIsLoadingThreats(false)
      }
    }

    fetchThreats()
  }, [isLoggedIn, user])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      {/* Analytics Sub-Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="text-sm text-[#1D2973] hover:text-[#1a2468] font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-1 overflow-x-auto">
            {analyticsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-[#1D2973] text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics Cards - FIRST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Users */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Users
                    </CardTitle>
                    <Users className="w-5 h-5 text-[#1D2973]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      15,683
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+12.5% from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Scans */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Trust Scans
                    </CardTitle>
                    <Activity className="w-5 h-5 text-[#1D2973]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      127,432
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+8.2% from last week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Threats Blocked */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Threats Blocked
                    </CardTitle>
                    <Shield className="w-5 h-5 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      2,341
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      98.7% success rate
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avg Trust Score */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Avg Trust Score
                    </CardTitle>
                    <BarChart3 className="w-5 h-5 text-[#1D2973]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      82.4
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+2.1 points improved</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust Score Distribution */}
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <CardTitle className="text-lg font-semibold text-white">
                    Trust Score Distribution
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {trustScoreRanges.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded",
                              item.color
                            )}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {item.range}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {item.count.toLocaleString()} sellers
                          </span>
                          <span className="text-sm font-medium text-gray-900 w-16 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seller Trust Analysis Section */}
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <CardTitle className="text-lg font-semibold text-white">
                    Seller Trust Analysis
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                    <Network className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-gray-900">No Active Analysis</p>
                    <p className="text-sm text-gray-600 max-w-md">
                      Visit a supported marketplace with our browser extension to see real-time seller trust analysis.
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Supported Platforms:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {supportedPlatforms.map((platform) => (
                        <button
                          key={platform}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Analytics Summary */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-8 h-8 text-[#1D2973]" />
                    <div>
                      <p className="text-sm text-gray-600">Total Sellers</p>
                      <p className="text-2xl font-bold text-gray-900">53</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Score</p>
                      <p className="text-2xl font-bold text-gray-900">90.6</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">High Risk</p>
                      <p className="text-2xl font-bold text-gray-900">1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Active Scans */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Active Scans
                    </CardTitle>
                    <Shield className="w-5 h-5 text-[#1D2973]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      1,246
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+9.0% vs last hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Verifications */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Trust Verifications
                    </CardTitle>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      894
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+9.7% vs last hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Alerts */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Risk Alerts
                    </CardTitle>
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      26
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-red-600">
                      <ArrowDownRight className="w-4 h-4" />
                      <span>-6.0% vs last hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Protected Users */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Protected Users
                    </CardTitle>
                    <Users className="w-5 h-5 text-[#1D2973]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      15,684
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+3.8% vs last hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Threat Intelligence */}
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <CardTitle className="text-lg font-semibold text-white">
                      Live Threat Intelligence
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-500 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-white">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingThreats ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading threats...</span>
                  </div>
                ) : threatsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{threatsError}</p>
                  </div>
                ) : threats.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No threats detected</p>
                    <p className="text-sm text-gray-500 mt-1">All clear! No active threats at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {threats.slice(0, 5).map((threat) => {
                      const styles = getSeverityStyles(threat.severity)
                      return (
                        <div
                          key={threat.sellerId}
                          className={cn(
                            "p-4 rounded-lg border-2",
                            styles.bgColor,
                            styles.borderColor
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className={cn("w-5 h-5 mt-0.5 flex-shrink-0", styles.color)} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={cn("px-2 py-0.5 text-xs font-semibold rounded", styles.badgeColor)}>
                                  {threat.severity}
                                </span>
                                <span className="text-xs text-gray-500">Risk Score: {threat.riskScore}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {threat.description}
                              </p>
                              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                  <span>Seller: <span className="font-medium text-gray-900">{threat.sellerName}</span></span>
                                  <span>•</span>
                                  <span>{threat.platform}</span>
                                  {threat.usersAffected > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{threat.usersAffected} affected</span>
                                    </>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{threat.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Coverage & Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Platform Coverage */}
              <Card className="border shadow-sm flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Platform Coverage</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <div className="space-y-4">
                    {platformCoverage.map((platform, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className={cn("w-3 h-3 rounded-full", platform.dotColor)} />
                            <span className="text-sm font-medium text-gray-900">
                              {platform.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {platform.scans.toLocaleString()} scans
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {platform.coverage}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${platform.coverage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border shadow-sm flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    <RecentActivity hideHeader compact />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "trust-ecosystem" && (
          <div className="space-y-8">
            {/* Trust Ecosystem Flow */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trust Ecosystem Flow</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustEcosystemFlow.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Card key={index} className="border shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", item.iconBg)}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <div className={cn(
                              "text-2xl font-bold",
                              item.iconBg === "bg-blue-500" ? "text-blue-600" :
                              item.iconBg === "bg-orange-500" ? "text-orange-600" :
                              item.iconBg === "bg-green-500" ? "text-green-600" :
                              "text-gray-900"
                            )}>
                              {item.metric}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Complete Trust Ecosystem & Seller Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complete Trust Ecosystem */}
              <Card className="border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <CardTitle className="text-lg font-semibold text-white">
                      Complete Trust Ecosystem
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900">47</div>
                      <div className="text-sm text-gray-600 mt-1">Platforms</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">2.8M</div>
                      <div className="text-sm text-gray-600 mt-1">Protected Users</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">156K</div>
                      <div className="text-sm text-gray-600 mt-1">Sellers Analyzed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">98.7%</div>
                      <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Analysis */}
              <Card className="border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
                  <CardTitle className="text-lg font-semibold text-white">
                    Seller Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Average Pulse Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Average Pulse Score</span>
                      <span className="text-3xl font-bold text-gray-900">82.4</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "82.4%" }} />
                    </div>
                    <p className="text-xs text-green-600 mt-1">+2.1 points this month</p>
                  </div>

                  {/* Trust Level Distribution */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Trust Level Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">High Trust (80+)</span>
                        <span className="text-sm font-semibold text-green-600">9,053 sellers</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Medium Trust (60-79)</span>
                        <span className="text-sm font-semibold text-blue-600">5,357 sellers</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Low Trust (Below 60)</span>
                        <span className="text-sm font-semibold text-orange-600">846 sellers</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Factors Analysis */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-900">Trust Factors Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Account Age Score</span>
                        <span className="text-sm font-semibold text-gray-900">87.2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Transaction History</span>
                        <span className="text-sm font-semibold text-gray-900">79.8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Social Credibility</span>
                        <span className="text-sm font-semibold text-gray-900">84.1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Complaint Index</span>
                        <span className="text-sm font-semibold text-gray-900">91.5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance & Average Pulse Scores */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Performance & Average Pulse Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platformPerformance.map((platform, index) => (
                  <Card key={index} className="border shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {platform.name}
                        </CardTitle>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Active
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Protected Users:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {platform.protectedUsers.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Pulse Score:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {platform.avgPulseScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Threats Blocked:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {platform.threatsBlocked}
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Growth:</span>
                          <span className="text-sm font-semibold text-green-600">
                            +{platform.growth}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(platform.growth * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trust Score Distribution */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Trust Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trustScoreRanges.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded",
                              item.color
                            )}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {item.range}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {item.count.toLocaleString()} sellers
                          </span>
                          <span className="text-sm font-medium text-gray-900 w-16 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", item.color)}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Ecosystem Flow - Bottom Section */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Trust Ecosystem Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center text-gray-500">
                  <p className="text-sm">Trust ecosystem flow diagram will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "scoring-model" && (
          <div className="space-y-8">
            {/* Transparent Scoring Model */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#1D2973]" />
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Transparent Scoring Model
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Our Pulse Score is calculated using a transparent, weighted algorithm based on verified data points.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    How Pulse Score Works
                  </h3>
                  <p className="text-sm text-blue-800">
                    Each seller receives a score from 1-100 based on weighted factors. The algorithm is designed to be fair, transparent, and resistant to manipulation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scoring Criteria */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Info className="w-5 h-5 text-[#1D2973]" />
                <h2 className="text-2xl font-bold text-gray-900">Scoring Criteria</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scoringCriteria.map((criterion, index) => {
                  const Icon = criterion.icon
                  return (
                    <Card key={index} className="border shadow-sm">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[#1D2973]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {criterion.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                              Weight: {criterion.weight}% • Max: {criterion.maxPoints} points
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              {criterion.description}
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Example Score</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {criterion.exampleScore}%
                                  </span>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    {criterion.points} pts
                                  </span>
                                </div>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${criterion.exampleScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Example Calculation */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Example Calculation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scoringCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="text-sm text-gray-600">{criterion.title}:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {criterion.points} points
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t-2">
                    <span className="text-lg font-semibold text-gray-900">Total Pulse Score:</span>
                    <span className="text-xl font-bold text-green-600">
                      {scoringCriteria.reduce((sum, c) => sum + c.points, 0)}/100
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verified Data Sources */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Verified Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {verifiedDataSources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-700">{source}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Updates */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Scores are updated in real-time when new data becomes available, with batch processing running daily to ensure comprehensive analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Generate Reports</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report, index) => {
                  const Icon = report.icon
                  return (
                    <Card
                      key={index}
                      className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gray-50"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", report.bgColor)}>
                            <Icon className={cn("w-8 h-8", report.iconColor)} />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {report.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Trust Analytics Header with Date Range */}
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white">
                    Trust Analytics
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {["7 Days", "30 Days", "90 Days"].map((period, index) => (
                      <button
                        key={index}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          period === "7 Days"
                            ? "bg-white text-blue-600"
                            : "bg-white/20 text-white hover:bg-white/30"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">53</div>
                    <div className="text-sm text-gray-600">Sellers Analyzed</div>
                    <div className="text-sm text-green-600 font-medium">
                      +12% from last week
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">90.6</div>
                    <div className="text-sm text-gray-600">Avg. Pulse Score</div>
                    <div className="text-sm text-blue-600 font-medium">
                      +2.1 points
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">1</div>
                    <div className="text-sm text-gray-600">High-Risk Detected</div>
                    <div className="text-sm text-orange-600 font-medium">
                      -8% from last week
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Threat Intelligence */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Live Threat Intelligence
                  </CardTitle>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                    <span>USERS: LAST 7 DAYS USING MEDIAN</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingThreats ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading threats...</span>
                  </div>
                ) : threatsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{threatsError}</p>
                  </div>
                ) : threats.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No threats detected</p>
                    <p className="text-sm text-gray-500 mt-1">All clear! No active threats at this time.</p>
                  </div>
                ) : (
                  <>
                    {/* Summary Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-gray-900">{threats.length}</div>
                        <div className="text-xs text-gray-600 mt-1">Total Threats</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="text-2xl font-bold text-gray-900">
                          {threats.filter(t => t.severity === "CRITICAL" || t.severity === "HIGH").length}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Critical Alerts</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="text-2xl font-bold text-gray-900">
                          {threats.reduce((sum, t) => sum + (t.usersAffected || 0), 0)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Users Affected</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-gray-900">
                          {threats.length > 0 ? Math.round(threats.reduce((sum, t) => sum + t.riskScore, 0) / threats.length) : 0}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Avg Risk Score</div>
                      </div>
                    </div>

                    {/* Threats List */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">Active Threats</h3>
                      <div className="space-y-3">
                        {threats.map((threat) => {
                          const styles = getSeverityStyles(threat.severity)
                          return (
                            <div
                              key={threat.sellerId}
                              className={cn(
                                "p-4 rounded-lg border-2",
                                styles.bgColor,
                                styles.borderColor
                              )}
                            >
                              <div className="flex items-start space-x-3">
                                <AlertTriangle className={cn("w-5 h-5 mt-0.5 flex-shrink-0", styles.color)} />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2 flex-wrap">
                                    <span className={cn("px-2 py-0.5 text-xs font-semibold rounded", styles.badgeColor)}>
                                      {threat.severity}
                                    </span>
                                    <span className="text-xs text-gray-500">Risk Score: {threat.riskScore}</span>
                                    {threat.flagCount > 0 && (
                                      <span className="text-xs text-gray-500">• {threat.flagCount} flags</span>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-gray-900 mb-1">
                                    {threat.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                                      <span>Seller: <span className="font-medium text-gray-900">{threat.sellerName}</span></span>
                                      <span>•</span>
                                      <span className="capitalize">{threat.platform}</span>
                                      {threat.location && (
                                        <>
                                          <span>•</span>
                                          <span>{threat.location}</span>
                                        </>
                                      )}
                                      {threat.usersAffected > 0 && (
                                        <>
                                          <span>•</span>
                                          <span className="text-red-600 font-medium">{threat.usersAffected} affected</span>
                                        </>
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-500">{threat.timeAgo}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "platforms" && (
          <div className="space-y-8">
            {/* Platform Performance */}
            <Card className="border shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <CardTitle className="text-2xl font-bold text-white">
                    Platform Performance
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {platformPerformanceData.map((platform, index) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-gray-50 transition-colors relative"
                    >
                      {/* Active Badge */}
                      <div className="absolute top-6 right-6">
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Active
                        </span>
                      </div>

                      {/* Platform Name */}
                      <h3 className="text-xl font-semibold text-blue-600 mb-6 pr-24">
                        {platform.name}
                      </h3>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Protected Users */}
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {platform.protectedUsers.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            Protected Users
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            +{platform.protectedUsersGrowth}% growth
                          </div>
                        </div>

                        {/* Threats Detected */}
                        <div>
                          <div className="text-3xl font-bold text-orange-600 mb-1">
                            {platform.threatsDetected}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            Threats Detected
                          </div>
                          <div className="text-xs text-gray-500">
                            Last 24h
                          </div>
                        </div>

                        {/* Coverage */}
                        <div>
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {platform.coverage}%
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            Coverage
                          </div>
                          <div className="text-xs text-blue-600">
                            Active monitoring
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-8">
            {/* Advanced Analytics Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
              <p className="text-gray-600">Deep insights into seller behavior and marketplace trends.</p>
            </div>

            {/* Advanced Sub-navigation */}
            <div className="bg-white border rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[
                  { id: "trust-trends", label: "Trust Trends" },
                  { id: "platform-analysis", label: "Platform Analysis" },
                  { id: "risk-assessment", label: "Risk Assessment" },
                  { id: "threat-intelligence", label: "Threat Intelligence" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAdvancedSubTab(tab.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      advancedSubTab === tab.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white">
                  <option>7 Days</option>
                  <option>30 Days</option>
                  <option>90 Days</option>
                </select>
                <select className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white">
                  <option>All Platforms</option>
                  <option>Amazon</option>
                  <option>eBay</option>
                  <option>Etsy</option>
                  <option>AliExpress</option>
                  <option>Facebook Marketplace</option>
                </select>
              </div>
            </div>

            {/* Trust Trends Content */}
            {advancedSubTab === "trust-trends" && (
              <div className="space-y-6">
                {/* Key Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Average Trust Score</div>
                          <div className="text-4xl font-bold text-gray-900">88.2</div>
                          <div className="text-sm text-green-600 font-medium">
                            +2.4% from last week
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Risk Reduction</div>
                          <div className="text-4xl font-bold text-gray-900">73%</div>
                          <div className="text-sm text-green-600 font-medium">
                            +5.2% improvement
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Verified Sellers</div>
                          <div className="text-4xl font-bold text-gray-900">2,180</div>
                          <div className="text-sm text-green-600 font-medium">
                            +18% this month
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trust Score Evolution Chart */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Trust Score Evolution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 relative">
                      {/* Chart Container */}
                      <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={320 - (y * 320 / 100)}
                            x2="800"
                            y2={320 - (y * 320 / 100)}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        ))}
                        
                        {/* Y-axis labels */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <text
                            key={y}
                            x="10"
                            y={320 - (y * 320 / 100) + 4}
                            className="text-xs fill-gray-600"
                          >
                            {y}
                          </text>
                        ))}

                        {/* X-axis labels */}
                        {[
                          { date: "Jan 1", x: 50 },
                          { date: "Jan 8", x: 150 },
                          { date: "Jan 15", x: 250 },
                          { date: "Jan 22", x: 350 },
                          { date: "Jan 29", x: 450 },
                          { date: "Feb 5", x: 550 },
                          { date: "Feb 12", x: 650 },
                        ].map((item, index) => (
                          <text
                            key={index}
                            x={item.x}
                            y="315"
                            className="text-xs fill-gray-600"
                            textAnchor="middle"
                          >
                            {item.date}
                          </text>
                        ))}

                        {/* Blue line (Trust Score) */}
                        <polyline
                          points="50,256 150,230 250,200 350,160 450,130 550,100 650,80"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {[50, 150, 250, 350, 450, 550, 650].map((x, i) => {
                          const yValues = [256, 230, 200, 160, 130, 100, 80]
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={yValues[i]}
                              r="5"
                              fill="#3b82f6"
                            />
                          )
                        })}

                        {/* Red line (Risk Score - staying low) */}
                        <polyline
                          points="50,290 150,295 250,285 350,290 450,295 550,288 650,292"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {[50, 150, 250, 350, 450, 550, 650].map((x, i) => {
                          const yValues = [290, 295, 285, 290, 295, 288, 292]
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={yValues[i]}
                              r="5"
                              fill="#ef4444"
                            />
                          )
                        })}
                      </svg>

                      {/* Legend */}
                      <div className="absolute top-4 right-4 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-0.5 bg-blue-500" />
                          <span className="text-sm text-gray-600">Trust Score</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-0.5 bg-red-500" />
                          <span className="text-sm text-gray-600">Risk Score</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Platform Analysis Content */}
            {advancedSubTab === "platform-analysis" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Performance */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Platform Performance</h2>
                  <div className="space-y-3">
                    {[
                      { name: "Amazon", status: "Low", statusColor: "bg-green-500", score: 82, sellers: 45000, change: 12, changePositive: true },
                      { name: "eBay", status: "Medium", statusColor: "bg-yellow-500", score: 74, sellers: 28000, change: 8, changePositive: true },
                      { name: "Etsy", status: "Low", statusColor: "bg-green-500", score: 89, sellers: 15000, change: 15, changePositive: true },
                      { name: "AliExpress", status: "High", statusColor: "bg-red-500", score: 65, sellers: 12000, change: -3, changePositive: false },
                      { name: "Facebook", status: "Medium", statusColor: "bg-yellow-500", score: 71, sellers: 8000, change: 22, changePositive: true },
                    ].map((platform, index) => (
                      <Card key={index} className="border shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={cn("px-3 py-1 text-xs font-semibold text-white rounded-full", platform.statusColor)}>
                                {platform.status}
                              </span>
                              <div>
                                <div className="font-semibold text-gray-900">{platform.name}</div>
                                <div className="text-sm text-gray-600">{platform.sellers.toLocaleString()} sellers</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{platform.score}</div>
                              <div className={cn(
                                "text-sm font-medium",
                                platform.changePositive ? "text-green-600" : "text-red-600"
                              )}>
                                {platform.change > 0 ? "+" : ""}{platform.change}%
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Seller Distribution */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Seller Distribution</h2>
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="h-80 relative">
                        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
                          {/* Grid Lines */}
                          {[0, 15000, 30000, 45000, 60000].map((y, i) => (
                            <g key={i}>
                              <line
                                x1="50"
                                y1={320 - (y * 320 / 60000)}
                                x2="550"
                                y2={320 - (y * 320 / 60000)}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                              />
                              <text
                                x="45"
                                y={320 - (y * 320 / 60000) + 4}
                                className="text-xs fill-gray-600"
                                textAnchor="end"
                              >
                                {y === 0 ? "0" : `${y / 1000}k`}
                              </text>
                            </g>
                          ))}

                          {/* Bars */}
                          {[
                            { name: "Amazon", value: 45000, x: 90 },
                            { name: "eBay", value: 28000, x: 180 },
                            { name: "Etsy", value: 15000, x: 270 },
                            { name: "AliExpress", value: 12000, x: 360 },
                            { name: "Facebook", value: 8000, x: 450 },
                          ].map((item, index) => {
                            const barHeight = (item.value / 60000) * 260
                            return (
                              <g key={index}>
                                <rect
                                  x={item.x - 30}
                                  y={320 - barHeight - 20}
                                  width="60"
                                  height={barHeight}
                                  fill="#3b82f6"
                                  rx="4"
                                />
                                <text
                                  x={item.x}
                                  y="315"
                                  className="text-xs fill-gray-600"
                                  textAnchor="middle"
                                >
                                  {item.name}
                                </text>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Risk Assessment Content */}
            {advancedSubTab === "risk-assessment" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Risk Distribution</h2>
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="h-80 flex items-center justify-center">
                        {/* Placeholder for chart - could be a pie chart or donut chart */}
                        <div className="text-center text-gray-400">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Risk distribution chart will appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Categories */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Risk Categories</h2>
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { level: "Low Risk", count: 78000, percentage: 78, color: "bg-green-500" },
                          { level: "Medium Risk", count: 15000, percentage: 15, color: "bg-orange-500" },
                          { level: "High Risk", count: 5000, percentage: 5, color: "bg-red-500" },
                          { level: "Critical Risk", count: 2000, percentage: 2, color: "bg-red-700" },
                        ].map((risk, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={cn("w-4 h-4 rounded-full", risk.color)} />
                                <span className="text-sm font-medium text-gray-900">
                                  {risk.level}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  {risk.count.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {risk.percentage}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Threat Intelligence Content */}
            {advancedSubTab === "threat-intelligence" && (
              <div className="space-y-6">
                {/* Threat Trends Chart */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg font-semibold">Threat Trends</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Monitoring and reduction of fraud patterns over time
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 relative bg-gradient-to-b from-gray-50 to-white rounded-lg p-6">
                      <svg className="w-full h-full" viewBox="0 0 700 360" preserveAspectRatio="none">
                        {/* Background gradient areas for each line */}
                        <defs>
                          <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        {[0, 30, 60, 90, 120].map((y, i) => (
                          <g key={y}>
                            <line
                              x1="80"
                              y1={340 - (y * 300 / 120) - 20}
                              x2="680"
                              y2={340 - (y * 300 / 120) - 20}
                              stroke={i === 0 ? "#d1d5db" : "#e5e7eb"}
                              strokeWidth={i === 0 ? "2" : "1"}
                              strokeDasharray={i === 0 ? "0" : "4,4"}
                            />
                            <text
                              x="75"
                              y={340 - (y * 300 / 120) - 20 + 4}
                              className="text-sm fill-gray-700 font-medium"
                              textAnchor="end"
                            >
                              {y}
                            </text>
                          </g>
                        ))}

                        {/* X-axis line */}
                        <line
                          x1="80"
                          y1="320"
                          x2="680"
                          y2="320"
                          stroke="#d1d5db"
                          strokeWidth="2"
                        />

                        {/* X-axis labels */}
                        {[
                          { month: "Oct", x: 160 },
                          { month: "Nov", x: 260 },
                          { month: "Dec", x: 360 },
                          { month: "Jan", x: 460 },
                          { month: "Feb", x: 560 },
                        ].map((item, index) => (
                          <g key={index}>
                            <text
                              x={item.x}
                              y="345"
                              className="text-sm fill-gray-700 font-medium"
                              textAnchor="middle"
                            >
                              {item.month}
                            </text>
                            <line
                              x1={item.x}
                              y1="320"
                              x2={item.x}
                              y2="325"
                              stroke="#d1d5db"
                              strokeWidth="2"
                            />
                          </g>
                        ))}

                        {/* Area fill for Red line */}
                        <path
                          d="M 160,100 L 260,130 L 360,150 L 460,170 L 560,190 L 560,320 L 160,320 Z"
                          fill="url(#redGradient)"
                        />

                        {/* Area fill for Orange line */}
                        <path
                          d="M 160,125 L 260,150 L 360,165 L 460,180 L 560,195 L 560,320 L 160,320 Z"
                          fill="url(#orangeGradient)"
                        />

                        {/* Area fill for Purple line */}
                        <path
                          d="M 160,170 L 260,195 L 360,210 L 460,220 L 560,230 L 560,320 L 160,320 Z"
                          fill="url(#purpleGradient)"
                        />

                        {/* Red line - High Risk Threats */}
                        <polyline
                          points="160,100 260,130 360,150 460,170 560,190"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {[160, 260, 360, 460, 560].map((x, i) => {
                          const yValues = [100, 130, 150, 170, 190]
                          return (
                            <g key={`red-${i}`}>
                              <circle
                                cx={x}
                                cy={yValues[i]}
                                r="7"
                                fill="white"
                                stroke="#ef4444"
                                strokeWidth="3"
                              />
                              <circle
                                cx={x}
                                cy={yValues[i]}
                                r="4"
                                fill="#ef4444"
                              />
                            </g>
                          )
                        })}

                        {/* Orange line - Medium Risk Threats */}
                        <polyline
                          points="160,125 260,150 360,165 460,180 560,195"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {[160, 260, 360, 460, 560].map((x, i) => {
                          const yValues = [125, 150, 165, 180, 195]
                          return (
                            <g key={`orange-${i}`}>
                              <circle
                                cx={x}
                                cy={yValues[i]}
                                r="7"
                                fill="white"
                                stroke="#f97316"
                                strokeWidth="3"
                              />
                              <circle
                                cx={x}
                                cy={yValues[i]}
                                r="4"
                                fill="#f97316"
                              />
                            </g>
                          )
                        })}

                        {/* Purple line - Low Risk Threats */}
                        <polyline
                          points="160,170 260,195 360,210 460,220 560,230"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {[160, 260, 360, 460, 560].map((x, i) => {
                          const yValues = [170, 195, 210, 220, 230]
                          return (
                            <g key={`purple-${i}`}>
                              <circle
                                cx={x}
                                cy={yValues[i]}
                                r="7"
                                fill="white"
                                stroke="#a855f7"
                                strokeWidth="3"
                              />
                              <circle
                                cx={x}
                                cy={yValues[i]}
                                r="4"
                                fill="#a855f7"
                              />
                            </g>
                          )
                        })}
                      </svg>

                      {/* Legend */}
                      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-1 bg-red-500 rounded-full" />
                            <span className="text-xs font-medium text-gray-700">High Risk Threats</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-1 bg-orange-500 rounded-full" />
                            <span className="text-xs font-medium text-gray-700">Medium Risk Threats</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-1 bg-purple-500 rounded-full" />
                            <span className="text-xs font-medium text-gray-700">Low Risk Threats</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Threats Blocked</div>
                        <div className="text-4xl font-bold text-gray-900">1,247</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">False Positives</div>
                        <div className="text-4xl font-bold text-gray-900">2.1%</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Response Time</div>
                        <div className="text-4xl font-bold text-gray-900">1.2s</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Placeholder for other Advanced sub-tabs */}
            {advancedSubTab !== "trust-trends" && advancedSubTab !== "platform-analysis" && advancedSubTab !== "risk-assessment" && advancedSubTab !== "threat-intelligence" && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Content coming soon</p>
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "overview" && activeTab !== "trust-ecosystem" && activeTab !== "scoring-model" && activeTab !== "reports" && activeTab !== "security" && activeTab !== "platforms" && activeTab !== "advanced" && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {analyticsTabs.find((t) => t.id === activeTab)?.label} content coming soon
            </p>
          </div>
        )}
      </div>

      <StickyBottomBar />
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AnalyticsContent />
    </Suspense>
  )
}

