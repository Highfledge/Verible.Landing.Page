"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, ChevronDown, Store } from "lucide-react"
import { BecomeSellerModal } from "@/components/user-dropdown/become-seller-modal"
import { UserSettingsModal } from "@/components/user-dropdown/settings-modal"

export function UserDropdown() {
  const router = useRouter()
  const { user, logout, isLoggedIn, updateUser, viewMode, toggleViewMode } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [uiState, setUIState] = useState({
    isDropdownOpen: false,
    showBecomeSeller: false,
    showSettings: false,
  })

  const { isDropdownOpen, showBecomeSeller, showSettings } = uiState

  // Memoized handler for closing dropdown
  const closeDropdown = useCallback(() => {
    setUIState((prev) => ({ ...prev, isDropdownOpen: false }))
  }, [])

  // Memoized handler for toggling dropdown
  const toggleDropdown = useCallback(() => {
    setUIState((prev) => ({ ...prev, isDropdownOpen: !prev.isDropdownOpen }))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDropdownOpen) {
        closeDropdown()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isDropdownOpen, closeDropdown])

  const handleLogout = useCallback(() => {
    logout()
    setUIState({ isDropdownOpen: false, showBecomeSeller: false, showSettings: false })
    router.push("/")
  }, [logout, router])

  const handleSettings = useCallback(() => {
    setUIState((prev) => ({ ...prev, isDropdownOpen: false, showSettings: true }))
  }, [])

  const handleBecomeSeller = useCallback(() => {
    setUIState((prev) => ({ ...prev, isDropdownOpen: false, showBecomeSeller: true }))
  }, [])

  const handleToggleView = useCallback(() => {
    toggleViewMode()
    closeDropdown()
  }, [toggleViewMode, closeDropdown])

  if (!isLoggedIn || !user) {
    return (
      <Button variant="outline" onClick={() => router.push("/auth?mode=login")} className="flex items-center space-x-2">
        <User className="w-4 h-4" />
        <span>Login</span>
      </Button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={toggleDropdown}
        className="flex items-center space-x-2 hover:bg-gray-50"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label={`User menu for ${user.name}`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </Button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "seller"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : user.role === "seller" ? "Seller" : "Buyer"}
                  </span>
                  {user.isVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={handleSettings}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span>Settings</span>
            </button>

            {user.role === "user" && (
              <button
                onClick={handleBecomeSeller}
                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center space-x-3"
                role="menuitem"
              >
                <Store className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span>Become a Seller</span>
              </button>
            )}

            {user.role === "seller" && (
              <button
                onClick={handleToggleView}
                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-3"
                role="menuitem"
              >
                <Store className="w-4 h-4 text-blue-500" aria-hidden="true" />
                <span>{viewMode === 'seller' ? 'View as a Buyer' : 'View as a Seller'}</span>
              </button>
            )}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 text-red-500" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <BecomeSellerModal
        open={showBecomeSeller}
        onClose={() => setUIState((prev) => ({ ...prev, showBecomeSeller: false }))}
      />

      <UserSettingsModal
        open={showSettings}
        onClose={() => setUIState((prev) => ({ ...prev, showSettings: false }))}
        user={user}
        updateUser={updateUser}
        logout={logout}
      />
    </div>
  )
}

