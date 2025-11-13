"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Star,
  MessageSquare,
  Package,
  Users,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Verified,
  Flag,
  Award,
  History,
  Activity,
  Globe,
  TrendingDown,
  AlertCircle
} from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { cleanText } from "@/lib/utils/clean-data"
import Link from "next/link"

interface SellerProfileDisplayProps {
  data: any
  isLoggedIn: boolean
}

// Convert pulse score (0-100) to star rating (0-5)
const getStarRating = (pulseScore: number): number => {
  return Math.round((pulseScore / 100) * 5 * 10) / 10 // Round to 1 decimal
}

// Get star display (filled/half/empty)
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative w-5 h-5">
          <Star className="w-5 h-5 fill-gray-300 text-gray-300 absolute" />
          <div className="overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 fill-gray-300 text-gray-300" />
      ))}
    </div>
  )
}

// Get trust badge color based on score
const getTrustBadgeColor = (score: number) => {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

// Get trust label
const getTrustLabel = (score: number) => {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Great"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Poor"
}

// Format date - returns formatted date or "No date available"
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || typeof dateString !== "string") {
    return "No date available"
  }
  
  const trimmed = dateString.trim()
  if (trimmed === "" || trimmed === "null" || trimmed === "undefined") {
    return "No date available"
  }
  
  try {
    const date = new Date(trimmed)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "No date available"
    }
    
    // Format the date
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    })
  } catch (error) {
    return "No date available"
  }
}

// Format date with time
const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString || typeof dateString !== "string") {
    return "No date available"
  }
  
  const trimmed = dateString.trim()
  if (trimmed === "" || trimmed === "null" || trimmed === "undefined") {
    return "No date available"
  }
  
  try {
    const date = new Date(trimmed)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "No date available"
    }
    
    // Format the date with time
    return date.toLocaleString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  } catch (error) {
    return "No date available"
  }
}

// Format relative time (e.g., "2 hours ago", "3 days ago")
const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString || typeof dateString !== "string") {
    return "No date available"
  }
  
  const trimmed = dateString.trim()
  if (trimmed === "" || trimmed === "null" || trimmed === "undefined") {
    return "No date available"
  }
  
  try {
    const date = new Date(trimmed)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "No date available"
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    // If date is in the future, return formatted date
    if (diffInSeconds < 0) {
      return formatDate(dateString)
    }
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return "Just now"
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
    }
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    }
    
    // Less than a month
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
    }
    
    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
    }
    
    // More than a year - show formatted date
    return formatDate(dateString)
  } catch (error) {
    return "No date available"
  }
}

// Get platform badge color
const getPlatformColor = (platform: string) => {
  const colors: Record<string, string> = {
    facebook: "bg-blue-100 text-blue-700 border-blue-300",
    jiji: "bg-yellow-100 text-yellow-700 border-yellow-300",
    ebay: "bg-blue-100 text-blue-700 border-blue-300",
    etsy: "bg-orange-100 text-orange-700 border-orange-300",
    jumia: "bg-orange-100 text-orange-700 border-orange-300",
    kijiji: "bg-red-100 text-red-700 border-red-300",
    konga: "bg-green-100 text-green-700 border-green-300",
  }
  return colors[platform?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-300"
}

export function SellerProfileDisplay({ data, isLoggedIn }: SellerProfileDisplayProps) {
  const seller = data?.seller || {}
  const extractedData = data?.extractedData || {}
  const scoringResult = data?.scoringResult || {}
  const marketplaceData = extractedData?.marketplaceData || seller?.marketplaceData || {}
  const profileData = seller?.profileData || extractedData?.profileData || {}

  // Calculate star rating - prioritize avgRating if available, otherwise use pulseScore
  const pulseScore = seller?.pulseScore || 0
  const avgRating = marketplaceData.avgRating || 0
  const starRating = avgRating > 0 ? avgRating : getStarRating(pulseScore)
  const trustLabel = getTrustLabel(pulseScore)
  const totalReviews = marketplaceData.totalReviews || 0
  const totalListings = marketplaceData.totalListings || 0
  const responseRate = marketplaceData.responseRate || 0
  const followers = marketplaceData.followers || 0
  const accountAge = marketplaceData.accountAge || 0
  
  // Platform verification (marketplace) vs Verible verification (our platform)
  const marketplaceVerificationStatus = marketplaceData.verificationStatus || "unverified"
  const veribleVerificationStatus = seller?.verificationStatus || "unverified"
  
  const lastSeen = marketplaceData.lastSeen || "Unknown"
  // Ensure arrays are actually arrays and handle null/undefined
  const categories = Array.isArray(marketplaceData.categories) ? marketplaceData.categories : []
  const recommendations = Array.isArray(scoringResult?.recommendations) ? scoringResult?.recommendations : []
  const riskFactors = Array.isArray(scoringResult?.riskFactors) ? scoringResult?.riskFactors : []
  const trustIndicators = scoringResult?.trustIndicators || {}
  const sellerTrustIndicators = seller?.trustIndicators || extractedData?.trustIndicators || {}
  const scoringFactors = seller?.scoringFactors || {}
  
  // Our platform data - ensure arrays are actually arrays
  const recentListings = Array.isArray(seller?.recentListings) 
    ? seller.recentListings 
    : Array.isArray(extractedData?.recentListings) 
    ? extractedData.recentListings 
    : []
  const listingHistory = Array.isArray(seller?.listingHistory) ? seller.listingHistory : []
  const flags = Array.isArray(seller?.flags) ? seller.flags : []
  const endorsements = Array.isArray(seller?.endorsements) ? seller.endorsements : []
  const platform = extractedData?.platform || seller?.platform || "unknown"
  const lastScored = seller?.lastScored
  const isActive = seller?.isActive ?? true
  const isClaimed = seller?.isClaimed ?? false
  const firstSeen = seller?.firstSeen
  const lastSeenPlatform = seller?.lastSeen
  const createdAt = seller?.createdAt
  const updatedAt = seller?.updatedAt

  // Format account age
  const formatAccountAge = (days: number) => {
    if (days === 0) return "New account"
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.floor(days / 30)} months`
    return `${Math.floor(days / 365)} years`
  }

  return (
    <div className="space-y-6">
      {/* Trustpilot-style Header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        {/* Top Banner with Trust Score */}
        <div className={`${getTrustBadgeColor(pulseScore)} px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">Trust Score</p>
                <p className="text-3xl font-bold">{pulseScore}</p>
              </div>
              <div className="border-l border-white/30 pl-4">
                <p className="text-sm font-medium opacity-90">{trustLabel}</p>
                <p className="text-xs opacity-75 capitalize">{seller?.confidenceLevel || "Medium"} Confidence</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Marketplace Verification */}
              {marketplaceVerificationStatus !== "unverified" && (
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium capitalize">
                    {marketplaceVerificationStatus.replace("-", " ")} on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                </div>
              )}
              {/* Verible Platform Verification */}
              {veribleVerificationStatus === "verified" && (
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Verified className="w-5 h-5" />
                  <span className="font-medium">Verified on Verible</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                <ImageWithFallback
                  src={profileData.profilePicture}
                  alt={cleanText(profileData.name) || "Seller"}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover border-4 border-gray-100 shadow-md"
                  fallbackLetter={profileData.name?.charAt(0)?.toUpperCase() || "S"}
                  showFallbackLetter={true}
                />
                {veribleVerificationStatus === "verified" && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
                    <Verified className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {cleanText(profileData.name) || "Unknown Seller"}
                    </h1>
                    <Badge className={`border ${getPlatformColor(platform)}`}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    {profileData.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{cleanText(profileData.location)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last seen {lastSeen}</span>
                    </div>
                  </div>
                </div>
                {(seller?.profileUrl || extractedData?.profileUrl) && (
                  <a
                    href={seller?.profileUrl || extractedData?.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Star Rating Section - Trustpilot Style */}
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {renderStars(starRating)}
                        <span className="text-2xl font-bold text-gray-900">{starRating}</span>
                        <span className="text-gray-600">/ 5</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Based on {totalReviews > 0 ? `${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}` : 'Trust Score analysis'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-900">{pulseScore}</p>
                    <p className="text-sm text-gray-600">Pulse Score</p>
                  </div>
                </div>

                {/* Trust Indicators Bar from Scoring Result */}
                {Object.keys(trustIndicators).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    {Object.entries(trustIndicators).map(([key, value]) => {
                      const percent = typeof value === 'number' ? value : parseInt(String(value).replace('%', '')) || 0
                      const label = key.replace(/([A-Z])/g, ' $1').trim()
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">{label}</span>
                            <span className="text-xs font-medium text-gray-900">{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                percent >= 80 ? 'bg-green-500' :
                                percent >= 60 ? 'bg-yellow-500' :
                                percent >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Bio */}
              {profileData.bio && (
                <p className="text-gray-700 leading-relaxed mb-4">{cleanText(profileData.bio)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Trustpilot Style Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalReviews}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
          {avgRating > 0 && (
            <div className="text-xs text-gray-500 mt-1">Avg: {avgRating.toFixed(1)}/5</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-3">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalListings}</div>
          <div className="text-sm text-gray-600">Total Listings</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{followers}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatAccountAge(accountAge)}</div>
          <div className="text-sm text-gray-600">Account Age</div>
        </div>
      </div>

      {/* Verible Platform Data Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Verible Platform Data</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Verible Verification Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Verible Verification</span>
              <Badge 
                variant={veribleVerificationStatus === "verified" ? "success" : "outline"}
                className="text-xs"
              >
                {veribleVerificationStatus === "verified" ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Status on Verible platform</p>
          </div>

          {/* Account Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Account Status</span>
              <Badge 
                variant={isActive ? "success" : "outline"}
                className="text-xs"
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Seller account status</p>
          </div>

          {/* Claimed Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Claimed</span>
              <Badge 
                variant={isClaimed ? "success" : "outline"}
                className="text-xs"
              >
                {isClaimed ? "Claimed" : "Unclaimed"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Whether seller has claimed their profile</p>
          </div>

          {/* Last Scored */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Last Scored</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-900 font-medium">{formatDateTime(lastScored)}</p>
            <p className="text-xs text-gray-500">Last trust score calculation</p>
          </div>

          {/* First Seen */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">First Seen</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-900 font-medium">{formatDate(firstSeen)}</p>
            <p className="text-xs text-gray-500">First detected on Verible</p>
          </div>

          {/* Last Seen Platform */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Last Seen</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-900 font-medium">{formatRelativeTime(lastSeenPlatform)}</p>
            <p className="text-xs text-gray-500">Last activity on Verible</p>
          </div>

          {/* Created At */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Created At</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-900 font-medium">{formatDate(createdAt)}</p>
            <p className="text-xs text-gray-500">Profile created date</p>
          </div>

          {/* Updated At */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Updated At</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-900 font-medium">{formatDateTime(updatedAt)}</p>
            <p className="text-xs text-gray-500">Last profile update</p>
          </div>
        </div>
      </div>

      {/* Scoring Factors - Verible Platform */}
      {Object.keys(scoringFactors).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Scoring Factors</h3>
            <Badge variant="outline" className="text-xs ml-2">Verible Analysis</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scoringFactors).map(([key, value]) => {
              // Handle nested object structure (score, available, breakdown) or direct number
              let score: number = 0
              let isAvailable: boolean = true
              let breakdown: any = null
              
              if (typeof value === 'number') {
                score = value
              } else if (typeof value === 'object' && value !== null) {
                score = typeof value.score === 'number' ? value.score : 0
                isAvailable = typeof value.available === 'boolean' ? value.available : true
                breakdown = value.breakdown || null
              }
              
              const label = key.replace(/([A-Z])/g, ' $1').trim()
              
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <div className="flex items-center gap-2">
                      {!isAvailable && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          N/A
                        </Badge>
                      )}
                      {isAvailable && (
                        <span className="text-sm font-bold text-gray-900">
                          {score !== null && score !== undefined ? score : 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                  {isAvailable && score !== null && score !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          score >= 80 ? 'bg-green-500' :
                          score >= 60 ? 'bg-yellow-500' :
                          score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                      />
                    </div>
                  )}
                  {!isAvailable && breakdown && (
                    <p className="text-xs text-gray-500 mt-1">
                      {typeof breakdown === 'object' && breakdown.message 
                        ? breakdown.message 
                        : 'Data not available'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Flags and Endorsements - Verible Platform */}
      {(flags.length > 0 || endorsements.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Verible Community Feedback</h3>
            <Badge variant="outline" className="text-xs ml-2">Platform Data</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Flags */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Flag className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-900">Flags ({flags.length})</h4>
              </div>
              {flags.length > 0 ? (
                <div className="space-y-2">
                  {flags.slice(0, 5).map((flag: any, index: number) => (
                    <div key={index} className="bg-white rounded p-2 text-sm text-gray-700">
                      {flag.reason || flag.message || "Flagged by community"}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No flags reported</p>
              )}
            </div>

            {/* Endorsements */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Endorsements ({endorsements.length})</h4>
              </div>
              {endorsements.length > 0 ? (
                <div className="space-y-2">
                  {endorsements.slice(0, 5).map((endorsement: any, index: number) => (
                    <div key={index} className="bg-white rounded p-2 text-sm text-gray-700">
                      {endorsement.reason || endorsement.message || "Endorsed by community"}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No endorsements yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listing History - Verible Platform */}
      {listingHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Listing History</h3>
            <Badge variant="outline" className="text-xs ml-2">Verible Platform</Badge>
          </div>
          <div className="space-y-3">
            {listingHistory.slice(0, 10).map((listing: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {listing.title || listing.name || `Listing ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {listing.date ? formatDate(listing.date) : listing.createdAt ? formatDate(listing.createdAt) : "No date available"}
                    </p>
                  </div>
                  {listing.price && (
                    <Badge variant="outline" className="ml-2">
                      {listing.price}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Listings - Marketplace */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Listings</h3>
          <Badge variant="outline" className="text-xs ml-2 capitalize">{platform}</Badge>
        </div>
        {recentListings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentListings.slice(0, 9).map((listing: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                {listing.image && (
                  <div className="w-full h-32 bg-gray-200 rounded mb-3 overflow-hidden">
                    <img src={listing.image} alt={listing.title || "Listing"} className="w-full h-full object-cover" />
                  </div>
                )}
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {listing.title || listing.name || `Listing ${index + 1}`}
                </h4>
                {listing.price && (
                  <p className="text-sm font-bold text-blue-600">{listing.price}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {listing.date ? formatDate(listing.date) : listing.createdAt ? formatDate(listing.createdAt) : "No date available"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No recent listings</p>
            <p className="text-sm text-gray-500 mt-1">This seller hasn't posted any recent listings</p>
          </div>
        )}
      </div>

      {/* Trust Indicators from Seller/Extracted Data */}
      {Object.keys(sellerTrustIndicators).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Trust Indicators</h3>
            <Badge variant="outline" className="text-xs ml-2">Marketplace Data</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(sellerTrustIndicators).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').trim()
              
              // Handle different value types safely
              let displayValue: string
              if (value === null || value === undefined) {
                displayValue = "N/A"
              } else if (typeof value === 'boolean') {
                displayValue = value ? "Yes" : "No"
              } else if (typeof value === 'number') {
                displayValue = value.toString()
              } else if (typeof value === 'object') {
                // If it's an object, try to extract a meaningful value or stringify safely
                displayValue = JSON.stringify(value).length > 50 
                  ? "See details" 
                  : JSON.stringify(value)
              } else {
                displayValue = String(value)
              }
              
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={`text-sm font-medium ${
                      typeof value === 'boolean' && value 
                        ? 'text-green-600' 
                        : typeof value === 'boolean' && !value
                        ? 'text-red-600'
                        : value === null || value === undefined
                        ? 'text-gray-400'
                        : 'text-gray-900'
                    }`}>
                      {displayValue}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Response Rate & Additional Info */}
      {(responseRate > 0 || categories.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {responseRate > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Response Rate</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${responseRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{responseRate}%</span>
                </div>
              </div>
            )}

            {categories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Seller Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category: any, index: number) => {
                    // Handle both string and object formats
                    let cleanCategoryName: string
                    let categoryCount: number | null = null
                    
                    if (typeof category === 'string') {
                      cleanCategoryName = cleanText(category) || `Category ${index + 1}`
                    } else if (typeof category === 'object' && category !== null) {
                      cleanCategoryName = cleanText(category.name || category.title || category.label || category) || `Category ${index + 1}`
                      categoryCount = typeof category.count === 'number' ? category.count : null
                    } else {
                      cleanCategoryName = `Category ${index + 1}`
                    }
                    
                    if (!cleanCategoryName || cleanCategoryName.length > 50) return null
                    
                    return (
                      <Badge key={index} variant="outline" className="text-xs py-1 px-3">
                        {cleanCategoryName}
                        {categoryCount !== null && categoryCount > 0 && (
                          <span className="ml-1 text-gray-500">({categoryCount})</span>
                        )}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec: any, index: number) => {
              // Handle both string and object formats
              const recType = typeof rec === 'object' && rec !== null ? (rec.type || rec.priority || 'warning') : 'warning'
              const recMessage = typeof rec === 'string' 
                ? rec 
                : rec?.message || rec?.text || rec?.description || 'Recommendation'
              const recAction = typeof rec === 'object' && rec !== null ? rec?.action : null
              const recPriority = typeof rec === 'object' && rec !== null ? rec?.priority : null
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    recType === 'positive' || recType === 'success'
                      ? 'bg-green-50 border-green-500'
                      : recType === 'warning' || recType === 'medium'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {recType === 'positive' || recType === 'success' ? (
                      <ThumbsUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{recMessage}</p>
                      {recAction && (
                        <p className="text-xs text-gray-600">{recAction}</p>
                      )}
                      {recPriority && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${
                            recPriority === 'high' 
                              ? 'text-red-600 border-red-300' 
                              : recPriority === 'medium'
                              ? 'text-orange-600 border-orange-300'
                              : 'text-blue-600 border-blue-300'
                          }`}
                        >
                          {recPriority} priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="bg-white border border-red-200 rounded-xl p-6 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Risk Factors
          </h3>
          <div className="space-y-3">
            {riskFactors.map((risk: any, index: number) => {
              // Handle both string and object formats
              const riskText = typeof risk === 'string' 
                ? risk 
                : risk?.issue || risk?.message || risk?.description || 'Risk factor identified'
              const riskCategory = typeof risk === 'object' ? risk?.category : null
              const riskSeverity = typeof risk === 'object' ? risk?.severity : null
              
              return (
                <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-start space-x-2 text-red-700">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{riskText}</p>
                      {(riskCategory || riskSeverity) && (
                        <div className="flex items-center gap-2 mt-1">
                          {riskCategory && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                              {riskCategory}
                            </Badge>
                          )}
                          {riskSeverity && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                riskSeverity === 'high' 
                                  ? 'text-red-700 border-red-400 bg-red-50' 
                                  : riskSeverity === 'medium'
                                  ? 'text-orange-700 border-orange-400 bg-orange-50'
                                  : 'text-yellow-700 border-yellow-400 bg-yellow-50'
                              }`}
                            >
                              {riskSeverity} severity
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Login Prompt for Non-logged in Users */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="max-w-md mx-auto">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Want More Details?</h4>
            <p className="text-gray-700 mb-4">
              Sign in to get detailed seller analysis, profile extraction, and advanced trust indicators.
            </p>
            <Link href="/auth?mode=login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In for Full Analysis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
