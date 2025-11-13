"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/stores/auth-store"
import { usersAPI } from "@/lib/api/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ThumbsUp, 
  Flag, 
  Search, 
  Clock, 
  ExternalLink,
  Star,
  Shield,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Activity {
  type: "endorsement" | "flag" | "extraction"
  timestamp: string
  details: {
    seller?: {
      id: string
      name: string
      platform: string
      profileUrl: string
      pulseScore: number
    }
    reason?: string
    isVerified?: boolean
  }
}

interface ActivityData {
  activities: Activity[]
  summary: {
    total: number
    byType: {
      extraction: number
      flag: number
      endorsement: number
    }
  }
  pagination: {
    limit: number
    returned: number
    total: number
    hasMore: boolean
  }
  timeRange: string
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "endorsement":
      return ThumbsUp
    case "flag":
      return Flag
    case "extraction":
      return Search
    default:
      return Clock
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "endorsement":
      return "bg-green-500"
    case "flag":
      return "bg-red-500"
    case "extraction":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

const getActivityLabel = (type: string) => {
  switch (type) {
    case "endorsement":
      return "Endorsed"
    case "flag":
      return "Flagged"
    case "extraction":
      return "Analyzed"
    default:
      return "Activity"
  }
}

const formatTimeAgo = (timestamp: string): string => {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return "just now"
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
    }
    
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
  } catch {
    return "Recently"
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

interface RecentActivityProps {
  hideHeader?: boolean
  compact?: boolean
}

export function RecentActivity({ hideHeader = false, compact = false }: RecentActivityProps) {
  const { isLoggedIn, user, isBuyerView } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [summary, setSummary] = useState<ActivityData["summary"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if user is a logged-in buyer (or seller viewing as buyer)
  const isBuyer = isLoggedIn && (user?.role === "user" || (user?.role === "seller" && isBuyerView))

  useEffect(() => {
    // Only fetch if user is a logged-in buyer
    if (!isBuyer) {
      setIsLoading(false)
      return
    }

    const fetchActivities = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await usersAPI.getRecentActivity({
          limit: 10,
          timeRange: "30d"
        })
        
        if (response.success && response.data) {
          setActivities(response.data.activities || [])
          setSummary(response.data.summary || null)
        } else {
          setError("Failed to load activities")
        }
      } catch (err: any) {
        console.error("Error fetching activities:", err)
        setError(err.response?.data?.message || "Failed to load recent activity")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [isBuyer])

  // Only show for logged-in buyers
  if (!isBuyer) {
    return null
  }

  if (isLoading) {
    return (
      <div className="w-full">
        {!hideHeader && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
          </div>
        )}
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading activities...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        {!hideHeader && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
          </div>
        )}
        <div className="p-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="w-full">
        {!hideHeader && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
            {summary && (
              <p className="text-sm text-gray-500">
                {summary.total} {summary.total === 1 ? "activity" : "activities"} in the last 30 days
              </p>
            )}
          </div>
        )}
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No recent activity</p>
          <p className="text-sm text-gray-500 mt-1">
            Your seller searches and interactions will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {!hideHeader && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            {summary && summary.total > 0 && (
              <Badge variant="outline" className="text-sm">
                {summary.total} {summary.total === 1 ? "activity" : "activities"}
              </Badge>
            )}
          </div>
          {summary && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{summary.byType.endorsement} endorsements</span>
              <span>•</span>
              <span>{summary.byType.flag} flags</span>
              <span>•</span>
              <span>{summary.byType.extraction} analyses</span>
            </div>
          )}
        </div>
      )}
      
      <div className={`flex-1 ${compact ? 'space-y-4' : 'overflow-y-auto pr-2 space-y-4 scrollbar-thin max-h-[600px]'}`}>
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type)
          const iconColor = getActivityColor(activity.type)
          const activityLabel = getActivityLabel(activity.type)
          const seller = activity.details?.seller
          
          return (
            <Card
              key={index}
              className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`${iconColor} rounded-full p-2.5 flex-shrink-0 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {activityLabel} seller
                        </span>
                        {seller && (
                          <Link
                            href={seller.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                          >
                            {seller.name}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      
                      {seller && (
                        <div className="flex items-center gap-3 mt-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs font-medium border-gray-300"
                          >
                            {seller.platform}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className={`w-4 h-4 ${getScoreColor(seller.pulseScore)} fill-current`} />
                            <span className={`text-sm font-semibold ${getScoreColor(seller.pulseScore)}`}>
                              {seller.pulseScore}
                            </span>
                            <span className="text-xs text-gray-500">Pulse Score</span>
                          </div>
                          {activity.details?.isVerified && (
                            <div className="flex items-center gap-1">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {activity.details?.reason && (
                        <p className="text-sm text-gray-700 mt-3 leading-relaxed bg-gray-50 rounded-lg p-3 border-l-4 border-gray-200">
                          "{activity.details.reason}"
                        </p>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

