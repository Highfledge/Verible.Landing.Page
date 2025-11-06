"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle, User, Loader2, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { sellersAPI } from "@/lib/api/client"
import { toast } from "sonner"
import { SellerDetailsTabs } from "@/components/seller-details-tabs"
import { SellerResultModal } from "@/components/seller-result-modal"
import { Header } from "@/components/header"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"
import { cleanObjectData, cleanText } from "@/lib/utils/clean-data"

function SellerLookupContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null)
  const [searchMode, setSearchMode] = useState<"profile-url" | "name-platform" | "name-platform-location" | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Read query parameters from URL
  useEffect(() => {
    const q = searchParams.get("q")
    const platform = searchParams.get("platform")
    const location = searchParams.get("location")

    if (q) {
      const decodedQuery = decodeURIComponent(q)
      setSearchQuery(decodedQuery)

      // Determine search mode based on parameters
      if (location) {
        setSearchMode("name-platform-location")
        // Name is passed directly in the query parameter
        const name = decodedQuery
        // Auto-search
        setTimeout(() => {
          handleSearchByNamePlatformLocation(name, decodeURIComponent(platform || ""), decodeURIComponent(location))
        }, 100)
      } else if (platform) {
        setSearchMode("name-platform")
        // Name is passed directly in the query parameter
        const name = decodedQuery
        // Auto-search
        setTimeout(() => {
          handleSearchByNameAndPlatform(name, decodeURIComponent(platform))
        }, 100)
      } else {
        setSearchMode("profile-url")
        // Auto-search if query is provided
        setTimeout(() => {
          handleSearchByUrl(decodedQuery)
        }, 100)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Search by Profile URL
  const handleSearchByUrl = async (url: string) => {
    if (!url.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setSelectedSeller(null)

    try {
      const response = await sellersAPI.scoreByUrl({
        profileUrl: url.trim()
      })

      if (response.success && response.data) {
        // Store the full response data for the modal
        setSearchResults([response.data])
        setSelectedSeller(response.data)
        setShowModal(true)
        toast.success("Seller found successfully!")
      } else {
        toast.error(response.message || "No seller found with that profile URL")
        setSearchResults([])
      }
    } catch (error: any) {
      console.error("Search error:", error)
      toast.error(error.response?.data?.message || "Failed to search seller. Please try again.")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Search by Name and Platform
  const handleSearchByNameAndPlatform = async (name: string, platform: string) => {
    if (!name.trim() || !platform) return

    setIsSearching(true)
    setSearchResults([])
    setSelectedSeller(null)

    try {
      const response = await sellersAPI.searchByNameAndPlatform({
        name: name.trim(),
        platform: platform,
      })

      if (response.success && response.data) {
        const results = Array.isArray(response.data) ? response.data : [response.data]
        const transformedResults = results.map((item: any) => {
          const cleanedData = cleanObjectData(item)
          return transformSellerData(cleanedData, item.profileUrl || "")
        })
        setSearchResults(transformedResults)
        if (transformedResults.length > 0) {
          setSelectedSeller(transformedResults[0])
        }
        toast.success(`Found ${transformedResults.length} seller(s)`)
      } else {
        toast.error(response.message || "No sellers found")
        setSearchResults([])
      }
    } catch (error: any) {
      console.error("Search error:", error)
      toast.error(error.response?.data?.message || "Failed to search sellers. Please try again.")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Search by Name, Platform and Location
  const handleSearchByNamePlatformLocation = async (name: string, platform: string, location: string) => {
    if (!name.trim() || !platform || !location.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setSelectedSeller(null)

    try {
      const response = await sellersAPI.searchByNamePlatformLocation({
        name: name.trim(),
        platform: platform,
        location: location.trim(),
      })

      if (response.success && response.data) {
        const results = Array.isArray(response.data) ? response.data : [response.data]
        const transformedResults = results.map((item: any) => {
          const cleanedData = cleanObjectData(item)
          return transformSellerData(cleanedData, item.profileUrl || "")
        })
        setSearchResults(transformedResults)
        if (transformedResults.length > 0) {
          setSelectedSeller(transformedResults[0])
        }
        toast.success(`Found ${transformedResults.length} seller(s)`)
      } else {
        toast.error(response.message || "No sellers found")
        setSearchResults([])
      }
    } catch (error: any) {
      console.error("Search error:", error)
      toast.error(error.response?.data?.message || "Failed to search sellers. Please try again.")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Transform seller data to consistent format
  const transformSellerData = (cleanedData: any, profileUrl: string) => {
    return {
      seller: {
        profileData: cleanedData.profileData,
        pulseScore: cleanedData.scoringResult?.pulseScore || cleanedData.pulseScore || 0,
        confidenceLevel: cleanedData.scoringResult?.confidenceLevel || cleanedData.confidenceLevel || "low",
        verificationStatus: cleanedData.marketplaceData?.verificationStatus || cleanedData.verificationStatus || "unverified",
        lastScored: cleanedData.lastScored || new Date().toISOString(),
        profileUrl: profileUrl
      },
      extractedData: {
        profileData: cleanedData.profileData,
        marketplaceData: cleanedData.marketplaceData,
        recentListings: cleanedData.recentListings || [],
        platform: cleanedData.platform || cleanedData.marketplaceData?.platform || "unknown",
        profileUrl: profileUrl
      },
      scoringResult: cleanedData.scoringResult,
      profileUrl: profileUrl
    }
  }

  // Legacy function for backward compatibility
  const handleSearchWithQuery = async (query: string) => {
    await handleSearchByUrl(query)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a seller username, store name, or profile URL")
      return
    }
    await handleSearchWithQuery(searchQuery.trim())
  }

  const handleSelectSeller = (result: any) => {
    setSelectedSeller(result)
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Jiji Seller Lookup
          </h1>
          <p className="text-gray-600">
            Search and analyze Jiji seller trust scores and verification status
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Search Jiji Sellers</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              placeholder="Enter Jiji seller username, store name, or profile URL"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          <div className="flex items-start space-x-2 mt-3 text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Search authentic Jiji seller data. Enter exact usernames for best results.</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Search Results */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Search Results ({searchResults.length})
            </h2>

            {searchResults.length === 0 && !isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Search className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-gray-600">No sellers found. Try searching above.</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, index) => {
                  const seller = result.seller
                  const profileData = seller?.profileData || {}
                  const pulseScore = seller?.pulseScore || result.scoringResult?.pulseScore || 0
                  const isSelected = selectedSeller === result
                  const avgRating = result.extractedData?.marketplaceData?.avgRating || 0
                  const totalReviews = result.extractedData?.marketplaceData?.totalReviews || 0

                  return (
                    <div
                      key={index}
                      onClick={() => handleSelectSeller(result)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {cleanText(profileData.name) || "Unknown Seller"}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              Jiji
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {avgRating > 0 ? (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span>{avgRating}</span>
                              </div>
                            ) : null}
                            <span>{totalReviews} reviews</span>
                          </div>
                        </div>

                        <div className="ml-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              pulseScore >= 80
                                ? "bg-green-100 text-green-700"
                                : pulseScore >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {pulseScore}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Right: Seller Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {selectedSeller ? (
              <SellerDetailsTabs data={selectedSeller} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <User className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-gray-900 font-semibold mb-2">No Seller Selected</p>
                <p className="text-gray-600 text-sm text-center">
                  Search for sellers and select one to view detailed trust analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <StickyBottomBar />
      
      {/* Seller Result Modal */}
      {selectedSeller && (
        <SellerResultModal
          data={selectedSeller}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default function SellerLookupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SellerLookupContent />
    </Suspense>
  )
}
