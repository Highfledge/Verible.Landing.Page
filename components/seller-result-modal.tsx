"use client"

import { X, Shield, TrendingUp, AlertTriangle, CheckCircle, Star, MapPin, Calendar, Users, ShoppingBag, Award, ExternalLink, Clock, Eye, MessageCircle, Percent, Tag, History, CheckCircle2, XCircle, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { cleanText, isMeaningfulText, getInitials } from "@/lib/utils/clean-data"

interface SellerResultModalProps {
  data: any
  isOpen: boolean
  onClose: () => void
}

export function SellerResultModal({ data, isOpen, onClose }: SellerResultModalProps) {
  if (!isOpen || !data) return null

  const seller = data.seller || {}
  const extractedData = data.extractedData || {}
  const scoringResult = data.scoringResult || {}
  const profileData = seller.profileData || extractedData.profileData || {}
  const marketplaceData = seller.marketplaceData || extractedData.marketplaceData || {}
  const trustIndicators = seller.trustIndicators || extractedData.trustIndicators || {}

  const pulseScore = seller.pulseScore || scoringResult.pulseScore || 0
  const confidenceLevel = seller.confidenceLevel || scoringResult.confidenceLevel || "low"
  const verificationStatus = seller.verificationStatus || marketplaceData.verificationStatus || "unverified"

  // Clean and validate seller name
  const rawName = profileData.name || ""
  const cleanedName = cleanText(rawName)
  const isNameMeaningful = isMeaningfulText(rawName)
  const displayName = isNameMeaningful ? cleanedName : "Not available"
  const sellerInitials = isNameMeaningful ? getInitials(rawName) : "N/A"
  
  // Check if profile picture is valid (not a .gif or broken)
  const profilePicture = profileData.profilePicture
  const isGif = profilePicture?.toLowerCase().endsWith(".gif") || profilePicture?.toLowerCase().includes(".gif")
  const hasValidPicture = profilePicture && !isGif && profilePicture.trim() !== ""

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getConfidenceBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-red-100 text-red-700 border-red-200"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1D2973] to-[#1a2468] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Seller Verification Results</h2>
              <p className="text-sm text-purple-200">Profile analysis complete</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 pb-8 space-y-6">
          {/* Pulse Score Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pulse Score</h3>
              <Badge className={getConfidenceBadgeColor(confidenceLevel)}>
                {confidenceLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 84}`}
                    strokeDashoffset={`${2 * Math.PI * 84 * (1 - pulseScore / 100)}`}
                    strokeLinecap="round"
                    className={getScoreColor(pulseScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(pulseScore)}`}>
                      {pulseScore}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">out of 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Profile Details */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1D2973]" />
                  Profile Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 relative">
                      {hasValidPicture ? (
                        <ImageWithFallback
                          src={profilePicture}
                          alt={displayName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          fallbackLetter={sellerInitials}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {sellerInitials}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 truncate">
                        {displayName}
                      </h5>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{profileData.location && profileData.location !== "Not specified" ? profileData.location : "Location not specified"}</span>
                      </div>
                      {profileData.bio && isMeaningfulText(profileData.bio) && (
                        <p className="text-sm text-gray-600 mt-2">{cleanText(profileData.bio)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketplace Stats */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1D2973]" />
                  Marketplace Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {marketplaceData.totalListings || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Listings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {marketplaceData.totalReviews || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Reviews</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900">
                        {marketplaceData.avgRating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {marketplaceData.followers || 0}
                    </div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  {marketplaceData.responseRate !== undefined && (
                    <div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-2xl font-bold text-gray-900">
                          {marketplaceData.responseRate}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">Response Rate</div>
                    </div>
                  )}
                  {marketplaceData.lastSeen && (
                    <div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {marketplaceData.lastSeen === "1" ? "Active" : marketplaceData.lastSeen}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">Last Seen</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scoring Factors */}
              {seller.scoringFactors && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#1D2973]" />
                    Scoring Factors
                  </h4>
                  <div className="space-y-3">
                    {seller.scoringFactors.urgencyScore !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Urgency Score</span>
                          <span className="font-medium text-gray-900">{seller.scoringFactors.urgencyScore}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${seller.scoringFactors.urgencyScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {seller.scoringFactors.profileCompleteness !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Profile Completeness</span>
                          <span className="font-medium text-gray-900">{seller.scoringFactors.profileCompleteness}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-purple-500"
                            style={{ width: `${seller.scoringFactors.profileCompleteness}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Categories */}
              {marketplaceData.categories && Array.isArray(marketplaceData.categories) && marketplaceData.categories.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#1D2973]" />
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {marketplaceData.categories.map((cat: any, idx: number) => {
                      const categoryName = cleanText(cat.name || cat)
                      if (!isMeaningfulText(categoryName)) return null
                      return (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {categoryName}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Trust Indicators & Recommendations */}
            <div className="space-y-4">
              {/* Verification Status */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1D2973]" />
                  Verification Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Status</span>
                    <Badge variant="outline" className="capitalize">
                      {verificationStatus === "id-verified" ? "ID Verified" : verificationStatus === "verified" ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  {trustIndicators.accountAge !== undefined && trustIndicators.accountAge !== null && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Account Age
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {trustIndicators.accountAge} {trustIndicators.accountAge === 1 ? "day" : "days"}
                      </span>
                    </div>
                  )}
                  {seller.lastScored && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last Scored
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(seller.lastScored).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      {seller.isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      Account Status
                    </span>
                    <Badge variant={seller.isActive ? "success" : "outline"} className={seller.isActive ? "" : "text-red-600"}>
                      {seller.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {seller.isClaimed !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Profile Claimed
                      </span>
                      <Badge variant={seller.isClaimed ? "success" : "outline"}>
                        {seller.isClaimed ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                  {seller.claimedAt && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Claimed At
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(seller.claimedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Indicators Details */}
              {trustIndicators && Object.keys(trustIndicators).length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#1D2973]" />
                    Trust Indicators
                  </h4>
                  <div className="space-y-2">
                    {trustIndicators.hasProfilePicture !== undefined && (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm text-gray-700">Profile Picture</span>
                        {trustIndicators.hasProfilePicture ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                    {trustIndicators.hasLocation !== undefined && (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm text-gray-700">Location Provided</span>
                        {trustIndicators.hasLocation ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                    {trustIndicators.hasBio !== undefined && (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm text-gray-700">Bio Provided</span>
                        {trustIndicators.hasBio ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                    {trustIndicators.avgRating !== undefined && trustIndicators.avgRating > 0 && (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm text-gray-700">Average Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{trustIndicators.avgRating.toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              {scoringResult.trustIndicators && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#1D2973]" />
                    Trust Breakdown
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(scoringResult.trustIndicators).map(([key, value]: [string, any]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreBgColor(parseInt(value) || 0)}`}
                            style={{ width: `${parseInt(value) || 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {scoringResult.recommendations && scoringResult.recommendations.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#1D2973]" />
                    Recommendations
                  </h4>
                  <div className="space-y-3">
                    {scoringResult.recommendations.map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          rec.type === "positive"
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {rec.type === "positive" ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{rec.message}</p>
                            <p className="text-xs text-gray-600 mt-1">{rec.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              {scoringResult.riskFactors && scoringResult.riskFactors.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {scoringResult.riskFactors.map((risk: string, idx: number) => (
                      <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Flags & Endorsements */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#1D2973]" />
                Feedback Summary
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-sm text-gray-700">Flags</span>
                  <span className="text-lg font-bold text-red-600">
                    {seller.flags && Array.isArray(seller.flags) ? seller.flags.length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-sm text-gray-700">Endorsements</span>
                  <span className="text-lg font-bold text-green-600">
                    {seller.endorsements && Array.isArray(seller.endorsements) ? seller.endorsements.length : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Timeline */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-[#1D2973]" />
                Account Timeline
              </h4>
              <div className="space-y-2">
                {seller.firstSeen && (
                  <div className="flex items-center justify-between p-2">
                    <span className="text-xs text-gray-600">First Seen</span>
                    <span className="text-xs font-medium text-gray-900">
                      {new Date(seller.firstSeen).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {seller.lastSeen && seller.lastSeen !== "1" && (
                  <div className="flex items-center justify-between p-2">
                    <span className="text-xs text-gray-600">Last Seen</span>
                    <span className="text-xs font-medium text-gray-900">
                      {new Date(seller.lastSeen).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {seller.createdAt && (
                  <div className="flex items-center justify-between p-2">
                    <span className="text-xs text-gray-600">Created</span>
                    <span className="text-xs font-medium text-gray-900">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {seller.updatedAt && (
                  <div className="flex items-center justify-between p-2">
                    <span className="text-xs text-gray-600">Last Updated</span>
                    <span className="text-xs font-medium text-gray-900">
                      {new Date(seller.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Listings */}
          {seller.recentListings && Array.isArray(seller.recentListings) && seller.recentListings.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1D2973]" />
                Recent Listings ({seller.recentListings.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {seller.recentListings.slice(0, 5).map((listing: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {cleanText(listing.title || listing.name || `Listing ${idx + 1}`) || "Untitled Listing"}
                    </p>
                    {listing.price && (
                      <p className="text-xs text-gray-600 mt-1">Price: {listing.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile URL */}
          {seller.profileUrl && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Profile URL:</span>
                  <a
                    href={seller.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#1D2973] hover:underline truncate max-w-md"
                  >
                    {seller.profileUrl}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {seller.profileUrl && (
            <Button
              variant="primary"
              onClick={() => {
                window.open(seller.profileUrl, "_blank")
              }}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

