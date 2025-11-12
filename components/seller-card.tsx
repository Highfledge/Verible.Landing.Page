"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { sellersAPI } from "@/lib/api/client"
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Eye,
  Flag,
  Send,
  X,
  ThumbsUp,
  ChevronRight,
  Verified,
  Globe,
  Package,
  MessageSquare
} from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { cleanText } from "@/lib/utils/clean-data"

interface Seller {
  _id: string
  userId?: {
    _id: string
    name: string
    email: string
    role: string
    verified: boolean
  } | null
  sellerId: string
  platform: string
  profileUrl: string
  pulseScore: number
  confidenceLevel: "high" | "medium" | "low"
  lastScored: string
  verificationStatus: "verified" | "unverified" | "id-verified"
  listingHistory: any[]
  isActive: boolean
  isClaimed: boolean
  claimedAt?: string
  firstSeen: string
  lastSeen: string
  createdAt: string
  updatedAt: string
  profileData: {
    name: string
    profilePicture: string | null
    location: string
    bio: string
  }
}

interface SellerCardProps {
  seller: Seller
  onViewProfile?: (seller: Seller) => void
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
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <Star className="w-4 h-4 fill-gray-300 text-gray-300 absolute" />
          <div className="overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 fill-gray-300 text-gray-300" />
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

export function SellerCard({ seller, onViewProfile }: SellerCardProps) {
  const [showFlagForm, setShowFlagForm] = useState(false)
  const [flagReason, setFlagReason] = useState("")
  const [isFlagging, setIsFlagging] = useState(false)
  const [showEndorseForm, setShowEndorseForm] = useState(false)
  const [endorseReason, setEndorseReason] = useState("")
  const [isEndorsing, setIsEndorsing] = useState(false)

  const starRating = getStarRating(seller.pulseScore)
  const trustLabel = getTrustLabel(seller.pulseScore)
  const accountAgeDays = Math.ceil((Date.now() - new Date(seller.firstSeen).getTime()) / (1000 * 60 * 60 * 24))

  const handleFlagSeller = async () => {
    if (!flagReason.trim()) {
      toast.error("Please provide a reason for flagging this seller")
      return
    }

    setIsFlagging(true)
    try {
      await sellersAPI.flagSeller(seller._id, flagReason.trim())
      toast.success("Seller flagged successfully")
      setShowFlagForm(false)
      setFlagReason("")
    } catch (error: any) {
      console.error("Error flagging seller:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to flag seller. Please try again.")
    } finally {
      setIsFlagging(false)
    }
  }

  const handleEndorseSeller = async () => {
    if (!endorseReason.trim()) {
      toast.error("Please provide a reason for endorsing this seller")
      return
    }

    setIsEndorsing(true)
    try {
      await sellersAPI.endorseSeller(seller._id, endorseReason.trim())
      toast.success("Seller endorsed successfully")
      setShowEndorseForm(false)
      setEndorseReason("")
    } catch (error: any) {
      console.error("Error endorsing seller:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to endorse seller. Please try again.")
    } finally {
      setIsEndorsing(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Trust Score Banner - Trustpilot Style */}
      <div className={`${getTrustBadgeColor(seller.pulseScore)} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium opacity-90 uppercase tracking-wide">Trust Score</p>
              <p className="text-3xl font-bold">{seller.pulseScore}</p>
            </div>
            <div className="border-l border-white/30 pl-4">
              <p className="text-sm font-semibold">{trustLabel}</p>
              <p className="text-xs opacity-75 capitalize">{seller.confidenceLevel} Confidence</p>
            </div>
          </div>
          {(seller.verificationStatus === "verified" || seller.verificationStatus === "id-verified") && (
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Verified className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">
                {seller.verificationStatus.replace("-", " ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-5">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <ImageWithFallback
              src={seller.profileData.profilePicture}
              alt={seller.profileData.name || "Seller"}
              width={80}
              height={80}
              className="rounded-xl object-cover border-4 border-gray-100 shadow-md"
              fallbackClassName="rounded-xl"
              fallbackLetter={seller.profileData.name?.charAt(0)?.toUpperCase() || "S"}
            />
            {seller.isClaimed && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                  {cleanText(seller.profileData.name) || "Unknown Seller"}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`border ${getPlatformColor(seller.platform)} text-xs`}>
                    {seller.platform.charAt(0).toUpperCase() + seller.platform.slice(1)}
                  </Badge>
                  {seller.userId && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                      User Account
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Location */}
            {seller.profileData.location && (
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{cleanText(seller.profileData.location)}</span>
              </div>
            )}

            {/* Star Rating - Trustpilot Style */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {renderStars(starRating)}
                    <span className="text-xl font-bold text-gray-900">{starRating}</span>
                    <span className="text-gray-600">/ 5</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Based on trust score analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Minimalist */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{seller.listingHistory.length}</div>
            <div className="text-xs text-gray-600">Listings</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{accountAgeDays}</div>
            <div className="text-xs text-gray-600">Days Active</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {seller.isActive ? (
                <Shield className="w-4 h-4 text-green-600" />
              ) : (
                <Shield className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className={`text-lg font-bold ${seller.isActive ? "text-green-600" : "text-gray-400"}`}>
              {seller.isActive ? "Active" : "Inactive"}
            </div>
            <div className="text-xs text-gray-600">Status</div>
          </div>
        </div>

        {/* Bio Preview */}
        {seller.profileData.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-5 leading-relaxed">
            {cleanText(seller.profileData.bio)}
          </p>
        )}

        {/* Action Buttons - Trustpilot Style */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile?.(seller)}
            className="flex items-center space-x-2 flex-1 group/btn hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEndorseForm(true)}
            className="flex items-center space-x-1 px-3 text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-300 border-green-200 transition-colors"
            title="Endorse seller"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFlagForm(true)}
            className="flex items-center space-x-1 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 border-red-200 transition-colors"
            title="Flag seller"
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Flag Form Modal */}
      {showFlagForm && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Flag this seller
              </label>
              <button
                onClick={() => {
                  setShowFlagForm(false)
                  setFlagReason("")
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Please provide a reason for flagging this seller..."
              className="min-h-[80px] resize-none text-sm"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {flagReason.length}/500 characters
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFlagForm(false)
                    setFlagReason("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleFlagSeller}
                  disabled={isFlagging || !flagReason.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isFlagging ? "Flagging..." : "Flag Seller"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endorse Form Modal */}
      {showEndorseForm && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Endorse this seller
              </label>
              <button
                onClick={() => {
                  setShowEndorseForm(false)
                  setEndorseReason("")
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Textarea
              value={endorseReason}
              onChange={(e) => setEndorseReason(e.target.value)}
              placeholder="Please provide a reason for endorsing this seller..."
              className="min-h-[80px] resize-none text-sm"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {endorseReason.length}/500 characters
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEndorseForm(false)
                    setEndorseReason("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEndorseSeller}
                  disabled={isEndorsing || !endorseReason.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isEndorsing ? "Endorsing..." : "Endorse Seller"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
