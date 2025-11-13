"use client"

import { Button } from "@/components/ui/button"
import { User, Home, ShoppingCart, BarChart3, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/stores/auth-store"
import { usePathname } from "next/navigation"

export function StickyBottomBar() {
  const { isLoggedIn, user, isBuyerView } = useAuth()
  const pathname = usePathname()
  
  // Use viewMode to determine if showing buyer view
  // If user is a seller, they can toggle between views
  // If user is a buyer, they always see buyer view
  const isBuyer = isLoggedIn && (user?.role === "user" || (user?.role === "seller" && isBuyerView))
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1D2973] border-t border-[#1a2468] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 relative">
        {isBuyer ? (
          // Buyer navigation
          <div className="flex items-center justify-between w-full">
            {/* Left - Verible Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Image
                src="/verible-logo.png"
                alt="Verible Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-lg"
              />
              <span className="text-sm font-medium text-white">Verible</span>
            </div>

            {/* Center - Navigation Items */}
            <div className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              <Link
                href="/"
                className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors ${
                  pathname === "/" ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <Home className="w-5 h-5 text-white" />
                <span className="text-xs text-white font-medium">Dashboard</span>
              </Link>
              
              <Link
                href="/buyer-tools"
                className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors ${
                  pathname === "/buyer-tools" ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="text-xs text-white font-medium">Buyer Tools</span>
              </Link>
              
              <Link
                href="/analytics"
                className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors ${
                  pathname === "/analytics" ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <BarChart3 className="w-5 h-5 text-white" />
                <span className="text-xs text-white font-medium">Analytics</span>
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  // Trigger settings from UserDropdown
                  const settingsButton = document.querySelector('[data-settings-trigger]') as HTMLElement
                  if (settingsButton) {
                    settingsButton.click()
                  }
                }}
                className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors hover:bg-white/10`}
              >
                <Settings className="w-5 h-5 text-white" />
                <span className="text-xs text-white font-medium">Settings</span>
              </button>
            </div>

            {/* Right - User Avatar */}
            <div className="flex-shrink-0 ml-auto">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">{user?.name || "User"}</span>
              </div>
            </div>
          </div>
        ) : (
          // Default layout (not logged in or not buyer)
          <div className="flex items-center justify-between w-full">
            {/* Left - Verible Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Image
                src="/verible-logo.png"
                alt="Verible Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-lg"
              />
              <span className="text-sm font-medium text-white">Verible</span>
            </div>

            {/* Right - Login Button */}
            {!isLoggedIn && (
              <div className="flex-shrink-0 ml-auto">
                <Button variant="secondary" size="sm" className="flex items-center space-x-1 px-3 py-1 h-8 text-sm bg-white text-[#1D2973] hover:bg-gray-100" asChild>
                  <a href="/auth?mode=login">
                    <User className="w-3 h-3" />
                    <span>Log In</span>
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
