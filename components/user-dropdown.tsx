"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, ChevronDown, Store, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { sellersAPI, usersAPI, authAPI } from "@/lib/api/client"

export function UserDropdown() {
  const router = useRouter()
  const { user, logout, isLoggedIn, updateUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showBecomeSeller, setShowBecomeSeller] = useState(false)
  const [platform, setPlatform] = useState("jiji")
  const [profileUrl, setProfileUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    "my-profile" | "update-profile" | "change-password" | "my-interactions" | "my-feedbacks" | "delete-account"
  >("my-profile")
  const [profileName, setProfileName] = useState("")
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [feedbacks, setFeedbacks] = useState<any[] | null>(null)
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [interactions, setInteractions] = useState<{ flagged: any[]; endorsed: any[] } | null>(null)
  const [loadingInteractions, setLoadingInteractions] = useState(false)
  const [interactionsError, setInteractionsError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push("/")
  }

  const handleProfile = () => {
    setIsOpen(false)
    router.push("/profile")
  }

  const handleSettings = () => {
    setIsOpen(false)
    setShowSettings(true)
    setActiveSettingsTab("my-profile")
    setProfileName(user?.name || "")
  }

  // Load feedbacks when the "My Feedbacks" tab becomes active
  useEffect(() => {
    const loadFeedbacks = async () => {
      setLoadingFeedbacks(true)
      setFeedbackError(null)
      try {
        const res = await usersAPI.getMyFeedback()
        // Expecting res.data.feedbackHistory or res.data depending on backend shape
        const list = res?.data?.feedbackHistory || res?.data || []
        setFeedbacks(Array.isArray(list) ? list : [])
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Failed to load feedback."
        setFeedbackError(msg)
        setFeedbacks([])
      } finally {
        setLoadingFeedbacks(false)
      }
    }

    if (showSettings && activeSettingsTab === "my-feedbacks" && feedbacks === null && !loadingFeedbacks) {
      loadFeedbacks()
    }
  }, [showSettings, activeSettingsTab])

  // Load profile helper and when My Profile tab is active
  const loadProfile = async () => {
    setLoadingProfile(true)
    setProfileError(null)
    try {
      const res = await authAPI.getMe()
      const u = res?.data?.user || res?.user || null
      setProfileData(u)
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || 'Failed to load profile.')
      setProfileData(null)
    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (showSettings && activeSettingsTab === 'my-profile' && profileData === null && !loadingProfile) {
      loadProfile()
    }
  }, [showSettings, activeSettingsTab])

  // Load interactions when the tab becomes active
  useEffect(() => {
    const loadInteractions = async () => {
      setLoadingInteractions(true)
      setInteractionsError(null)
      try {
        const res = await usersAPI.getMyInteractions()
        const flagged = res?.data?.interactions?.flagged || []
        const endorsed = res?.data?.interactions?.endorsed || []
        setInteractions({ flagged, endorsed })
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Failed to load interactions."
        setInteractionsError(msg)
        setInteractions({ flagged: [], endorsed: [] })
      } finally {
        setLoadingInteractions(false)
      }
    }

    if (showSettings && activeSettingsTab === "my-interactions" && interactions === null && !loadingInteractions) {
      loadInteractions()
    }
  }, [showSettings, activeSettingsTab])

  const handleBecomeSeller = () => {
    setIsOpen(false)
    setShowBecomeSeller(true)
  }

  const onSubmitBecomeSeller = async () => {
    if (!platform || !profileUrl.trim()) {
      toast.error("Please select a platform and enter a profile URL")
      return
    }
    setSubmitting(true)
    try {
      await sellersAPI.becomeSeller({ platform, profileUrl: profileUrl.trim() })
      toast.success("Request submitted. We'll review and update your status.")
      setShowBecomeSeller(false)
      setProfileUrl("")
      setPlatform("jiji")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoggedIn || !user) {
    return (
      <Button 
        variant="outline" 
        onClick={() => router.push("/auth?mode=login")}
        className="flex items-center space-x-2"
      >
        <User className="w-4 h-4" />
        <span>Login</span>
      </Button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-50"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {/* User Name */}
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user.name}
        </span>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'seller'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : user.role === 'seller' ? 'Seller' : 'Buyer'}
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

          {/* Menu Items */}
          <div className="py-1">
            {/* <button
              onClick={handleProfile}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>Profile</span>
            </button> */}
            
            <button
              onClick={handleSettings}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </button>

            {/* Become a Seller Button - Only show for buyers */}
            {user.role === 'user' && (
              <button
                onClick={handleBecomeSeller}
                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center space-x-3"
              >
                <Store className="w-4 h-4 text-green-500" />
                <span>Become a Seller</span>
              </button>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Become a Seller Modal */}
      {showBecomeSeller && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBecomeSeller(false)} />
          <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Become a Seller</h3>
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={() => setShowBecomeSeller(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="jiji">Jiji (LIVE)</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL</label>
                <Input
                  type="url"
                  placeholder="https://jiji.ng/shop/sodtech-computech"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBecomeSeller(false)}
              >
                Cancel
              </Button>
              <Button onClick={onSubmitBecomeSeller} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-0 overflow-hidden max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={() => setShowSettings(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex">
              {/* Left Nav */}
              <div className="w-64 border-r border-gray-100 p-5 space-y-2">
                <button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                    activeSettingsTab === "my-profile" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSettingsTab("my-profile")}
                >
                  My Profile
                </button>
                <button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                    activeSettingsTab === "update-profile" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSettingsTab("update-profile")}
                >
                  Update My Profile
                </button>
                <button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                    activeSettingsTab === "change-password" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSettingsTab("change-password")}
                >
                  Change Password
                </button>
                <button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                    activeSettingsTab === "my-interactions" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSettingsTab("my-interactions")}
                >
                  My Interactions
                </button>
                <button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                    activeSettingsTab === "my-feedbacks" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSettingsTab("my-feedbacks")}
                >
                  My Feedbacks
                </button>
                <button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                    activeSettingsTab === "delete-account" ? "bg-red-50 text-red-700 font-medium" : "text-red-600 hover:bg-red-50"
                  }`}
                  onClick={() => setActiveSettingsTab("delete-account")}
                >
                  Delete Account
                </button>
              </div>

              {/* Right Content */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[78vh]">
                {activeSettingsTab === "my-profile" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-semibold text-gray-900">My Profile</h4>
                      <Button variant="outline" size="sm" onClick={loadProfile} disabled={loadingProfile}>
                        {loadingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Refresh
                      </Button>
                    </div>
                    {loadingProfile && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading profile...
                      </div>
                    )}
                    {profileError && (
                      <p className="text-sm text-red-600">{profileError}</p>
                    )}
                    {!loadingProfile && !profileError && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{profileData?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{profileData?.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{profileData?.phone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Role</p>
                          <p className="font-medium text-gray-900 capitalize">{profileData?.role || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Verified</p>
                          <p className="font-medium text-gray-900">{profileData?.verified ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Verification Method</p>
                          <p className="font-medium text-gray-900">{profileData?.verificationMethod || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Active</p>
                          <p className="font-medium text-gray-900">{profileData?.isActive ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created At</p>
                          <p className="font-medium text-gray-900">{profileData?.createdAt ? new Date(profileData.createdAt).toLocaleString() : '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Updated At</p>
                          <p className="font-medium text-gray-900">{profileData?.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : '—'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSettingsTab === "update-profile" && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Update My Profile</h4>
                    <p className="text-sm text-gray-600 mb-4">You can update your display name below.</p>

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={async () => {
                            const trimmed = profileName.trim()
                            if (!trimmed) {
                              toast.error("Name cannot be empty")
                              return
                            }
                            setUpdatingProfile(true)
                            try {
                              await usersAPI.updateProfile({ name: trimmed })
                              toast.success("Profile updated")
                              // reflect in UI immediately
                              try { updateUser({ name: trimmed }) } catch {}
                              // refresh profile details
                              loadProfile()
                            } catch (err: any) {
                              toast.error(err?.response?.data?.message || "Failed to update profile")
                            } finally {
                              setUpdatingProfile(false)
                            }
                          }}
                          disabled={updatingProfile}
                        >
                          {updatingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setProfileName(user?.name || "")}>Reset</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "change-password" && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Change Password</h4>
                    <p className="text-sm text-gray-600">We'll implement this next.</p>
                  </div>
                )}

                {activeSettingsTab === "my-interactions" && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">My Interactions</h4>
                    {loadingInteractions && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading interactions...
                      </div>
                    )}
                    {interactionsError && (
                      <p className="text-sm text-red-600">{interactionsError}</p>
                    )}
                    {!loadingInteractions && !interactionsError && (
                      <div className="mt-4 space-y-6">
                        {/* Flagged */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-gray-900">Flagged</h5>
                            <span className="text-xs text-gray-500">{interactions?.flagged?.length || 0}</span>
                          </div>
                          {interactions && interactions.flagged.length > 0 ? (
                            <div className="space-y-3">
                              {interactions.flagged.map((item: any, idx: number) => (
                                <div key={`flag-${idx}`} className="border border-red-200 rounded-xl p-4 bg-red-50/40">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-gray-900">{item?.seller?.name || 'Seller'}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                          {item?.seller?.platform || 'unknown'}
                                        </span>
                                        {typeof item?.seller?.pulseScore === 'number' && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                            Pulse: {item.seller.pulseScore}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs mr-2 bg-red-50 text-red-700 border border-red-200">Flag</span>
                                        <span>{item?.flag?.reason || 'No details provided.'}</span>
                                        {item?.flag?.timestamp && (
                                          <span className="ml-2 text-xs text-gray-500">{new Date(item.flag.timestamp).toLocaleString()}</span>
                                        )}
                                      </div>
                                  </div>
                                  {
                                    <div className="ml-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          toast.warning('Are you sure you want to delete this flag?', {
                                            action: {
                                              label: 'Delete',
                                              onClick: async () => {
                                                const loadingId = toast.loading('Deleting flag...')
                                                try {
                                                  await sellersAPI.deleteFlag(item?.seller?.id || item?.seller?._id)
                                                  toast.success('Flag deleted')
                                                  // Optimistically remove from flagged list
                                                  setInteractions((prev) => prev ? { ...prev, flagged: prev.flagged.filter((_, i) => i !== idx) } : prev)
                                                } catch (err: any) {
                                                  toast.error(err?.response?.data?.message || 'Failed to delete flag')
                                                } finally {
                                                  toast.dismiss(loadingId)
                                                }
                                              }
                                            },
                                            cancel: { label: 'Cancel', onClick: () => {} }
                                          })
                                        }}
                                      >
                                        Delete Flag
                                      </Button>
                                    </div>
                                  }
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">No flags yet.</p>
                          )}
                        </div>

                        {/* Endorsed */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-gray-900">Endorsed</h5>
                            <span className="text-xs text-gray-500">{interactions?.endorsed?.length || 0}</span>
                          </div>
                          {interactions && interactions.endorsed.length > 0 ? (
                            <div className="space-y-3">
                              {interactions.endorsed.map((item: any, idx: number) => (
                                <div key={`endorse-${idx}`} className="border border-green-200 rounded-xl p-4 bg-green-50/40">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-gray-900">{item?.seller?.name || 'Seller'}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                          {item?.seller?.platform || 'unknown'}
                                        </span>
                                        {typeof item?.seller?.pulseScore === 'number' && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                            Pulse: {item.seller.pulseScore}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs mr-2 bg-green-50 text-green-700 border border-green-200">Endorsement</span>
                                        <span>{item?.endorsement?.reason || 'No details provided.'}</span>
                                        {item?.endorsement?.timestamp && (
                                          <span className="ml-2 text-xs text-gray-500">{new Date(item.endorsement.timestamp).toLocaleString()}</span>
                                        )}
                                      </div>
                                  </div>
                                  <div className="ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        toast.warning('Are you sure you want to delete this endorsement?', {
                                          action: {
                                            label: 'Delete',
                                            onClick: async () => {
                                              const loadingId = toast.loading('Deleting endorsement...')
                                              try {
                                                await sellersAPI.deleteEndorsement(item?.seller?.id || item?.seller?._id)
                                                toast.success('Endorsement deleted')
                                                // Optimistically remove from endorsed list
                                                setInteractions((prev) => prev ? { ...prev, endorsed: prev.endorsed.filter((_, i) => i !== idx) } : prev)
                                              } catch (err: any) {
                                                toast.error(err?.response?.data?.message || 'Failed to delete endorsement')
                                              } finally {
                                                toast.dismiss(loadingId)
                                              }
                                            }
                                          },
                                          cancel: { label: 'Cancel', onClick: () => {} }
                                        })
                                      }}
                                    >
                                      Delete Endorsement
                                    </Button>
                                  </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">No endorsements yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSettingsTab === "my-feedbacks" && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">My Feedbacks</h4>
                    {loadingFeedbacks && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading feedback...
                      </div>
                    )}
                    {feedbackError && (
                      <p className="text-sm text-red-600">{feedbackError}</p>
                    )}
                    {!loadingFeedbacks && !feedbackError && (
                      <div className="mt-4 space-y-3">
                        {feedbacks && feedbacks.length > 0 ? (
                          feedbacks.map((item: any, idx: number) => {
                            const seller = item?.seller || {}
                            const flag = item?.flag
                            const isFlag = !!flag
                            return (
                              <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-semibold text-gray-900">
                                        {seller?.name || 'Seller'}
                                      </p>
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                        {seller?.platform || 'unknown'}
                                      </span>
                                      {typeof seller?.pulseScore === 'number' && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                          Pulse: {seller.pulseScore}
                                        </span>
                                      )}
                                    </div>
                                    {isFlag && (
                                      <div className="text-sm text-gray-700">
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs mr-2 bg-red-50 text-red-700 border border-red-200">Flag</span>
                                        <span>{flag?.reason || 'No details provided.'}</span>
                                        {flag?.timestamp && (
                                          <span className="ml-2 text-xs text-gray-500">{new Date(flag.timestamp).toLocaleString()}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                    {isFlag && (
                                      <div className="ml-4">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            toast.warning('Are you sure you want to delete this flag?', {
                                              action: {
                                                label: 'Delete',
                                                onClick: async () => {
                                                  const loadingId = toast.loading('Deleting flag...')
                                                  try {
                                                    await sellersAPI.deleteFlag(seller.id || seller._id)
                                                    toast.success('Flag deleted')
                                                    setFeedbacks((prev) => (prev || []).filter((_, i) => i !== idx))
                                                  } catch (err: any) {
                                                    toast.error(err?.response?.data?.message || 'Failed to delete flag')
                                                  } finally {
                                                    toast.dismiss(loadingId)
                                                  }
                                                }
                                              },
                                              cancel: { label: 'Cancel', onClick: () => {} }
                                            })
                                          }}
                                        >
                                          Delete Flag
                                        </Button>
                                      </div>
                                    )}
                                    {!isFlag && item?.endorsement && (
                                      <div className="ml-4">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            toast.warning('Are you sure you want to delete this endorsement?', {
                                              action: {
                                                label: 'Delete',
                                                onClick: async () => {
                                                  const loadingId = toast.loading('Deleting endorsement...')
                                                  try {
                                                    await sellersAPI.deleteEndorsement(seller.id || seller._id)
                                                    toast.success('Endorsement deleted')
                                                    setFeedbacks((prev) => (prev || []).filter((_, i) => i !== idx))
                                                  } catch (err: any) {
                                                    toast.error(err?.response?.data?.message || 'Failed to delete endorsement')
                                                  } finally {
                                                    toast.dismiss(loadingId)
                                                  }
                                                }
                                              },
                                              cancel: { label: 'Cancel', onClick: () => {} }
                                            })
                                          }}
                                        >
                                          Delete Endorsement
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-sm text-gray-600">No feedback found.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeSettingsTab === "delete-account" && (
                  <div>
                    <h4 className="text-base font-semibold text-red-700 mb-3">Delete Account</h4>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-800 mb-4">
                      This action is permanent. Your account and all associated data will be deleted. This cannot be undone.
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          toast.warning('Are you sure you want to delete your account?', {
                            action: {
                              label: 'Delete',
                              onClick: async () => {
                                const loadingId = toast.loading('Deleting account...')
                                try {
                                  await authAPI.deleteAccount()
                                  toast.success('Account deleted')
                                  try { logout() } catch {}
                                  setShowSettings(false)
                                } catch (err: any) {
                                  toast.error(err?.response?.data?.message || 'Failed to delete account')
                                } finally {
                                  toast.dismiss(loadingId)
                                }
                              }
                            },
                            cancel: { label: 'Cancel', onClick: () => {} }
                          })
                        }}
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
