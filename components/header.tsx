"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserDropdown } from "@/components/user-dropdown"
import { useAuth } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

export function Header() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image
            src="/verible-logo.png"
            alt="Verible Logo"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <span className="text-2xl font-bold text-gray-900">Verible</span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Navigation links (only when not logged in) */}
          {!isLoggedIn && (
            <>
              <Link 
                href="#how-it-works" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                How it works
              </Link>
              <Link 
                href="/buyer-tools" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Buyers
              </Link>
              <Link 
                href="/seller-onboarding" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sellers
              </Link>
            </>
          )}
          
          {/* Access Dashboard (only when logged in)
          {isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/analytics")}
              className="flex items-center gap-2 text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Access dashboard</span>
            </Button>
          )} */}

          {/* Sign-up for free (only when not logged in) */}
          {!isLoggedIn && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/auth?mode=signup")}
              className="text-sm"
            >
              Sign-up for free
            </Button>
          )}

          {/* User Dropdown (only when logged in) */}
          {isLoggedIn && <UserDropdown />}
        </nav>

        {/* Mobile: Show only User Dropdown or Login */}
        <div className="md:hidden">
          {isLoggedIn ? <UserDropdown /> : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/auth?mode=login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
