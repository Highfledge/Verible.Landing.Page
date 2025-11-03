"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Users, 
  Shield, 
  ChevronDown,
  MapPin,
  Clock,
  User
} from "lucide-react"
import { Header } from "@/components/header"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock data - replace with actual API call later
const mockAlerts = [
  {
    id: "1",
    severity: "critical",
    platform: "facebook",
    description: "Seller 'QuickDeals2024' on Facebook Marketplace showing multiple fraud indicators: new account, stock photos, below-market pricing",
    seller: "QuickDeals2024",
    affectedUsers: 23,
    timeAgo: "38m ago",
    location: "Unknown",
    riskScore: 92,
    hasActionRequired: true
  },
  {
    id: "2",
    severity: "high",
    platform: "instagram",
    description: "Multiple reports of seller 'TechSaver99' requesting payments outside platform (Zelle, CashApp) for electronics",
    seller: "TechSaver99",
    affectedUsers: 8,
    timeAgo: "1h ago",
    location: "Los Angeles, CA",
    riskScore: 85,
    hasActionRequired: false
  },
  {
    id: "3",
    severity: "high",
    platform: "ebay",
    description: "Pattern detected: 15+ fake positive reviews posted within 2 hours for seller 'BargainElectronics'",
    seller: "BargainElectronics",
    affectedUsers: 156,
    timeAgo: "1h ago",
    location: "New York, NY",
    riskScore: 78,
    hasActionRequired: true
  },
  {
    id: "4",
    severity: "medium",
    platform: "etsy",
    description: "Seller 'VintageFinds' repeatedly listing replica items as authentic vintage without proper disclosure",
    seller: "VintageFinds",
    affectedUsers: 12,
    timeAgo: "2h ago",
    location: "Portland, OR",
    riskScore: 65,
    hasActionRequired: false
  }
]

const severityOptions = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "investigating", label: "Investigating" },
  { value: "resolved", label: "Resolved" }
]

const platformLabels: Record<string, string> = {
  facebook: "Facebook Marketplace",
  instagram: "Instagram",
  ebay: "eBay",
  etsy: "Etsy",
  jiji: "Jiji"
}

export default function RiskAlertsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [severityDropdownOpen, setSeverityDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const severityRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (severityRef.current && !severityRef.current.contains(event.target as Node)) {
        setSeverityDropdownOpen(false)
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredAlerts = mockAlerts.filter(alert => {
    if (selectedSeverity !== "all" && alert.severity !== selectedSeverity) return false
    // Status filtering would be based on actual data - for now, all are "active"
    return true
  })

  const criticalCount = mockAlerts.filter(a => a.severity === "critical").length
  const activeThreatsCount = mockAlerts.filter(a => a.severity === "high" || a.severity === "critical").length
  const protectedUsersCount = mockAlerts.reduce((sum, alert) => sum + alert.affectedUsers, 0)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: "bg-blue-100 text-blue-700 border-blue-200",
      instagram: "bg-purple-100 text-purple-700 border-purple-200",
      ebay: "bg-blue-100 text-blue-700 border-blue-200",
      etsy: "bg-orange-100 text-orange-700 border-orange-200",
      jiji: "bg-green-100 text-green-700 border-green-200"
    }
    return colors[platform] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {/* Back to Dashboard */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Risk Alerts</h1>
          <p className="text-gray-600">
            Real-time security alerts and threat intelligence for marketplace safety
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Critical Alerts */}
          <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{criticalCount}</div>
            <p className="text-sm text-gray-600">Critical Alerts</p>
            <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
          </div>

          {/* Active Threats */}
          <div className="bg-white rounded-xl border-2 border-orange-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-orange-500"></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{activeThreatsCount}</div>
            <p className="text-sm text-gray-600">Active Threats</p>
            <p className="text-xs text-gray-500 mt-1">Currently monitoring</p>
          </div>

          {/* Protected Users */}
          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{protectedUsersCount}</div>
            <p className="text-sm text-gray-600">Protected Users</p>
            <p className="text-xs text-gray-500 mt-1">Warned before potential harm</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
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
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 ${
                        selectedSeverity === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
              <Button
                variant="outline"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center justify-between min-w-[150px]"
              >
                <span>{statusOptions.find(opt => opt.value === selectedStatus)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {statusDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedStatus(option.value)
                        setStatusDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 ${
                        selectedStatus === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
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

        {/* Risk Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {/* Header with Severity and Platform */}
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={`${getSeverityColor(alert.severity)} text-xs font-semibold`}>
                  {getSeverityLabel(alert.severity)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {platformLabels[alert.platform] || alert.platform}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{alert.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Seller: <strong className="text-gray-900">{alert.seller}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span><strong className="text-gray-900">{alert.affectedUsers}</strong> users affected</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{alert.timeAgo}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{alert.location}</span>
                </div>
              </div>

              {/* Risk Score and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-gray-600">Risk Score:</span>
                    <span className={`ml-2 text-lg font-bold ${
                      alert.riskScore >= 80 ? 'text-red-600' :
                      alert.riskScore >= 60 ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {alert.riskScore}
                    </span>
                  </div>
                </div>
                <Button variant="outline">View Details</Button>
              </div>

              {/* Action Required Banner */}
              {alert.hasActionRequired && (
                <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800 font-medium">
                      Action Required: This seller has been flagged as high-risk. Exercise extreme caution when interacting with this account.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              No risk alerts match the selected filters.
            </p>
          </div>
        )}
      </div>
      <StickyBottomBar />
    </div>
  )
}

