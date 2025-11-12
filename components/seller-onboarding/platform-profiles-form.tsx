"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, ShoppingCart, Tag, Martini, Square, FileText, Smartphone, CheckCircle2, Store, Building, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformProfilesFormProps {
  onBack: () => void
  onComplete: () => void
}

const platforms = [
  {
    id: "facebook",
    name: "Facebook Marketplace",
    icon: Square,
    color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
    iconColor: "text-blue-600",
  },
  {
    id: "jiji",
    name: "Jiji",
    icon: Globe,
    color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
    iconColor: "text-yellow-600",
  },
  {
    id: "ebay",
    name: "eBay",
    icon: Tag,
    color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
    iconColor: "text-blue-600",
  },
  {
    id: "etsy",
    name: "Etsy",
    icon: Martini,
    color: "bg-pink-100 hover:bg-pink-200 border-pink-300",
    iconColor: "text-pink-600",
  },
  {
    id: "jumia",
    name: "Jumia",
    icon: Store,
    color: "bg-orange-100 hover:bg-orange-200 border-orange-300",
    iconColor: "text-orange-600",
  },
  {
    id: "kijiji",
    name: "Kijiji",
    icon: Building,
    color: "bg-red-100 hover:bg-red-200 border-red-300",
    iconColor: "text-red-600",
  },
  {
    id: "konga",
    name: "Konga",
    icon: Building2,
    color: "bg-green-100 hover:bg-green-200 border-green-300",
    iconColor: "text-green-600",
  },
  {
    id: "amazon",
    name: "Amazon",
    icon: ShoppingCart,
    color: "bg-orange-100 hover:bg-orange-200 border-orange-300",
    iconColor: "text-orange-600",
  },
  {
    id: "craigslist",
    name: "Craigslist",
    icon: FileText,
    color: "bg-purple-100 hover:bg-purple-200 border-purple-300",
    iconColor: "text-purple-600",
  },
  {
    id: "offerup",
    name: "OfferUp",
    icon: Smartphone,
    color: "bg-green-100 hover:bg-green-200 border-green-300",
    iconColor: "text-green-600",
  },
]

export function PlatformProfilesForm({ onBack, onComplete }: PlatformProfilesFormProps) {
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set())

  const handlePlatformClick = (platformId: string) => {
    setConnectedPlatforms((prev) => {
      const next = new Set(prev)
      if (next.has(platformId)) {
        next.delete(platformId)
      } else {
        next.add(platformId)
      }
      return next
    })
    // TODO: Open platform connection modal/OAuth flow
    console.log(`Connecting to ${platformId}...`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Platform Profiles</h2>
        </div>
        <p className="text-sm text-green-100 mt-2">
          Connect your existing marketplace profiles to improve your trust score
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Platform Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isConnected = connectedPlatforms.has(platform.id)

            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform.id)}
                className={cn(
                  "relative p-6 rounded-lg border-2 transition-all duration-200 text-left",
                  "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  isConnected
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                    : platform.color + " border-transparent"
                )}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      isConnected ? "bg-blue-500" : "bg-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        isConnected ? "text-white" : platform.iconColor
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                    <p className="text-sm text-gray-600">
                      {isConnected ? "Connected" : "Click to connect"}
                    </p>
                  </div>
                  {isConnected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Why Connect Platforms Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Connect Platforms?</h3>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Automatically sync your existing reviews and ratings
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Verify your seller history across platforms
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Improve your Pulse Score with proven track record
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Get credit for positive seller behavior
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pb-20">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={onComplete}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            Continue to Verification
          </Button>
        </div>
      </div>
    </div>
  )
}

