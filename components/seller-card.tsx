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
  Users, 
  Package, 
  Shield, 
  Eye,
  Heart,
  Flag,
  Send,
  X,
  ThumbsUp
} from "lucide-react"
import Image from "next/image"
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

export function SellerCard({ seller, onViewProfile }: SellerCardProps) {
  const [showFlagForm, setShowFlagForm] = useState(false)
  const [flagReason, setFlagReason] = useState("")
  const [isFlagging, setIsFlagging] = useState(false)
  const [showEndorseForm, setShowEndorseForm] = useState(false)
  const [endorseReason, setEndorseReason] = useState("")
  const [isEndorsing, setIsEndorsing] = useState(false)
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

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
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Profile Picture */}
        <div className="relative">
          <ImageWithFallback
            src={seller.profileData.profilePicture}
            alt={seller.profileData.name || "Seller"}
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-gray-200"
            fallbackLetter={seller.profileData.name?.charAt(0) || "S"}
          />
          {(seller.verificationStatus === "verified" || seller.verificationStatus === "id-verified") && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{cleanText(seller.profileData.name)}</h3>
            <Badge 
              variant={seller.verificationStatus === "verified" || seller.verificationStatus === "id-verified" ? "success" : "outline"}
              className="text-xs"
            >
              {seller.verificationStatus === "verified" || seller.verificationStatus === "id-verified" ? "Verified" : "Unverified"}
            </Badge>
            {seller.isClaimed && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                Claimed
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{cleanText(seller.profileData.location)}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{cleanText(seller.profileData.bio)}</p>
        </div>

        {/* Pulse Score */}
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getScoreBgColor(seller.pulseScore)} ${getScoreColor(seller.pulseScore)}`}>
            {seller.pulseScore}
          </div>
          <p className="text-xs text-gray-600 mt-1">Pulse</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{seller.listingHistory.length}</div>
          <div className="text-xs text-gray-600">Listings</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{seller.isActive ? "Active" : "Inactive"}</div>
          <div className="text-xs text-gray-600">Status</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{seller.platform}</div>
          <div className="text-xs text-gray-600">Platform</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{seller.isClaimed ? "Yes" : "No"}</div>
          <div className="text-xs text-gray-600">Claimed</div>
        </div>
      </div>

      {/* Platform Badge */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {seller.platform.charAt(0).toUpperCase() + seller.platform.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {seller.confidenceLevel.charAt(0).toUpperCase() + seller.confidenceLevel.slice(1)} Confidence
          </Badge>
          {seller.userId && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
              User Account
            </Badge>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(seller.lastSeen).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{Math.ceil((Date.now() - new Date(seller.firstSeen).getTime()) / (1000 * 60 * 60 * 24))} days</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEndorseForm(true)}
          className="flex items-center space-x-1 flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Endorse</span>
        </Button>
        <Button
          size="sm"
          onClick={() => onViewProfile?.(seller)}
          className="flex items-center space-x-1 flex-1"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFlagForm(true)}
          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Flag className="w-4 h-4" />
          <span>Flag</span>
        </Button>
      </div>

      {/* Flag Form */}
      {showFlagForm && (
        <div className="border-t pt-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for flagging this seller:
              </label>
              <Textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Please provide a reason for flagging this seller..."
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {flagReason.length}/500 characters
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleFlagSeller}
                disabled={isFlagging || !flagReason.trim()}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700"
              >
                <Send className="w-4 h-4" />
                <span>{isFlagging ? "Flagging..." : "Flag Seller"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowFlagForm(false)
                  setFlagReason("")
                }}
                className="flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Endorse Form */}
      {showEndorseForm && (
        <div className="border-t pt-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for endorsing this seller:
              </label>
              <Textarea
                value={endorseReason}
                onChange={(e) => setEndorseReason(e.target.value)}
                placeholder="Please provide a reason for endorsing this seller..."
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {endorseReason.length}/500 characters
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleEndorseSeller}
                disabled={isEndorsing || !endorseReason.trim()}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                <span>{isEndorsing ? "Endorsing..." : "Endorse Seller"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowEndorseForm(false)
                  setEndorseReason("")
                }}
                className="flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
