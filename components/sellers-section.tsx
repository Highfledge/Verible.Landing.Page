"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SellerCard } from "@/components/seller-card"
import { sellersAPI } from "@/lib/api/client"
import { useAuth } from "@/lib/stores/auth-store"
import { 
  Search, 
  ChevronDown, 
  Loader2, 
  Users, 
  TrendingUp,
  Filter
} from "lucide-react"
import { toast } from "sonner"
import { cleanObjectData } from "@/lib/utils/clean-data"
import { SellerResultModal } from "@/components/seller-result-modal"

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
  flags?: any[]
  endorsements?: any[]
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

type FilterType = "top" | "all"

const SELLERS_PER_PAGE = 10
const INITIAL_FETCH_LIMIT = 100 // Fetch 100 sellers at once

export function SellersSection() {
  const { isLoggedIn, user, isBuyerView } = useAuth()
  const [filter, setFilter] = useState<FilterType>("top")
  const [searchInput, setSearchInput] = useState("") // Input field value
  const [searchQuery, setSearchQuery] = useState("") // Actual search query used for API
  const [allSellers, setAllSellers] = useState<Seller[]>([]) // All fetched sellers
  const [displayedSellers, setDisplayedSellers] = useState<Seller[]>([]) // Currently displayed sellers
  const [displayCount, setDisplayCount] = useState(SELLERS_PER_PAGE) // Number of sellers to display
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [selectedSellerData, setSelectedSellerData] = useState<any | null>(null)
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [isLoadingSeller, setIsLoadingSeller] = useState(false)

  const filterOptions = [
    { value: "top", label: "Top Sellers", icon: TrendingUp },
    { value: "all", label: "All Sellers", icon: Users }
  ]

  const selectedFilter = filterOptions.find(option => option.value === filter)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Load sellers when filter or search changes
  useEffect(() => {
    // Reset pagination when filter or search changes
    const loadInitialSellers = async () => {
      setDisplayCount(SELLERS_PER_PAGE)
      setAllSellers([])
      setDisplayedSellers([])
      await loadAllSellers()
    }
    loadInitialSellers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery])

  // Update displayed sellers when allSellers or displayCount changes
  useEffect(() => {
    const displayed = allSellers.slice(0, displayCount)
    setDisplayedSellers(displayed)
    
    // Check if there are more sellers to display
    setHasMore(displayCount < allSellers.length)
  }, [allSellers, displayCount])

  // Helper function to deduplicate sellers by _id
  const deduplicateSellers = (sellers: Seller[]): Seller[] => {
    const seen = new Set<string>()
    return sellers.filter((seller) => {
      if (seen.has(seller._id)) {
        return false
      }
      seen.add(seller._id)
      return true
    })
  }

  const loadAllSellers = async () => {
    setIsLoading(true)
    try {
      let response
      if (filter === "top") {
        response = await sellersAPI.getTopSellers({
          search: searchQuery || undefined,
          limit: INITIAL_FETCH_LIMIT,
          offset: 0
        })
      } else {
        response = await sellersAPI.getAllSellers({
          search: searchQuery || undefined,
          limit: INITIAL_FETCH_LIMIT,
          offset: 0
        })
      }

      // Handle the API response structure
      if (response.success && response.data && response.data.sellers) {
        // Clean the seller data to remove escaped backslashes
        const cleanedSellers = cleanObjectData(response.data.sellers)
        
        // Deduplicate sellers to prevent duplicate keys
        const uniqueSellers = deduplicateSellers(cleanedSellers)
        
        setAllSellers(uniqueSellers)
      } else {
        // console.error("Invalid API response structure:", response)
        // toast.error("Invalid response from server")
        setAllSellers([])
      }
    } catch (error: any) {
      // console.error("Error loading sellers:", error)
      // toast.error(error.response?.data?.message || error.message || "Failed to load sellers. Please try again.")
      setAllSellers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    // Update searchQuery which triggers the useEffect to reload sellers
    setSearchQuery(searchInput.trim())
  }

  const handleLoadMore = () => {
    // Simply increase the display count (client-side pagination)
    setDisplayCount((prev) => prev + SELLERS_PER_PAGE)
  }

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setDropdownOpen(false)
  }

  const handleViewProfile = async (seller: Seller) => {
    setIsLoadingSeller(true)
    try {
      const response = await sellersAPI.getSellerById(seller._id)
      
      // Handle response structure: API returns { success, message, data: { profileData, marketplaceData, ... } }
      // getSellerById returns response.data from axios, which contains { success, message, data }
      // So we need to access response.data.data to get the actual data object
      const apiData = response?.data?.data || response?.data || response
      
      if (response?.success && apiData) {
        // Clean the data first - apiData contains { profileData, marketplaceData, recentListings, scoringResult }
        const cleanedData = cleanObjectData(apiData)
        
        // Normalize the data structure to match SellerProfileDisplay expectations
        // The API returns: { profileData, marketplaceData, recentListings, scoringResult }
        // But SellerProfileDisplay expects: { seller: {...}, extractedData: {...}, scoringResult: {...} }
        const normalized = cleanedData?.seller
          ? cleanedData // Already in the correct format
          : {
              seller: {
                profileData: cleanedData?.profileData || {},
                marketplaceData: cleanedData?.marketplaceData || {},
                pulseScore: cleanedData?.scoringResult?.pulseScore ?? seller.pulseScore ?? 0,
                confidenceLevel: cleanedData?.scoringResult?.confidenceLevel || seller.confidenceLevel || 'low',
                verificationStatus: cleanedData?.verificationStatus || cleanedData?.marketplaceData?.verificationStatus || seller.verificationStatus || 'unverified',
                lastSeen: cleanedData?.marketplaceData?.lastSeen || seller.lastSeen || '',
                recentListings: cleanedData?.recentListings || [],
                listingHistory: cleanedData?.listingHistory || seller.listingHistory || [],
                flags: cleanedData?.flags || seller.flags || [],
                endorsements: cleanedData?.endorsements || seller.endorsements || [],
                scoringFactors: cleanedData?.scoringResult?.scoringFactors || {},
                isActive: cleanedData?.isActive ?? seller.isActive ?? true,
                isClaimed: cleanedData?.isClaimed ?? seller.isClaimed ?? false,
                firstSeen: cleanedData?.firstSeen || seller.firstSeen,
                lastScored: cleanedData?.lastScored || seller.lastScored,
                createdAt: cleanedData?.createdAt || seller.createdAt,
                updatedAt: cleanedData?.updatedAt || seller.updatedAt,
                profileUrl: cleanedData?.profileUrl || seller.profileUrl,
                platform: cleanedData?.platform || cleanedData?.marketplaceData?.platform || seller.platform,
              },
              extractedData: {
                platform: cleanedData?.marketplaceData?.platform || cleanedData?.platform || seller.platform || 'unknown',
                profileUrl: cleanedData?.profileUrl || seller.profileUrl || '',
                profileData: cleanedData?.profileData || {},
                marketplaceData: cleanedData?.marketplaceData || {},
                recentListings: cleanedData?.recentListings || [],
                trustIndicators: cleanedData?.scoringResult?.trustIndicators || cleanedData?.trustIndicators || {},
              },
              scoringResult: cleanedData?.scoringResult || {},
            }
        
        console.log("Normalized seller data:", normalized)
        setSelectedSellerData(normalized)
        setShowSellerModal(true)
      } else {
        // toast.error(response.message || "Failed to load seller details")
        return
      }
    } catch (error: any) {
      // console.error("Error loading seller details:", error)
      // toast.error(error.response?.data?.message || "Failed to load seller details. Please try again.")
    } finally {
      setIsLoadingSeller(false)
    }
  }

  // Only show to logged-in buyers (or sellers viewing as buyer)
  const isBuyer = isLoggedIn && (user?.role === "user" || (user?.role === "seller" && isBuyerView))
  if (!isBuyer) {
    return null
  }

  return (
    <section className="w-full px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          {/* Left: Filter Text */}
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedFilter?.label}
            </h2>
            <p className="text-gray-600">
              Discover trusted sellers and their latest offerings
            </p>
          </div>

          {/* Center: Search Input */}
          <div className="flex-1 max-w-md mx-4 mb-4 lg:mb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search sellers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Right: Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 min-w-[140px] justify-between"
            >
              <div className="flex items-center space-x-2">
                {selectedFilter && <selectedFilter.icon className="w-4 h-4" />}
                <span>{selectedFilter?.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value as FilterType)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                      filter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading sellers...</span>
            </div>
          </div>
        )}

        {/* Sellers Grid */}
        {!isLoading && displayedSellers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedSellers.map((seller) => (
              <SellerCard
                key={seller._id}
                seller={seller}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayedSellers.length === 0 && allSellers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sellers found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? `No sellers match "${searchQuery}"` : "No sellers available at the moment"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchInput("")
                  setSearchQuery("")
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && displayedSellers.length > 0 && hasMore && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
            >
              Load More Sellers
            </Button>
          </div>
        )}
      </div>

      {/* Seller Details Modal */}
      {selectedSellerData && (
        <SellerResultModal
          data={selectedSellerData}
          isOpen={showSellerModal}
          onClose={() => {
            setShowSellerModal(false)
            setSelectedSellerData(null)
          }}
        />
      )}
    </section>
  )
}
