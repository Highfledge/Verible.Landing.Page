"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle, Building2, BarChart3, MessageSquare, TrendingUp, Flag, ThumbsUp, Loader2, X, CheckCircle, Clock, User as UserIcon, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/stores/auth-store"
import { sellersAPI } from "@/lib/api/client"
import { toast } from "sonner"

export function QuickActions() {
  const router = useRouter()
  const { isLoggedIn, user } = useAuth()
  const [showFeedbacks, setShowFeedbacks] = useState(false)
  const [feedbackData, setFeedbackData] = useState<any | null>(null)
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any | null>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return dateString
    }
  }

  // Check if a key is an ID field
  const isIdField = (key: string) => {
    return key === '_id' || key === 'id' || key.endsWith('Id') || key.endsWith('ID')
  }

  // Check if a value looks like an ID (MongoDB ObjectId format)
  const looksLikeId = (value: any): boolean => {
    if (typeof value !== 'string') return false
    // MongoDB ObjectId is 24 hex characters
    return /^[0-9a-fA-F]{24}$/.test(value)
  }
  
  // Don't show for non-logged-in users
  if (!isLoggedIn) {
    return null
  }

  const handleViewFeedbacks = async () => {
    if (showFeedbacks && feedbackData) {
      // If already showing, just toggle
      setShowFeedbacks(false)
      return
    }

    // Close analytics if open
    if (showAnalytics) {
      setShowAnalytics(false)
      setAnalyticsData(null)
    }

    setIsLoadingFeedbacks(true)
    try {
      // First, get the seller profile to obtain the seller ID
      const profileResponse = await sellersAPI.getMySellerProfile()
      
      if (!profileResponse.success || !profileResponse.data?.seller?._id) {
        toast.error("Failed to get seller ID. Please try again.")
        return
      }

      const sellerId = profileResponse.data.seller._id
      
      const response = await sellersAPI.getSellerFeedback(sellerId)
      
      if (response.success && response.data) {
        setFeedbackData(response.data)
        setShowFeedbacks(true)
      } else {
        toast.error(response.message || "Failed to load feedbacks")
      }
    } catch (error: any) {
      console.error("Error loading feedbacks:", error)
      toast.error(error.response?.data?.message || "Failed to load feedbacks. Please try again.")
    } finally {
      setIsLoadingFeedbacks(false)
    }
  }

  const handleViewAnalytics = async () => {
    if (showAnalytics && analyticsData) {
      // If already showing, just toggle
      setShowAnalytics(false)
      return
    }

    // Close feedbacks if open
    if (showFeedbacks) {
      setShowFeedbacks(false)
      setFeedbackData(null)
    }

    setIsLoadingAnalytics(true)
    try {
      // First, get the seller profile to obtain the seller ID
      const profileResponse = await sellersAPI.getMySellerProfile()
      
      if (!profileResponse.success || !profileResponse.data?.seller?._id) {
        toast.error("Failed to get seller ID. Please try again.")
        return
      }

      const sellerId = profileResponse.data.seller._id
      
      const response = await sellersAPI.getSellerAnalytics(sellerId)
      
      if (response.success && response.data) {
        setAnalyticsData(response.data)
        setShowAnalytics(true)
      } else {
        toast.error(response.message || "Failed to load analytics")
      }
    } catch (error: any) {
      console.error("Error loading analytics:", error)
      toast.error(error.response?.data?.message || "Failed to load analytics. Please try again.")
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  // Seller-specific actions
  if (user?.role === "seller") {
    const sellerActions = [
      {
        label: "My Feedbacks",
        icon: MessageSquare,
        color: "bg-blue-500 hover:bg-blue-600",
        onClick: handleViewFeedbacks
      },
      {
        label: "My Analytics",
        icon: TrendingUp,
        color: "bg-purple-500 hover:bg-purple-600",
        onClick: handleViewAnalytics
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            {sellerActions.map((action) => {
              const Icon = action.icon
              const isLoading = (action.label === "My Feedbacks" && isLoadingFeedbacks) || 
                               (action.label === "My Analytics" && isLoadingAnalytics)
              return (
                <Button
                  key={action.label}
                  onClick={action.onClick}
                  disabled={isLoading}
                  className={`${action.color} text-white h-auto py-3 px-4 flex flex-col items-center justify-center space-y-3 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Icon className="w-8 h-8" />
                  )}
                  <span className="text-sm font-semibold">{action.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Feedbacks Display */}
          {showFeedbacks && feedbackData && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">My Feedbacks</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFeedbacks(false)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Total Flags</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600">{feedbackData.totalFlags || 0}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Total Endorsements</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{feedbackData.totalEndorsements || 0}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Net Feedback Score</span>
                  </div>
                  <div className={`text-3xl font-bold ${(feedbackData.netFeedbackScore || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(feedbackData.netFeedbackScore || 0) >= 0 ? '+' : ''}{feedbackData.netFeedbackScore || 0}
                  </div>
                </div>
              </div>

              {/* Flags Section */}
              {feedbackData.flags && feedbackData.flags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-500" />
                    Flags ({feedbackData.flags.length})
                  </h4>
                  <div className="space-y-4">
                    {feedbackData.flags.map((flag: any) => (
                      <div key={flag._id} className="bg-white rounded-lg p-5 border-l-4 border-red-500 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <UserIcon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {flag.userId?.name || "Anonymous User"}
                              </span>
                              {flag.isVerified && (
                                <Badge variant="success" className="text-xs">Verified</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3">{flag.reason}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(flag.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {flag.adminReview && (
                          <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-gray-900">Admin Review</span>
                              <Badge 
                                variant={flag.adminReview.action === "upheld" ? "destructive" : "success"}
                                className="text-xs"
                              >
                                {flag.adminReview.action === "upheld" ? "Upheld" : "Dismissed"}
                              </Badge>
                            </div>
                            {flag.adminReview.adminNotes && (
                              <p className="text-sm text-gray-700 mt-2">{flag.adminReview.adminNotes}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Reviewed on {formatDate(flag.adminReview.reviewedAt)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Endorsements Section */}
              {feedbackData.endorsements && feedbackData.endorsements.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    Endorsements ({feedbackData.endorsements.length})
                  </h4>
                  <div className="space-y-4">
                    {feedbackData.endorsements.map((endorsement: any) => (
                      <div key={endorsement._id} className="bg-white rounded-lg p-5 border-l-4 border-green-500 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <UserIcon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {endorsement.userId?.name || "Anonymous User"}
                              </span>
                              {endorsement.isVerified && (
                                <Badge variant="success" className="text-xs">Verified</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3">{endorsement.reason}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(endorsement.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {endorsement.adminReview && (
                          <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-gray-900">Admin Review</span>
                              <Badge 
                                variant={endorsement.adminReview.action === "upheld" ? "success" : "outline"}
                                className="text-xs"
                              >
                                {endorsement.adminReview.action === "upheld" ? "Upheld" : "Dismissed"}
                              </Badge>
                            </div>
                            {endorsement.adminReview.adminNotes && (
                              <p className="text-sm text-gray-700 mt-2">{endorsement.adminReview.adminNotes}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Reviewed on {formatDate(endorsement.adminReview.reviewedAt)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {(!feedbackData.flags || feedbackData.flags.length === 0) && 
               (!feedbackData.endorsements || feedbackData.endorsements.length === 0) && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Feedbacks Yet</h4>
                  <p className="text-gray-600">You haven't received any flags or endorsements yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Display */}
          {showAnalytics && analyticsData && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">My Analytics</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnalytics(false)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>

              {/* Analytics Content */}
              <div className="space-y-6">
                {/* Display analytics data in a flexible format */}
                {analyticsData && typeof analyticsData === 'object' && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(analyticsData).map(([key, value]: [string, any]) => {
                        // Skip ID fields
                        if (isIdField(key) || looksLikeId(value)) {
                          return null
                        }
                        
                        // Skip nested objects for now, display them separately
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                          return null
                        }
                        
                        // Format the key for display
                        const displayKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim()
                        
                        // Format date values
                        let displayValue = value
                        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                          displayValue = formatDate(value)
                        } else if (Array.isArray(value)) {
                          displayValue = value.length
                        } else {
                          displayValue = value?.toString() || 'N/A'
                        }
                        
                        return (
                          <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-600">{displayKey}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {displayValue}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Display nested objects */}
                    {Object.entries(analyticsData).map(([key, value]: [string, any]) => {
                      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const displayKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim()
                        
                        return (
                          <div key={key} className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <BarChart className="w-5 h-5 text-purple-500" />
                              {displayKey}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.entries(value).map(([subKey, subValue]: [string, any]) => {
                                // Skip ID fields
                                if (isIdField(subKey) || looksLikeId(subValue)) {
                                  return null
                                }
                                
                                const displaySubKey = subKey
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, str => str.toUpperCase())
                                  .trim()
                                
                                // Format date values
                                let displaySubValue = subValue
                                if (typeof subValue === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(subValue)) {
                                  displaySubValue = formatDate(subValue)
                                } else if (Array.isArray(subValue)) {
                                  displaySubValue = subValue.length
                                } else {
                                  displaySubValue = subValue?.toString() || 'N/A'
                                }
                                
                                return (
                                  <div key={subKey} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 mb-1">{displaySubKey}</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                      {displaySubValue}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}

                {/* Empty State */}
                {(!analyticsData || (typeof analyticsData === 'object' && Object.keys(analyticsData).length === 0)) && (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h4>
                    <p className="text-gray-600">Analytics data will appear here once available.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Buyer-specific actions
  if (user?.role === "user") {
    const buyerActions = [
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
      label: "For Businesses",
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
            {buyerActions.map((action) => {
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

  return null
}
