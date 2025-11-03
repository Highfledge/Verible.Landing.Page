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
  BarChart3
} from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { cleanText } from "@/lib/utils/clean-data"

interface SellerProfileDisplayProps {
  data: any
  isLoggedIn: boolean
}

export function SellerProfileDisplay({ data, isLoggedIn }: SellerProfileDisplayProps) {
  const seller = data.seller
  const extractedData = data.extractedData
  const scoringResult = data.scoringResult

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

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high": return "text-green-600 bg-green-100"
      case "medium": return "text-yellow-600 bg-yellow-100"
      case "low": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Seller Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          {/* Profile Picture */}
          <div className="relative">
            <ImageWithFallback
              src={seller.profileData.profilePicture}
              alt={seller.profileData.name || "Seller"}
              width={80}
              height={80}
              className="rounded-full object-cover border-2 border-gray-200"
              fallbackLetter={seller.profileData.name?.charAt(0) || "S"}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{cleanText(seller.profileData.name)}</h3>
              <Badge 
                variant={seller.verificationStatus === "verified" ? "success" : "outline"}
                className="text-xs"
              >
                {seller.verificationStatus === "verified" ? "Verified" : "Unverified"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{cleanText(seller.profileData.location) || "Location not specified"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{extractedData.marketplaceData.lastSeen}</span>
              </div>
            </div>

            {seller.profileData.bio && (
              <p className="text-gray-700 text-sm leading-relaxed">{cleanText(seller.profileData.bio)}</p>
            )}
          </div>

          {/* Pulse Score */}
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBgColor(seller.pulseScore)} ${getScoreColor(seller.pulseScore)}`}>
              {seller.pulseScore}
            </div>
            <p className="text-xs text-gray-600 mt-1">Pulse Score</p>
            <Badge className={`text-xs mt-1 ${getConfidenceColor(seller.confidenceLevel)}`}>
              {seller.confidenceLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Trust Indicators
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{extractedData.marketplaceData.accountAge}</div>
            <div className="text-xs text-gray-600">Days Active</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{extractedData.marketplaceData.totalListings}</div>
            <div className="text-xs text-gray-600">Total Listings</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{extractedData.marketplaceData.totalReviews}</div>
            <div className="text-xs text-gray-600">Reviews</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{extractedData.marketplaceData.followers}</div>
            <div className="text-xs text-gray-600">Followers</div>
          </div>
        </div>

        {/* Trust Score Breakdown */}
        <div className="mt-6 space-y-3">
          <h5 className="font-medium text-gray-900">Trust Score Breakdown</h5>
          {(Object.entries((scoringResult?.trustIndicators ?? {}) as Record<string, string | number>) as [string, string | number][])?.map(([key, value]) => {
            const percent = typeof value === 'number' ? value : parseInt(String(value)) || 0
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{String(value)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Recommendations
        </h4>
        
        <div className="space-y-3">
          {scoringResult.recommendations.map((rec: any, index: number) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.type === 'positive' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                {rec.type === 'positive' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{rec.message}</p>
                  <p className="text-xs text-gray-600 mt-1">Action: {rec.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      {scoringResult.riskFactors && scoringResult.riskFactors.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Risk Factors
          </h4>
          
          <div className="space-y-2">
            {scoringResult.riskFactors.map((risk: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {extractedData.marketplaceData.categories && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Seller Categories
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {extractedData.marketplaceData.categories.slice(0, 9).map((category: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{category.name}</span>
                <Badge variant="outline" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login Prompt for Non-logged in Users */}
      {!isLoggedIn && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Want More Details?</h4>
          <p className="text-blue-700 mb-4">
            Sign in to get detailed seller analysis, profile extraction, and advanced trust indicators.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Sign In for Full Analysis
          </Button>
        </div>
      )}
    </div>
  )
}
