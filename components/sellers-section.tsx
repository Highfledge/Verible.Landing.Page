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

type FilterType = "top" | "all"

export function SellersSection() {
  const { isLoggedIn, user } = useAuth()
  const [filter, setFilter] = useState<FilterType>("top")
  const [searchQuery, setSearchQuery] = useState("")
  const [sellers, setSellers] = useState<Seller[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Load sellers when filter changes
  useEffect(() => {
    loadSellers()
  }, [filter])

  const loadSellers = async () => {
    setIsLoading(true)
    try {
      let response
      if (filter === "top") {
        response = await sellersAPI.getTopSellers({
          search: searchQuery || undefined,
          limit: 20,
          offset: 0
        })
      } else {
        response = await sellersAPI.getAllSellers({
          search: searchQuery || undefined,
          limit: 20,
          offset: 0
        })
      }

      // Handle the API response structure
      if (response.success && response.data && response.data.sellers) {
        // Clean the seller data to remove escaped backslashes
        const cleanedSellers = cleanObjectData(response.data.sellers)
        setSellers(cleanedSellers)
      } else {
        console.error("Invalid API response structure:", response)
        toast.error("Invalid response from server")
        setSellers([])
      }
    } catch (error: any) {
      console.error("Error loading sellers:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to load sellers. Please try again.")
      setSellers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    loadSellers()
  }

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setDropdownOpen(false)
  }

  const handleViewProfile = (seller: Seller) => {
    // TODO: Navigate to seller profile page
    console.log("View profile for:", seller.profileData.name)
    toast.info(`Viewing profile for ${seller.profileData.name}`)
  }

  // Only show to logged-in buyers
  if (!isLoggedIn || user?.role !== 'user') {
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        {!isLoading && sellers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellers.map((seller) => (
              <SellerCard
                key={seller._id}
                seller={seller}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sellers.length === 0 && (
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
                  setSearchQuery("")
                  loadSellers()
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {!isLoading && sellers.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Sellers
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
