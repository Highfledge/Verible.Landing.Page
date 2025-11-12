"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, MessageCircle, Mail, Phone, ChevronDown, Globe, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserDropdown } from "@/components/user-dropdown"
import { SellerProfileDisplay } from "@/components/seller-profile-display"
import { useAuth } from "@/lib/stores/auth-store"
import { sellersAPI } from "@/lib/api/client"
import { toast } from "sonner"
import { cleanObjectData } from "@/lib/utils/clean-data"

const platforms = [
  { value: "all", label: "All Platforms", status: "" },
  { value: "facebook", label: "Facebook Marketplace", status: "LIVE", live: true },
  { value: "jiji", label: "Jiji", status: "LIVE", live: true },
  { value: "ebay", label: "eBay", status: "LIVE", live: true },
  { value: "etsy", label: "Etsy", status: "LIVE", live: true },
  { value: "jumia", label: "Jumia", status: "LIVE", live: true },
  { value: "kijiji", label: "Kijiji", status: "LIVE", live: true },
  { value: "konga", label: "Konga", status: "LIVE", live: true },
  { value: "amazon", label: "Amazon", status: "Planned" },
  { value: "aliexpress", label: "AliExpress", status: "Planned" },
  { value: "instagram", label: "Instagram Shopping", status: "Planned" },
  { value: "tiktok", label: "TikTok Shops", status: "Planned" },
  { value: "shopify", label: "Shopify", status: "Planned" },
]

const languages = [
  { code: "US", label: "US English" },
  { code: "ES", label: "ES Español" },
  { code: "FR", label: "FR Français" },
  { code: "DE", label: "DE Deutsch" },
  { code: "IT", label: "IT Italiano" },
  { code: "PT", label: "PT Português" },
  { code: "CN", label: "CN Chinese" },
  { code: "JP", label: "JP Japanese" },
  { code: "KR", label: "KR Korean" },
  { code: "RU", label: "RU Russian" },
  { code: "SA", label: "SA Arabic" },
  { code: "IN", label: "IN Hindi" },
]

export function BuyerToolsPage() {
  const { isLoggedIn } = useAuth()
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("US")
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [sellerUrl, setSellerUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sellerData, setSellerData] = useState<any>(null)
  const platformRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setPlatformDropdownOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Auto-scroll to results when sellerData becomes available
  useEffect(() => {
    if (sellerData && resultsRef.current) {
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
  }, [sellerData])

  const selectedPlatformData = platforms.find(p => p.value === selectedPlatform)
  const selectedLanguageData = languages.find(l => l.code === selectedLanguage)

  const handleSearch = async () => {
    if (!sellerUrl.trim()) {
      toast.error("Please enter a seller URL")
      return
    }

    setIsLoading(true)
    setSellerData(null)

    try {
      let response
      if (isLoggedIn) {
        response = await sellersAPI.extractProfile({ profileUrl: sellerUrl })
      } else {
        response = await sellersAPI.scoreByUrl({ profileUrl: sellerUrl })
      }

      const apiData = response?.data
      // Clean the data first to remove escaped backslashes
      const cleanedData = cleanObjectData(apiData)
      
      // Normalize score-by-url shape to match SellerProfileDisplay expectations
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
              profileUrl: '',
              profileData: cleanedData?.profileData || {},
              marketplaceData: cleanedData?.marketplaceData || {},
              recentListings: cleanedData?.recentListings || [],
              trustIndicators: cleanedData?.scoringResult?.trustIndicators || {},
            },
            scoringResult: cleanedData?.scoringResult || {},
          }

      console.log("Seller data response (normalized):", normalized)
      setSellerData(normalized)
      toast.success("Seller profile analyzed successfully!")
    } catch (error: any) {
      console.error("Search error:", error)
      const errorMessage = error.response?.data?.message || "Failed to analyze seller profile. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/verible-logo.png"
              alt="Verible Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-gray-900">Verible</span>
          </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium">Platform</Link>
              <div className="relative" ref={languageRef}>
                <button 
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>{selectedLanguageData?.code}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code)
                          setLanguageDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center justify-between ${
                          selectedLanguage === lang.code ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className="text-sm text-gray-700">{lang.label}</span>
                        {selectedLanguage === lang.code && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <UserDropdown />
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Home Icon - Top Left */}
          <div className="mb-6">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <svg className="w-6 h-6 text-gray-600 hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Buyer Protection Tools</h1>
            <p className="text-xl text-gray-600">Get instant seller verification and trust scores to shop with confidence</p>
          </div>

          {/* MVP Card */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">MVP: Jiji Marketplace Focus</h2>
                  <Badge variant="success" className="text-sm px-3 py-1">LIVE NOW</Badge>
                  <span className="text-gray-600">• Single Platform Strategy</span>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  We're starting with Jiji Marketplace to perfect our trust scoring algorithm. This focused approach ensures reliable, accurate results before expanding to other platforms.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                    View Roadmap →
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Verification Search</h2>
                <p className="text-gray-600">Get instant trust scores and detailed seller analysis</p>
              </div>
            </div>

            {/* Search Form */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seller Profile URL</label>
                  <Input
                    type="url"
                    placeholder="https://www.jiji.com/marketplace/profile/..."
                    value={sellerUrl}
                    onChange={(e) => setSellerUrl(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
                <div className="sm:w-56" ref={platformRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <div className="relative">
                    <button
                      onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">
                        {selectedPlatformData?.label}
                        {selectedPlatformData?.live && (
                          <Badge variant="success" className="ml-2 text-xs px-1.5 py-0.5">LIVE</Badge>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {platformDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                        {platforms.map((platform) => (
                          <button
                            key={platform.value}
                            onClick={() => {
                              setSelectedPlatform(platform.value)
                              setPlatformDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center justify-between ${
                              selectedPlatform === platform.value ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700">{platform.label}</span>
                              {platform.status && (
                                <Badge 
                                  variant={platform.live ? "success" : "outline"} 
                                  className={`text-xs px-1.5 py-0.5 ${
                                    !platform.live ? "text-gray-600 border-gray-300" : ""
                                  }`}
                                >
                                  {platform.status}
                                </Badge>
                              )}
                            </div>
                            {selectedPlatform === platform.value && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                  <Button 
                    onClick={handleSearch}
                    disabled={isLoading || !sellerUrl.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Analyzing..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Search Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Search Tips</h3>
                <ul className="space-y-2 text-sm text-blue-600">
                  <li>• Paste the complete seller profile URL from Jiji Marketplace</li>
                  <li>• URL should look like: https://www.jiji.com/marketplace/profile/...</li>
                  <li>• Jiji Marketplace analysis is currently live and ready</li>
                  {!isLoggedIn && (
                    <li>• <strong>Sign in for detailed seller analysis and profile extraction</strong></li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Seller Results */}
          {sellerData && (
            <div 
              ref={resultsRef}
              id="seller-results"
              className="mb-8 mt-8 bg-white border-2 border-blue-300 rounded-3xl shadow-2xl p-8 relative z-10 transform transition-all duration-500 ease-out hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
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
              </div>

              <div className="relative">
                <SellerProfileDisplay data={sellerData} isLoggedIn={isLoggedIn} />
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-6">Our support team is here to help with any questions about seller verification or platform features.</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600">Available 24/7</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-sm text-gray-600">help@verible.com</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
