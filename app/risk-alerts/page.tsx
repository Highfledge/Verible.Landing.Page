"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  AlertTriangle, 
  Users, 
  Shield, 
  ChevronDown,
  MapPin,
  Clock,
  User,
  Loader2,
  TrendingUp,
  ExternalLink
} from "lucide-react"
import { Header } from "@/components/header"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"
import { usersAPI } from "@/lib/api/client"
import { useAuth } from "@/lib/stores/auth-store"
import { cleanText } from "@/lib/utils/clean-data"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

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

interface ThreatsData {
  threats: Threat[]
  count: number
  retrievedAt: string
}

const severityOptions = [
  { value: "all", label: "All Severities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

// Map API severity to lowercase for filtering
const normalizeSeverity = (severity: string): string => {
  return severity.toLowerCase()
}

const getSeverityColor = (severity: string) => {
  const normalized = normalizeSeverity(severity)
  switch (normalized) {
    case "critical": return "bg-red-100 text-red-700 border-red-200"
    case "high": return "bg-orange-100 text-orange-700 border-orange-200"
    case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "low": return "bg-blue-100 text-blue-700 border-blue-200"
    default: return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getSeverityLabel = (severity: string) => {
  return severity.toUpperCase()
}

const getRiskScoreColor = (score: number) => {
  if (score >= 80) return "text-red-600"
  if (score >= 60) return "text-orange-600"
  if (score >= 40) return "text-yellow-600"
  return "text-blue-600"
}

const getPlatformColor = (platform: string) => {
  const platformLower = platform.toLowerCase()
  const colors: Record<string, string> = {
    "facebook marketplace": "bg-blue-100 text-blue-700 border-blue-200",
    "facebook": "bg-blue-100 text-blue-700 border-blue-200",
    "jiji": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "jumia": "bg-orange-100 text-orange-700 border-orange-200",
    "konga": "bg-green-100 text-green-700 border-green-200",
    "ebay": "bg-blue-100 text-blue-700 border-blue-200",
    "etsy": "bg-orange-100 text-orange-700 border-orange-200"
  }
  return colors[platformLower] || "bg-gray-100 text-gray-700 border-gray-200"
}

export default function RiskAlertsPage() {
  const { isLoggedIn, user } = useAuth()
  const [threats, setThreats] = useState<Threat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [severityDropdownOpen, setSeverityDropdownOpen] = useState(false)
  const severityRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (severityRef.current && !severityRef.current.contains(event.target as Node)) {
        setSeverityDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch threats data
  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      setIsLoading(false)
      return
    }

    const fetchThreats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await usersAPI.getTopThreats({
          limit: 50
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
          setError("Failed to load threats")
        }
      } catch (err: any) {
        console.error("Error fetching threats:", err)
        setError(err.response?.data?.message || "Failed to load risk alerts")
        toast.error("Failed to load risk alerts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchThreats()
  }, [isLoggedIn, user])

  // Filter threats by severity
  const filteredThreats = threats.filter(threat => {
    if (selectedSeverity === "all") return true
    return normalizeSeverity(threat.severity) === selectedSeverity
  })

  // Calculate statistics
  const criticalCount = threats.filter(t => normalizeSeverity(t.severity) === "critical").length
  const highCount = threats.filter(t => normalizeSeverity(t.severity) === "high").length
  const activeThreatsCount = criticalCount + highCount
  const protectedUsersCount = threats.reduce((sum, threat) => sum + threat.usersAffected, 0)
  const totalThreats = threats.length

  // Redirect if not logged in as buyer
  if (!isLoggedIn || user?.role !== "user") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
          <Card className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">You need to be logged in as a buyer to view risk alerts.</p>
            <Link href="/auth?mode=login">
              <Button>Sign In</Button>
            </Link>
          </Card>
        </div>
        <StickyBottomBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {/* Back to Dashboard */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Risk Alerts</h1>
          <p className="text-gray-600 text-lg">
            Real-time security alerts and threat intelligence for marketplace safety
          </p>
        </div>

        {isLoading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading risk alerts...</span>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-8 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">Error Loading Alerts</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Summary Cards - Trustpilot Style */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Threats */}
              <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{totalThreats}</div>
                  <p className="text-sm text-gray-600 font-medium">Total Threats</p>
                  <p className="text-xs text-gray-500 mt-1">Currently monitored</p>
                </div>
              </Card>

              {/* Critical Alerts */}
              <Card className="border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{criticalCount}</div>
                  <p className="text-sm text-gray-600 font-medium">Critical Alerts</p>
                  <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
                </div>
              </Card>

              {/* Active Threats */}
              <Card className="border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{activeThreatsCount}</div>
                  <p className="text-sm text-gray-600 font-medium">Active Threats</p>
                  <p className="text-xs text-gray-500 mt-1">High & Critical severity</p>
                </div>
              </Card>

              {/* Protected Users */}
              <Card className="border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{protectedUsersCount}</div>
                  <p className="text-sm text-gray-600 font-medium">Users Protected</p>
                  <p className="text-xs text-gray-500 mt-1">Warned before potential harm</p>
                </div>
              </Card>
            </div>

            {/* Filters Section */}
            <Card className="mb-6 border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {/* Severity Filter */}
                  <div className="relative" ref={severityRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity:</label>
                    <Button
                      variant="outline"
                      onClick={() => setSeverityDropdownOpen(!severityDropdownOpen)}
                      className="flex items-center justify-between min-w-[150px]"
                    >
                      <span>{severityOptions.find(opt => opt.value === selectedSeverity)?.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${severityDropdownOpen ? 'rotate-180' : ''}`} />
                    </Button>

                    {severityDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {severityOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedSeverity(option.value)
                              setSeverityDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                              selectedSeverity === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Risk Alerts List */}
            {filteredThreats.length === 0 ? (
              <Card className="p-12 text-center border border-gray-200 shadow-sm">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">
                  {selectedSeverity === "all" 
                    ? "No risk alerts available at this time." 
                    : `No ${selectedSeverity} severity alerts found.`}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredThreats.map((threat) => (
                  <Card 
                    key={threat.sellerId} 
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="p-6">
                      {/* Header with Severity and Platform */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <Badge className={`${getSeverityColor(threat.severity)} text-xs font-semibold px-3 py-1`}>
                            {getSeverityLabel(threat.severity)}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getPlatformColor(threat.platform)}`}>
                            {threat.platform}
                          </Badge>
                          {threat.flagCount > 0 && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                              {threat.flagCount} {threat.flagCount === 1 ? 'flag' : 'flags'}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{threat.timeAgo}</span>
                        </div>
                      </div>

                      {/* Seller Name and Description */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {threat.sellerName}
                          </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border-l-4 border-gray-200">
                          {threat.description}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-gray-900 font-medium">{threat.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Users Affected</p>
                            <p className="text-gray-900 font-medium">{threat.usersAffected}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Last Scored</p>
                            <p className="text-gray-900 font-medium text-xs">
                              {new Date(threat.lastScored).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Risk Score</p>
                            <p className={`text-lg font-bold ${getRiskScoreColor(threat.riskScore)}`}>
                              {threat.riskScore}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Score Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Risk Level</span>
                          <span className={`text-sm font-bold ${getRiskScoreColor(threat.riskScore)}`}>
                            {threat.riskScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              threat.riskScore >= 80 ? 'bg-red-500' :
                              threat.riskScore >= 60 ? 'bg-orange-500' :
                              threat.riskScore >= 40 ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(threat.riskScore, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Required Banner for High Risk */}
                      {(normalizeSeverity(threat.severity) === "critical" || normalizeSeverity(threat.severity) === "high" || threat.riskScore >= 70) && (
                        <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-red-800 font-medium mb-1">
                                High Risk Alert
                              </p>
                              <p className="text-sm text-red-700">
                                This seller has been flagged as high-risk. Exercise extreme caution when interacting with this account.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <StickyBottomBar />
    </div>
  )
}
