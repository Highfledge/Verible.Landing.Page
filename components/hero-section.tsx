"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Download, Search, X, Shield, Laptop, Star, Link2, User, MapPin, Loader2, TrendingUp, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/stores/auth-store"
import { sellersAPI } from "@/lib/api/client"
import { toast } from "sonner"
import { SellerProfileDisplay } from "@/components/seller-profile-display"
import { SellerResultModal } from "@/components/seller-result-modal"
import { cleanObjectData } from "@/lib/utils/clean-data"

type SearchMode = "profile-url" | "name-platform" | "name-platform-location" | null

type SearchState = {
  mode: SearchMode
  profileUrl: string
  sellerName: string
  selectedPlatform: string
  selectedLocation: string
  minTrustScore: number | null
  showAllFilters: boolean
  isSearching: boolean
  result: any | null
}

type ModalState = {
  showSearchResult: boolean
  showSellerProfile: boolean
}

type SellerProfileState = {
  data: any | null
  isLoading: boolean
  isRecalculating: boolean
}

const INITIAL_SEARCH_STATE: SearchState = {
  mode: null,
  profileUrl: "",
  sellerName: "",
  selectedPlatform: "",
  selectedLocation: "",
  minTrustScore: null,
  showAllFilters: false,
  isSearching: false,
  result: null,
}

const INITIAL_MODAL_STATE: ModalState = {
  showSearchResult: false,
  showSellerProfile: false,
}

const INITIAL_SELLER_PROFILE_STATE: SellerProfileState = {
  data: null,
  isLoading: false,
  isRecalculating: false,
}

export function HeroSection() {
  const { user, isLoggedIn } = useAuth()
  const isSeller = user?.role === "seller"
  const isBuyer = isLoggedIn && user?.role === "user"
  
  // Consolidated state
  const [searchState, setSearchState] = useState<SearchState>(INITIAL_SEARCH_STATE)
  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE)
  const [sellerProfileState, setSellerProfileState] = useState<SellerProfileState>(INITIAL_SELLER_PROFILE_STATE)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Destructured for easier access
  const {
    mode: searchMode,
    profileUrl,
    sellerName,
    selectedPlatform,
    selectedLocation,
    minTrustScore,
    showAllFilters,
    isSearching,
    result: searchResult,
  } = searchState

  const { showSearchResult: showModal, showSellerProfile: showSellerProfileModal } = modalState
  const { data: sellerProfile, isLoading: isLoadingProfile, isRecalculating } = sellerProfileState

  // Auto-scroll to results when searchResult becomes available
  useEffect(() => {
    if (searchResult && resultsRef.current) {
      // Small delay to ensure the DOM is updated and rendered
      const scrollTimer = setTimeout(() => {
        const element = resultsRef.current
        if (element) {
          const offset = 80 // Offset for fixed header/navigation
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 400) // Wait for animation to complete

      return () => clearTimeout(scrollTimer)
    }
  }, [searchResult])

  const platforms = [
    { value: "facebook", label: "Facebook Marketplace" },
    { value: "jiji", label: "Jiji" },
    { value: "ebay", label: "eBay" },
    { value: "etsy", label: "Etsy" },
    { value: "jumia", label: "Jumia" },
    { value: "kijiji", label: "Kijiji" },
    { value: "konga", label: "Konga" },
  ]

  // Helper functions to update state
  const updateSearchState = (updates: Partial<SearchState>) => {
    setSearchState((prev) => ({ ...prev, ...updates }))
  }

  const updateModalState = (updates: Partial<ModalState>) => {
    setModalState((prev) => ({ ...prev, ...updates }))
  }

  const updateSellerProfileState = (updates: Partial<SellerProfileState>) => {
    setSellerProfileState((prev) => ({ ...prev, ...updates }))
  }

  const handleSearch = async () => {
    if (searchMode === "profile-url") {
      if (!profileUrl.trim()) {
        toast.error("Please enter a profile URL")
        return
      }
      
      updateSearchState({ isSearching: true, result: null })
      try {
        const response = await sellersAPI.scoreByUrl({
          profileUrl: profileUrl.trim()
        })

        if (response.success && response.data) {
          // Clean the data first to remove escaped backslashes
          const cleanedData = cleanObjectData(response.data)
          
          // Normalize score-by-url shape to match SellerProfileDisplay expectations
          // The API response already has the correct structure, so we can use it directly
          const normalized = cleanedData?.seller
            ? cleanedData
            : {
                seller: {
                  profileData: cleanedData?.profileData || {},
                  pulseScore: cleanedData?.scoringResult?.pulseScore ?? 0,
                  confidenceLevel: cleanedData?.scoringResult?.confidenceLevel || 'low',
                  verificationStatus: cleanedData?.marketplaceData?.verificationStatus || 'unverified',
                  lastSeen: cleanedData?.marketplaceData?.lastSeen || '',
                  verification: cleanedData?.marketplaceData?.verificationStatus,
                },
                extractedData: {
                  platform: cleanedData?.marketplaceData?.platform || 'unknown',
                  profileUrl: profileUrl.trim(),
                  profileData: cleanedData?.profileData || {},
                  marketplaceData: cleanedData?.marketplaceData || {},
                  recentListings: cleanedData?.recentListings || [],
                  trustIndicators: cleanedData?.scoringResult?.trustIndicators || {},
                },
                scoringResult: cleanedData?.scoringResult || {},
              }

          updateSearchState({ result: normalized, isSearching: false })
          toast.success("Seller profile analyzed successfully!")
        } else {
          updateSearchState({ isSearching: false })
          toast.error(response.message || "No seller found with that profile URL")
        }
      } catch (error: any) {
        console.error("Search error:", error)
        updateSearchState({ isSearching: false })
        toast.error(error.response?.data?.message || "Failed to search seller. Please try again.")
      }
    } else if (searchMode === "name-platform") {
      if (!sellerName.trim() || !selectedPlatform) {
        toast.error("Please enter seller name and select a platform")
        return
      }
      
      updateSearchState({ isSearching: true, result: null })
      try {
        const response = await sellersAPI.searchByNameAndPlatform({
          name: sellerName.trim(),
          platform: selectedPlatform
        })

        if (response.success && response.data?.seller) {
          // Clean and normalize the data
          const cleanedData = cleanObjectData(response.data)
          updateSearchState({ result: cleanedData, isSearching: false })
          toast.success("Seller found successfully!")
        } else {
          updateSearchState({ isSearching: false })
          toast.error(response.message || "No seller found with that name and platform")
        }
      } catch (error: any) {
        console.error("Search error:", error)
        updateSearchState({ isSearching: false })
        toast.error(error.response?.data?.message || "Failed to search seller. Please try again.")
      }
    } else if (searchMode === "name-platform-location") {
      if (!sellerName.trim() || !selectedPlatform || !selectedLocation.trim()) {
        toast.error("Please fill in all fields")
        return
      }
      
      updateSearchState({ isSearching: true, result: null })
      try {
        const response = await sellersAPI.searchByNamePlatformLocation({
          name: sellerName.trim(),
          platform: selectedPlatform,
          location: selectedLocation.trim()
        })

        if (response.success && response.data?.sellers && response.data.sellers.length > 0) {
          // The API returns an array of sellers, we'll show the first one
          // Transform the response to match the expected format
          const firstSeller = response.data.sellers[0]
          const cleanedData = cleanObjectData({
            seller: firstSeller,
            pagination: response.data.pagination
          })
          
          updateSearchState({
            result: cleanedData,
            isSearching: false
          })
          if (response.data.sellers.length > 1) {
            toast.success(`Found ${response.data.sellers.length} sellers. Showing first result.`)
          } else {
            toast.success("Seller found successfully!")
          }
        } else {
          updateSearchState({ isSearching: false })
          toast.error(response.message || "No sellers found matching your criteria")
        }
      } catch (error: any) {
        console.error("Search error:", error)
        updateSearchState({ isSearching: false })
        toast.error(error.response?.data?.message || "Failed to search sellers. Please try again.")
      }
    }
  }

  const removeFilter = (type: 'platform' | 'location' | 'trust' | 'name') => {
    if (type === 'platform') {
      // If platform is required for current mode, clear mode
      if (searchMode === "name-platform" || searchMode === "name-platform-location") {
        if (searchMode === "name-platform") {
          updateSearchState({ 
            selectedPlatform: "",
            mode: null,
            sellerName: ""
          })
        } else {
          updateSearchState({ 
            selectedPlatform: "",
            mode: "name-platform"
          })
        }
      } else {
        updateSearchState({ selectedPlatform: "" })
      }
    }
    if (type === 'location') {
      // If location is required for current mode, switch to name-platform mode
      if (searchMode === "name-platform-location") {
        updateSearchState({ 
          selectedLocation: "",
          mode: "name-platform"
        })
      } else {
        updateSearchState({ selectedLocation: "" })
      }
    }
    if (type === 'trust') {
      updateSearchState({ minTrustScore: null })
    }
    if (type === 'name') {
      if (searchMode === "name-platform" || searchMode === "name-platform-location") {
        updateSearchState({
          sellerName: "",
          mode: null,
          selectedPlatform: "",
          selectedLocation: ""
        })
      } else {
        updateSearchState({ sellerName: "" })
      }
    }
  }

  const clearAllFilters = () => {
    updateSearchState({
      mode: null,
      profileUrl: "",
      sellerName: "",
      selectedPlatform: "",
      selectedLocation: "",
      minTrustScore: null
    })
  }

  const handleViewSellerProfile = async () => {
    updateSellerProfileState({ isLoading: true })
    try {
      const response = await sellersAPI.getMySellerProfile()
      
      if (response.success && response.data?.seller) {
        updateSellerProfileState({ 
          data: response.data,
          isLoading: false
        })
        updateModalState({ showSellerProfile: true })
      } else {
        updateSellerProfileState({ isLoading: false })
        toast.error(response.message || "Failed to load seller profile")
      }
    } catch (error: any) {
      console.error("Error loading seller profile:", error)
      updateSellerProfileState({ isLoading: false })
      toast.error(error.response?.data?.message || "Failed to load seller profile. Please try again.")
    }
  }

  const handleRecalculateScore = async () => {
    updateSellerProfileState({ isRecalculating: true })
    try {
      // First, get the seller profile to obtain the seller ID
      const profileResponse = await sellersAPI.getMySellerProfile()
      
      if (!profileResponse.success || !profileResponse.data?.seller?._id) {
        updateSellerProfileState({ isRecalculating: false })
        toast.error("Failed to get seller ID. Please try again.")
        return
      }

      const sellerId = profileResponse.data.seller._id
      
      // Then, recalculate the score
      const response = await sellersAPI.recalculateScore(sellerId)
      
      if (response.success && response.data) {
        // Transform the response to match the modal's expected format
        updateSellerProfileState({
          data: response.data,
          isRecalculating: false
        })
        updateModalState({ showSellerProfile: true })
        toast.success("Score recalculated successfully!")
      } else {
        updateSellerProfileState({ isRecalculating: false })
        toast.error(response.message || "Failed to recalculate score")
      }
    } catch (error: any) {
      console.error("Error recalculating score:", error)
      updateSellerProfileState({ isRecalculating: false })
      toast.error(error.response?.data?.message || "Failed to recalculate score. Please try again.")
    }
  }

  // Buyer-focused dark hero section
  if (isBuyer) {
    return (
      <div className="w-full px-6 py-24 lg:py-32 bg-gradient-to-br from-[#1D2973] via-[#1a2468] to-[#0f1538] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Headline */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-purple-200">
              Verified Sellers in the Marketplace
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Search {265} verified seller profiles available across platforms. Shop with confidence - verify sellers before you buy.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-[#1D2973] flex items-center justify-center text-sm font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-purple-100 text-sm lg:text-base">Trusted by 10,000+ buyers</span>
          </div>

          {/* Search Mode Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              onClick={() => {
                updateSearchState({
                  mode: "profile-url",
                  sellerName: "",
                  selectedPlatform: "",
                  selectedLocation: ""
                })
              }}
              variant={searchMode === "profile-url" ? "primary" : "secondary"}
              size="xl"
              className={`flex items-center gap-2 px-6 py-3 ${
                searchMode === "profile-url"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
              }`}
            >
              <Link2 className="w-5 h-5" />
              <span>Search by Profile URL</span>
            </Button>
            <Button
              onClick={() => {
                updateSearchState({
                  mode: "name-platform",
                  profileUrl: "",
                  selectedLocation: ""
                })
              }}
              variant={searchMode === "name-platform" ? "primary" : "secondary"}
              size="xl"
              className={`flex items-center gap-2 px-6 py-3 ${
                searchMode === "name-platform"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Search by Name and Platform</span>
            </Button>
            <Button
              onClick={() => updateSearchState({ mode: "name-platform-location" })}
              variant={searchMode === "name-platform-location" ? "primary" : "secondary"}
              size="xl"
              className={`flex items-center gap-2 px-6 py-3 ${
                searchMode === "name-platform-location"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Search by Name, Platform and Location</span>
            </Button>
          </div>

          {/* Dynamic Search Bar */}
          {searchMode && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Profile URL Mode */}
                {searchMode === "profile-url" && (
                  <>
                    <div className="flex-1 relative min-w-[300px]">
                      <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="url"
                        placeholder="Enter seller profile URL (e.g., https://jiji.ng/shop/...)"
                        value={profileUrl}
                        onChange={(e) => updateSearchState({ profileUrl: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-12 pr-4 py-6 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!profileUrl.trim() || isSearching}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </>
                )}

                {/* Name and Platform Mode */}
                {searchMode === "name-platform" && (
                  <>
                    <div className="flex-1 relative min-w-[200px]">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter seller name or store name"
                        value={sellerName}
                        onChange={(e) => updateSearchState({ sellerName: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-12 pr-4 py-6 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="w-64">
                      <Select value={selectedPlatform} onValueChange={(value) => updateSearchState({ selectedPlatform: value })}>
                        <SelectTrigger className="w-full py-6 bg-gray-900 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 hover:border-gray-600">
                          <div className="flex items-center gap-2 w-full">
                            <Laptop className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <SelectValue placeholder="Select Platform" className="text-white" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {platforms.map((platform) => (
                            <SelectItem
                              key={platform.value}
                              value={platform.value}
                              className="text-white focus:bg-gray-800 focus:text-white cursor-pointer"
                            >
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!sellerName.trim() || !selectedPlatform || isSearching}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </>
                )}

                {/* Name, Platform and Location Mode */}
                {searchMode === "name-platform-location" && (
                  <>
                    <div className="flex-1 relative min-w-[200px]">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter seller name or store name"
                        value={sellerName}
                        onChange={(e) => updateSearchState({ sellerName: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-12 pr-4 py-6 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="w-56">
                      <Select value={selectedPlatform} onValueChange={(value) => updateSearchState({ selectedPlatform: value })}>
                        <SelectTrigger className="w-full py-6 bg-gray-900 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 hover:border-gray-600">
                          <div className="flex items-center gap-2 w-full">
                            <Laptop className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <SelectValue placeholder="Select Platform" className="text-white" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {platforms.map((platform) => (
                            <SelectItem
                              key={platform.value}
                              value={platform.value}
                              className="text-white focus:bg-gray-800 focus:text-white cursor-pointer"
                            >
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 relative min-w-[200px]">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter location (e.g., Lagos, Nigeria)"
                        value={selectedLocation}
                        onChange={(e) => updateSearchState({ selectedLocation: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-12 pr-4 py-6 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!sellerName.trim() || !selectedPlatform || !selectedLocation.trim() || isSearching}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {searchMode && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center flex-wrap gap-2">
                {/* Profile URL Filter */}
                {searchMode === "profile-url" && profileUrl && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                    <Link2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white max-w-xs truncate">{profileUrl}</span>
                    <button
                      onClick={() => {
                        updateSearchState({
                          profileUrl: "",
                          mode: null
                        })
                      }}
                      className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Seller Name Filter */}
                {(searchMode === "name-platform" || searchMode === "name-platform-location") && sellerName && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">{sellerName}</span>
                    <button
                      onClick={() => removeFilter('name')}
                      className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Platform Filter */}
                {selectedPlatform && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                    <Laptop className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">
                      {platforms.find(p => p.value === selectedPlatform)?.label || selectedPlatform}
                    </span>
                    <button
                      onClick={() => removeFilter('platform')}
                      className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}
              
                {/* Location Filter */}
                {searchMode === "name-platform-location" && selectedLocation && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">{selectedLocation}</span>
                    <button
                      onClick={() => removeFilter('location')}
                      className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Trust Score Filter (if added) */}
                {minTrustScore !== null && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">Min Trust: {minTrustScore}%</span>
                    <button
                      onClick={() => removeFilter('trust')}
                      className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Clear All Button */}
                {((searchMode === "profile-url" && profileUrl) ||
                  (searchMode === "name-platform" && (sellerName || selectedPlatform)) ||
                  (searchMode === "name-platform-location" && (sellerName || selectedPlatform || selectedLocation))) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 rounded-full border border-red-700 text-sm text-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Additional Filter Options */}
          {showAllFilters && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 text-sm text-purple-200">
                  Verified only
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 text-sm text-purple-200">
                  High trust score (80+)
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 text-sm text-purple-200">
                  Active sellers
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Seller Results - Inline Display */}
        {searchResult && (
          <div 
            ref={resultsRef}
            id="seller-results"
            className="mt-12 mb-8 bg-white border-2 border-blue-300 rounded-3xl shadow-2xl p-8 relative z-10 transform transition-all duration-500 ease-out hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
            style={{ 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)',
              animation: 'fadeInUp 0.6s ease-out'
            }}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Analysis Results</h2>
                <p className="text-gray-600">Detailed analysis of the seller profile</p>
              </div>
              <button
                onClick={() => updateSearchState({ result: null })}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close results"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <SellerProfileDisplay data={searchResult} isLoggedIn={isLoggedIn} />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Seller-focused hero section
  if (isSeller) {
    return (
      <div className="w-full px-6 py-24 lg:py-32 bg-gradient-to-br from-[#1D2973] via-[#1a2468] to-[#0f1538] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Headline */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-purple-200">
              Build Trust, Grow Your Business
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Get verified, earn buyer confidence, and boost your sales with instant seller verification and trust scores.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-purple-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Get Verified</div>
              <p className="text-purple-200 text-sm">Complete your profile verification to build trust</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-purple-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Track Performance</div>
              <p className="text-purple-200 text-sm">Monitor your trust score and analytics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-purple-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Grow Sales</div>
              <p className="text-purple-200 text-sm">Stand out with verified seller badges</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant="primary"
              size="xl"
              className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleViewSellerProfile}
              disabled={isLoadingProfile}
            >
              {isLoadingProfile ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>My Seller Profile</span>
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="xl"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRecalculateScore}
              disabled={isRecalculating}
            >
              {isRecalculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Recalculate My Score</span>
                </>
              )}
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-[#1D2973] flex items-center justify-center text-sm font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-purple-100 text-sm lg:text-base">Trusted by 5,000+ sellers</span>
          </div>
        </div>

        {/* Seller Profile Modal */}
        {sellerProfile && (
          <SellerResultModal
            data={sellerProfile}
            isOpen={showSellerProfileModal}
            onClose={() => {
              updateModalState({ showSellerProfile: false })
              updateSellerProfileState({ data: null })
            }}
          />
        )}
      </div>
    )
  }

  // Original hero section for guests
  return (
    <div className="w-full px-6 py-12 bg-gradient-to-br from-blue-50 via-white to-yellow-50 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-1000 delay-300">
            {/* MVP Badge */}
            <Badge variant="success" className="text-sm px-4 py-2">
              MVP LIVE NOW
            </Badge>

            {/* Headline */}
            <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {isSeller ? (
                <>
                  <span className="block">Build</span>
                  <span className="block text-[#D59B0D]">Trust</span>
                  <span className="block">Grow Sales</span>
                </>
              ) : (
                <>
                  <span className="block">Shop with</span>
                  <span className="block text-[#D59B0D]">Confidence</span>
                  <span className="block">Safely</span>
                </>
              )}
            </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                {isSeller ? (
                  <>
                    Build trust and grow your business with instant seller verification and trust scores.{" "}
                    <span className="text-[#1D2973] font-semibold">
                      Get verified, earn buyer confidence, and boost your sales.
                    </span>
                  </>
                ) : (
                  <>
                    Instant marketplace seller verification and trust scores for safer transactions.{" "}
                    <span className="text-[#1D2973] font-semibold">
                      Say goodbye to scams, hello to safe shopping.
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isLoggedIn && (
                <Button variant="primary" size="xl" className="flex items-center space-x-2 hover:shadow-lg transition-all duration-300" asChild>
                  <a href="/auth?mode=signup">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              )}
              
              <Button variant="secondary" size="xl" className="flex items-center space-x-2 hover:shadow-lg transition-all duration-300" asChild>
                <a 
                  href="https://chromewebstore.google.com/detail/mfpkpchpddnicfddlpfdnpcodfmeoiha?utm_source=item-share-cb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Extension</span>
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex space-x-12 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100K+</div>
                <div className="text-sm text-gray-600">Protected Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50M+</div>
                <div className="text-sm text-gray-600">Sellers Analyzed</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end animate-in slide-in-from-right duration-1000 delay-500">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              {/* Phone Mockup */}
              <div className="w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Phone Header */}
                  <div className="bg-white px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">9:41</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#1D2973] to-[#1a2468] rounded flex items-center justify-center">
                          <Search className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Verible</span>
                      </div>
                      <div className="text-sm text-gray-500">Trust Intelligence</div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-4 space-y-4 bg-gray-50 h-full">
                    {/* Positive Seller Card */}
                    <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-semibold text-gray-900">TechnovationStore</span>
                        </div>
                        <span className="text-xs text-gray-500">Facebook Marketplace</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-green-600">89</div>
                        <div className="text-xs text-gray-500">Pulse Score</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Verified Business License</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">5000+ Positive Reviews</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Active for 4+ years</span>
                        </div>
                      </div>
                    </div>

                    {/* Negative Seller Card */}
                    <div className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-semibold text-gray-900">QuickDeals99</span>
                        </div>
                        <span className="text-xs text-gray-500">Facebook Marketplace</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-red-600">18%</div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">High complaint ratio</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">New account (2 months)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">No verified contact info</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
                      <div className="flex items-center justify-around">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-6 h-6 bg-[#1D2973] rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs text-[#1D2973] font-medium">Trust</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500">Analytics</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500">Sellers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

