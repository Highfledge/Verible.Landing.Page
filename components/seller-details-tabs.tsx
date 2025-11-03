"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Shield,
  XCircle,
  FileText,
  BarChart3,
  Target,
  Activity
} from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { cleanObjectData, cleanText } from "@/lib/utils/clean-data"

interface SellerDetailsTabsProps {
  data: {
    seller: any
    extractedData: any
    scoringResult: any
  }
}

export function SellerDetailsTabs({ data }: SellerDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "trust" | "recommendations" | "activity" | "report">("overview")
  
  // Clean the data to remove escaped backslashes
  const cleanedData = useMemo(() => cleanObjectData(data), [data])
  
  const seller = cleanedData.seller
  const extractedData = cleanedData.extractedData
  const scoringResult = cleanedData.scoringResult
  
  const profileData = seller?.profileData || extractedData?.profileData || {}
  const marketplaceData = extractedData?.marketplaceData || {}
  const pulseScore = seller?.pulseScore || scoringResult?.pulseScore || 0
  const confidenceLevel = seller?.confidenceLevel || scoringResult?.confidenceLevel || "low"
  const verificationStatus = seller?.verificationStatus || marketplaceData?.verificationStatus || "unverified"
  
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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "trust", label: "Trust Analysis" },
    { id: "recommendations", label: "Recommendations" },
    { id: "activity", label: "Activity" },
    { id: "report", label: "Report" }
  ]

  // Calculate account age
  const accountAge = marketplaceData.accountAge || 0
  const accountAgeYears = Math.floor(accountAge / 12)
  const accountAgeMonths = accountAge % 12
  const accountAgeText = accountAge > 0 
    ? `${accountAgeYears} years, ${accountAgeMonths} months`
    : "Less than 1 month"

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Seller Header */}
            <div className="flex items-start space-x-4">
              <ImageWithFallback
                src={profileData.profilePicture}
                alt={profileData.name || "Seller"}
                width={60}
                height={60}
                className="rounded-full object-cover border-2 border-gray-200"
                fallbackLetter={profileData.name?.charAt(0) || "S"}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{cleanText(profileData.name) || "Unknown Seller"}</h3>
                <p className="text-sm text-gray-600">Jiji</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{marketplaceData.avgRating || "0"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{marketplaceData.totalReviews || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Account Age</p>
                <p className="text-lg font-bold text-gray-900">{accountAgeText}</p>
              </div>
            </div>

            {/* Pulse Score */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pulse Score</p>
                  <div className={`text-4xl font-bold ${getScoreColor(pulseScore)}`}>
                    {pulseScore}
                  </div>
                </div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBgColor(pulseScore)} ${getScoreColor(pulseScore)}`}>
                  {pulseScore}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {verificationStatus === "verified" || verificationStatus === "id-verified" ? "Verified" : "No Verified"}
              </p>
            </div>

            {/* Recommendations List */}
            {scoringResult?.recommendations && scoringResult.recommendations.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h4>
                <ul className="space-y-2">
                  {scoringResult.recommendations.map((rec: any, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`mt-1 ${
                        rec.type === "positive" ? "text-green-500" :
                        rec.type === "warning" ? "text-yellow-500" :
                        "text-red-500"
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                      <span className="text-sm text-gray-700">{cleanText(rec.message)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Trust Analysis Tab */}
        {activeTab === "trust" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Factor Analysis</h3>
            
            <div className="space-y-4">
              {/* Account Verification */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Account Verification</span>
                  <span className="text-sm text-gray-600">
                    {scoringResult?.trustIndicators?.accountVerification || "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: scoringResult?.trustIndicators?.accountVerification?.replace('%', '') || '0%' 
                    }}
                  />
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Transaction History</span>
                  <span className="text-sm text-gray-600">
                    {scoringResult?.trustIndicators?.transactionHistory || "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: scoringResult?.trustIndicators?.transactionHistory?.replace('%', '') || '0%' 
                    }}
                  />
                </div>
              </div>

              {/* Communication Quality */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Communication Quality</span>
                  <span className="text-sm text-gray-600">
                    {scoringResult?.trustIndicators?.communicationQuality || "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: scoringResult?.trustIndicators?.communicationQuality?.replace('%', '') || '0%' 
                    }}
                  />
                </div>
              </div>

              {/* Dispute Resolution */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Dispute Resolution</span>
                  <span className="text-sm text-gray-600">
                    {scoringResult?.trustIndicators?.disputeResolution || "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: scoringResult?.trustIndicators?.disputeResolution?.replace('%', '') || '0%' 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Verification Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Verification Indicators</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {verificationStatus === "id-verified" || verificationStatus === "verified" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700">Identity Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-700">Business License</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === "recommendations" && (
          <div className="space-y-6">
            {/* Purchase Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Recommendations</h3>
              <div className={`p-4 rounded-lg border-2 ${
                pulseScore >= 80 
                  ? "bg-green-50 border-green-200" 
                  : pulseScore >= 60 
                  ? "bg-yellow-50 border-yellow-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className={`w-5 h-5 mt-0.5 ${
                    pulseScore >= 80 ? "text-green-600" : pulseScore >= 60 ? "text-yellow-600" : "text-red-600"
                  }`} />
                  <p className={`text-sm font-medium ${
                    pulseScore >= 80 ? "text-green-800" : pulseScore >= 60 ? "text-yellow-800" : "text-red-800"
                  }`}>
                    {pulseScore >= 80 
                      ? "Highly Recommended - This seller has excellent trust indicators and low risk factors."
                      : pulseScore >= 60
                      ? "Moderately Recommended - This seller has good trust indicators but review carefully."
                      : "Not Recommended - This seller has low trust indicators and high risk factors."}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions:</h3>
              <div className="space-y-3">
                {scoringResult?.recommendations?.map((rec: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      rec.type === "positive" 
                        ? "bg-green-50 border-green-200" 
                        : rec.type === "warning"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {rec.type === "positive" ? (
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-600" />
                      ) : rec.type === "warning" ? (
                        <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-600" />
                      ) : (
                        <TrendingUp className="w-5 h-5 mt-0.5 text-blue-600" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${
                          rec.type === "positive" ? "text-green-800" : rec.type === "warning" ? "text-yellow-800" : "text-blue-800"
                        }`}>
                          {cleanText(rec.action || rec.message)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{cleanText(rec.message)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Trust Factors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Trust Factors:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>Account Age: {accountAgeText}</p>
                <p>Reviews: {marketplaceData.totalReviews || 0}</p>
                {scoringResult?.scoringFactors && (
                  <>
                    <p>Profile Completeness: {scoringResult.scoringFactors.profileCompleteness || 0}%</p>
                    <p>Verification Status: {scoringResult.scoringFactors.verificationStatus || 0}%</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Profile Viewed</p>
                  <p className="text-xs text-gray-600">Just now</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Last Score Update</p>
                  <p className="text-xs text-gray-600">
                    {seller?.lastScored ? new Date(seller.lastScored).toLocaleString() : "Invalid Date"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Tab */}
        {activeTab === "report" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Seller</h3>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Help keep the community safe by reporting suspicious or fraudulent behavior.
                </p>
              </div>
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              Report This Seller
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

