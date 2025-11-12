"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { sellersAPI, usersAPI, authAPI } from "@/lib/api/client"

type SettingsTab =
  | "my-profile"
  | "update-profile"
  | "change-password"
  | "my-interactions"
  | "my-analytics"
  | "my-feedbacks"
  | "delete-account"

type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

type UserSettingsModalProps = {
  open: boolean
  onClose: () => void
  user: any
  updateUser: (data: Record<string, any>) => void
  logout: () => void
}

const INITIAL_SELLER_FORM = {
  profileName: "",
  location: "",
  bio: "",
}

const INITIAL_ASYNC_STATE = { data: null, loading: false, error: null } as const

export function UserSettingsModal({ open, onClose, user, updateUser, logout }: UserSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("my-profile")
  const [buyerName, setBuyerName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [sellerForm, setSellerForm] = useState(INITIAL_SELLER_FORM)
  const [feedbackState, setFeedbackState] = useState<AsyncState<any[]>>({
    ...INITIAL_ASYNC_STATE,
  })
  const [interactionsState, setInteractionsState] = useState<AsyncState<{ flagged: any[]; endorsed: any[] }>>({
    ...INITIAL_ASYNC_STATE,
  })
  const [analyticsState, setAnalyticsState] = useState<AsyncState<any>>({
    ...INITIAL_ASYNC_STATE,
  })
  const [profileState, setProfileState] = useState<AsyncState<any>>({
    ...INITIAL_ASYNC_STATE,
  })

  const { profileName: sellerProfileName, location: sellerLocation, bio: sellerBio } = sellerForm
  const { data: feedbacks, loading: loadingFeedbacks, error: feedbackError } = feedbackState
  const { data: interactions, loading: loadingInteractions, error: interactionsError } = interactionsState
  const { data: analytics, loading: loadingAnalytics, error: analyticsError } = analyticsState
  const { data: profileData, loading: loadingProfile, error: profileError } = profileState

  const resetState = useCallback(() => {
    setActiveTab("my-profile")
    setBuyerName("")
    setIsUpdating(false)
    setSellerForm(INITIAL_SELLER_FORM)
    setFeedbackState({ ...INITIAL_ASYNC_STATE })
    setInteractionsState({ ...INITIAL_ASYNC_STATE })
    setAnalyticsState({ ...INITIAL_ASYNC_STATE })
    setProfileState({ ...INITIAL_ASYNC_STATE })
  }, [])

  useEffect(() => {
    if (open) {
      setActiveTab("my-profile")
      setBuyerName(user?.name || "")
    } else {
      resetState()
    }
  }, [open, user?.name, resetState])

  const handleClose = () => {
    onClose()
  }

  // Data loading functions - memoized to prevent unnecessary re-renders
  const loadProfile = useCallback(async () => {
    setProfileState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await authAPI.getMe()
      const response = res?.data?.user || res?.user || null
      setProfileState({ data: response, loading: false, error: null })
    } catch (err: any) {
      setProfileState({
        data: null,
        loading: false,
        error: err?.response?.data?.message || "Failed to load profile.",
      })
    }
  }, [])

  const loadFeedbacks = useCallback(async () => {
    setFeedbackState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      if (user?.role === "seller") {
        try {
          const sellerProfileRes = await sellersAPI.getMySellerProfile()
          const sellerId = sellerProfileRes?.data?._id || sellerProfileRes?.data?.seller?._id || sellerProfileRes?._id

          if (!sellerId) {
            throw new Error("Seller profile not found. Please claim your seller profile first.")
          }

          const res = await sellersAPI.getSellerFeedback(sellerId)
          const flags = res?.data?.flags || []
          const endorsements = res?.data?.endorsements || []

          const combined = [
            ...flags.map((flag: any) => ({ ...flag, _type: "flag" })),
            ...endorsements.map((endorsement: any) => ({ ...endorsement, _type: "endorsement" })),
          ]

          setFeedbackState({ data: combined, loading: false, error: null })
          return
        } catch (sellerErr: any) {
          const sellerMsg =
            sellerErr?.response?.data?.message ||
            sellerErr?.message ||
            "Failed to load seller profile. Please make sure you have claimed your seller profile."
          setFeedbackState({ data: [], loading: false, error: sellerMsg })
          return
        }
      }

      const res = await usersAPI.getMyFeedback()
      const list = res?.data?.feedbackHistory || res?.data || []
      setFeedbackState({
        data: Array.isArray(list) ? list : [],
        loading: false,
        error: null,
      })
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load feedback."
      setFeedbackState({ data: [], loading: false, error: msg })
    }
  }, [user?.role])

  const loadInteractions = useCallback(async () => {
    setInteractionsState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await usersAPI.getMyInteractions()
      const flagged = res?.data?.interactions?.flagged || []
      const endorsed = res?.data?.interactions?.endorsed || []
      setInteractionsState({
        data: { flagged, endorsed },
        loading: false,
        error: null,
      })
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load interactions."
      setInteractionsState({
        data: { flagged: [], endorsed: [] },
        loading: false,
        error: msg,
      })
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    setAnalyticsState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const sellerId = "68fb8d9ad8299bdd94be605d"
      const res = await sellersAPI.getSellerAnalytics(sellerId)
      setAnalyticsState({
        data: res?.data || res,
        loading: false,
        error: null,
      })
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load analytics."
      setAnalyticsState({
        data: null,
        loading: false,
        error: msg,
      })
    }
  }, [])

  // Consolidated effect for tab-based data loading
  useEffect(() => {
    if (!open) return

    switch (activeTab) {
      case "my-profile":
        if (profileData === null && !loadingProfile) {
          loadProfile()
        }
        break

      case "update-profile":
        // Pre-fill seller form if needed
        if (user?.role === "seller" && profileData && !sellerProfileName && !sellerLocation && !sellerBio) {
          setSellerForm({
            profileName: profileData.name || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
          })
        }
        break

      case "my-feedbacks":
        if (feedbacks === null && !loadingFeedbacks) {
          loadFeedbacks()
        }
        break

      case "my-interactions":
        if (user?.role !== "seller" && interactions === null && !loadingInteractions) {
          loadInteractions()
        }
        break

      case "my-analytics":
        if (user?.role === "seller" && analytics === null && !loadingAnalytics) {
          loadAnalytics()
        }
        break

      default:
        break
    }
  }, [
    open,
    activeTab,
    user?.role,
    profileData,
    loadingProfile,
    sellerProfileName,
    sellerLocation,
    sellerBio,
    feedbacks,
    loadingFeedbacks,
    interactions,
    loadingInteractions,
    analytics,
    loadingAnalytics,
    loadProfile,
    loadFeedbacks,
    loadInteractions,
    loadAnalytics,
  ])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-0 overflow-hidden max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
          <button className="p-1 rounded-md hover:bg-gray-100" onClick={handleClose} aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          <div className="w-64 border-r border-gray-100 p-5 space-y-2">
            <button
              className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                activeTab === "my-profile" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("my-profile")}
            >
              My Profile
            </button>
            <button
              className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                activeTab === "update-profile" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("update-profile")}
            >
              Update My Profile
            </button>
            <button
              className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                activeTab === "change-password" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("change-password")}
            >
              Change Password
            </button>
            {user?.role === "seller" ? (
              <button
                className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                  activeTab === "my-analytics" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("my-analytics")}
              >
                My Analytics
              </button>
            ) : (
              <button
                className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                  activeTab === "my-interactions" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("my-interactions")}
              >
                My Interactions
              </button>
            )}
            <button
              className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                activeTab === "my-feedbacks" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("my-feedbacks")}
            >
              My Feedbacks
            </button>
            <button
              className={`w-full text-left px-3 py-3 rounded-md text-sm ${
                activeTab === "delete-account" ? "bg-red-50 text-red-700 font-medium" : "text-red-600 hover:bg-red-50"
              }`}
              onClick={() => setActiveTab("delete-account")}
            >
              Delete Account
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[78vh]">
            {activeTab === "my-profile" && (
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
                {profileError && <p className="text-sm text-red-600">{profileError}</p>}
                {!loadingProfile && !profileError && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{profileData?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{profileData?.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{profileData?.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Role</p>
                      <p className="font-medium text-gray-900 capitalize">{profileData?.role || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Verified</p>
                      <p className="font-medium text-gray-900">{profileData?.verified ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Verification Method</p>
                      <p className="font-medium text-gray-900">{profileData?.verificationMethod || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Active</p>
                      <p className="font-medium text-gray-900">{profileData?.isActive ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created At</p>
                      <p className="font-medium text-gray-900">
                        {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleString() : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Updated At</p>
                      <p className="font-medium text-gray-900">
                        {profileData?.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : "—"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "update-profile" && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Update My Profile</h4>

                {user?.role === "seller" ? (
                  <div className="space-y-4 max-w-2xl">
                    <p className="text-sm text-gray-600 mb-4">Update your seller profile information below.</p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={sellerProfileName}
                        onChange={(e) =>
                          setSellerForm((prev) => ({ ...prev, profileName: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        type="text"
                        placeholder="e.g., Lagos, Nigeria"
                        value={sellerLocation}
                        onChange={(e) =>
                          setSellerForm((prev) => ({ ...prev, location: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <Textarea
                        placeholder="Tell buyers about yourself and your business..."
                        value={sellerBio}
                        onChange={(e) =>
                          setSellerForm((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={async () => {
                          const trimmedName = sellerProfileName.trim()
                          if (!trimmedName) {
                            toast.error("Name cannot be empty")
                            return
                          }
                          setIsUpdating(true)
                          try {
                            await sellersAPI.updateSellerProfile({
                              profileData: {
                                name: trimmedName,
                                location: sellerLocation.trim() || undefined,
                                bio: sellerBio.trim() || undefined,
                              },
                            })
                            toast.success("Profile updated successfully")
                            await loadProfile()
                          } catch (err: any) {
                            toast.error(err?.response?.data?.message || "Failed to update profile")
                          } finally {
                            setIsUpdating(false)
                          }
                        }}
                        disabled={isUpdating}
                      >
                        {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSellerForm(INITIAL_SELLER_FORM)}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <p className="text-sm text-gray-600 mb-4">You can update your display name below.</p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={async () => {
                          const trimmed = buyerName.trim()
                          if (!trimmed) {
                            toast.error("Name cannot be empty")
                            return
                          }
                          setIsUpdating(true)
                          try {
                            await usersAPI.updateProfile({ name: trimmed })
                            toast.success("Profile updated")
                            try {
                              updateUser({ name: trimmed })
                            } catch {}
                            await loadProfile()
                          } catch (err: any) {
                            toast.error(err?.response?.data?.message || "Failed to update profile")
                          } finally {
                            setIsUpdating(false)
                          }
                        }}
                        disabled={isUpdating}
                      >
                        {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setBuyerName(user?.name || "")}>
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "change-password" && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Change Password</h4>
                <p className="text-sm text-gray-600">We'll implement this next.</p>
              </div>
            )}

            {activeTab === "my-interactions" && user?.role !== "seller" && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">My Interactions</h4>
                {loadingInteractions && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading interactions...
                  </div>
                )}
                {interactionsError && <p className="text-sm text-red-600">{interactionsError}</p>}
                {!loadingInteractions && !interactionsError && (
                  <div className="mt-4 space-y-6">
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
                                    <p className="text-sm font-semibold text-gray-900">{item?.seller?.name || "Seller"}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                      {item?.seller?.platform || "unknown"}
                                    </span>
                                    {typeof item?.seller?.pulseScore === "number" && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                        Pulse: {item.seller.pulseScore}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs mr-2 bg-red-50 text-red-700 border border-red-200">
                                      Flag
                                    </span>
                                    <span>{item?.flag?.reason || "No details provided."}</span>
                                    {item?.flag?.timestamp && (
                                      <span className="ml-2 text-xs text-gray-500">
                                        {new Date(item.flag.timestamp).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      toast.warning("Are you sure you want to delete this flag?", {
                                        action: {
                                          label: "Delete",
                                          onClick: async () => {
                                            const loadingId = toast.loading("Deleting flag...")
                                            try {
                                              await sellersAPI.deleteFlag(item?.seller?.id || item?.seller?._id)
                                              toast.success("Flag deleted")
                                              setInteractionsState((prev) => {
                                                const current = prev.data
                                                if (!current) return prev
                                                return {
                                                  ...prev,
                                                  data: {
                                                    ...current,
                                                    flagged: current.flagged.filter((_, i) => i !== idx),
                                                  },
                                                }
                                              })
                                            } catch (err: any) {
                                              toast.error(err?.response?.data?.message || "Failed to delete flag")
                                            } finally {
                                              toast.dismiss(loadingId)
                                            }
                                          },
                                        },
                                        cancel: { label: "Cancel", onClick: () => {} },
                                      })
                                    }}
                                  >
                                    Delete Flag
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No flags yet.</p>
                      )}
                    </div>

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
                                    <p className="text-sm font-semibold text-gray-900">{item?.seller?.name || "Seller"}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                      {item?.seller?.platform || "unknown"}
                                    </span>
                                    {typeof item?.seller?.pulseScore === "number" && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                        Pulse: {item.seller.pulseScore}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs mr-2 bg-green-50 text-green-700 border border-green-200">
                                      Endorsement
                                    </span>
                                    <span>{item?.endorsement?.reason || "No details provided."}</span>
                                    {item?.endorsement?.timestamp && (
                                      <span className="ml-2 text-xs text-gray-500">
                                        {new Date(item.endorsement.timestamp).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      toast.warning("Are you sure you want to delete this endorsement?", {
                                        action: {
                                          label: "Delete",
                                          onClick: async () => {
                                            const loadingId = toast.loading("Deleting endorsement...")
                                            try {
                                              await sellersAPI.deleteEndorsement(item?.seller?.id || item?.seller?._id)
                                              toast.success("Endorsement deleted")
                                              setInteractionsState((prev) => {
                                                const current = prev.data
                                                if (!current) return prev
                                                return {
                                                  ...prev,
                                                  data: {
                                                    ...current,
                                                    endorsed: current.endorsed.filter((_, i) => i !== idx),
                                                  },
                                                }
                                              })
                                            } catch (err: any) {
                                              toast.error(err?.response?.data?.message || "Failed to delete endorsement")
                                            } finally {
                                              toast.dismiss(loadingId)
                                            }
                                          },
                                        },
                                        cancel: { label: "Cancel", onClick: () => {} },
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

            {activeTab === "my-analytics" && user?.role === "seller" && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-4">My Analytics</h4>
                {loadingAnalytics && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading analytics...
                  </div>
                )}
                {analyticsError && <p className="text-sm text-red-600">{analyticsError}</p>}
                {!loadingAnalytics && !analyticsError && analytics && (
                  <div className="mt-4 space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-gray-900">Pulse Score</h5>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            analytics.seller?.confidenceLevel === "high"
                              ? "bg-green-100 text-green-700"
                              : analytics.seller?.confidenceLevel === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {analytics.seller?.confidenceLevel?.toUpperCase() || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          <svg className="transform -rotate-90 w-48 h-48">
                            <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-200" />
                            <circle
                              cx="96"
                              cy="96"
                              r="84"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 84}`}
                              strokeDashoffset={`${2 * Math.PI * 84 * (1 - (analytics.seller?.pulseScore || 0) / 100)}`}
                              strokeLinecap="round"
                              className={`${
                                (analytics.seller?.pulseScore || 0) >= 80
                                  ? "text-green-500"
                                  : (analytics.seller?.pulseScore || 0) >= 60
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-5xl font-bold text-gray-900">{analytics.seller?.pulseScore || 0}</div>
                              <div className="text-sm text-gray-600 mt-1">out of 100</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-sm font-medium text-gray-600">Trust Level</h6>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              analytics.trustLevel === "High"
                                ? "bg-green-100 text-green-700"
                                : analytics.trustLevel === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {analytics.trustLevel || "N/A"}
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{analytics.trustLevel || "N/A"}</div>
                      </div>

                      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-sm font-medium text-gray-600">Verification Status</h6>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              analytics.seller?.verificationStatus === "verified"
                                ? "bg-green-100 text-green-700"
                                : analytics.seller?.verificationStatus === "id-verified"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {analytics.seller?.verificationStatus === "verified"
                              ? "Verified"
                              : analytics.seller?.verificationStatus === "id-verified"
                              ? "ID Verified"
                              : "Unverified"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          {analytics.seller?.lastScored && <p>Last Scored: {new Date(analytics.seller.lastScored).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Feedback Summary</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="text-3xl font-bold text-red-600">{analytics.feedback?.totalFlags || 0}</div>
                          <div className="text-sm text-gray-600 mt-1">Total Flags</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                          <div className="text-3xl font-bold text-green-600">{analytics.feedback?.totalEndorsements || 0}</div>
                          <div className="text-sm text-gray-600 mt-1">Endorsements</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div
                            className={`text-3xl font-bold ${
                              (analytics.feedback?.netFeedbackScore || 0) >= 0 ? "text-blue-600" : "text-red-600"
                            }`}
                          >
                            {analytics.feedback?.netFeedbackScore >= 0 ? "+" : ""}
                            {analytics.feedback?.netFeedbackScore || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Net Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Listings Overview</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{analytics.listings?.total || 0}</div>
                          <div className="text-xs text-gray-600 mt-1">Total Listings</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{analytics.listings?.active || 0}</div>
                          <div className="text-xs text-gray-600 mt-1">Active</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">{analytics.listings?.inactive || 0}</div>
                          <div className="text-xs text-gray-600 mt-1">Inactive</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {(analytics.listings?.averagePrice || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Avg Price</div>
                        </div>
                      </div>

                      {(analytics.listings?.total || 0) > 0 && (
                        <div className="mt-4">
                          <div className="flex items-end gap-4 h-32">
                            <div className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-gray-300 rounded-t transition-all duration-500" style={{ height: "100%" }} />
                              <div className="mt-2 text-xs text-gray-600">Total</div>
                              <div className="text-sm font-semibold text-gray-900">{analytics.listings?.total || 0}</div>
                            </div>

                            <div className="flex-1 flex flex-col items-center">
                              <div
                                className="w-full bg-green-500 rounded-t transition-all duration-500"
                                style={{
                                  height: `${((analytics.listings?.active || 0) / (analytics.listings?.total || 1)) * 100}%`,
                                }}
                              />
                              <div className="mt-2 text-xs text-gray-600">Active</div>
                              <div className="text-sm font-semibold text-green-600">{analytics.listings?.active || 0}</div>
                            </div>

                            <div className="flex-1 flex flex-col items-center">
                              <div
                                className="w-full bg-gray-400 rounded-t transition-all duration-500"
                                style={{
                                  height: `${((analytics.listings?.inactive || 0) / (analytics.listings?.total || 1)) * 100}%`,
                                }}
                              />
                              <div className="mt-2 text-xs text-gray-600">Inactive</div>
                              <div className="text-sm font-semibold text-gray-600">{analytics.listings?.inactive || 0}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!loadingAnalytics && !analyticsError && !analytics && (
                  <p className="text-sm text-gray-600 mt-4">No analytics data available.</p>
                )}
              </div>
            )}

            {activeTab === "my-feedbacks" && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">My Feedbacks</h4>
                {loadingFeedbacks && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading feedback...
                  </div>
                )}
                {feedbackError && <p className="text-sm text-red-600">{feedbackError}</p>}
                {!loadingFeedbacks && !feedbackError && (
                  <div className="mt-4 space-y-3">
                    {feedbacks && feedbacks.length > 0 ? (
                      feedbacks.map((item: any, idx: number) => {
                        const isSellerFormat = item?._type || item?.userId

                        if (isSellerFormat) {
                          const isFlag = item._type === "flag"
                          const isEndorsement = item._type === "endorsement"
                          const feedbackUser = item?.userId || {}
                          const reason = item?.reason || "No details provided."
                          const timestamp = item?.timestamp
                          const isVerified = item?.isVerified
                          const adminReview = item?.adminReview

                          return (
                            <div
                              key={idx}
                              className={`border rounded-xl p-4 ${
                                isFlag ? "border-red-200 bg-red-50/40" : isEndorsement ? "border-green-200 bg-green-50/40" : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${
                                        isFlag
                                          ? "bg-red-50 text-red-700 border border-red-200"
                                          : isEndorsement
                                          ? "bg-green-50 text-green-700 border border-green-200"
                                          : "bg-gray-50 text-gray-700 border border-gray-200"
                                      }`}
                                    >
                                      {isFlag ? "Flag" : isEndorsement ? "Endorsement" : "Feedback"}
                                    </span>
                                    {isVerified ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-700 border border-gray-200">
                                        Pending Review
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-sm text-gray-700 mb-2">
                                    <p className="font-medium mb-1">From: {feedbackUser?.name || "Anonymous"}</p>
                                    {feedbackUser?.email && <p className="text-xs text-gray-500">{feedbackUser.email}</p>}
                                  </div>

                                  <div className="text-sm text-gray-700">
                                    <p className="mb-1">
                                      <strong>Reason:</strong> {reason}
                                    </p>
                                    {timestamp && (
                                      <p className="text-xs text-gray-500">Submitted: {new Date(timestamp).toLocaleString()}</p>
                                    )}
                                  </div>

                                  {adminReview && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                                      <p className="text-xs font-semibold text-gray-700 mb-1">Admin Review:</p>
                                      <p className="text-xs text-gray-600">Action: {adminReview.action}</p>
                                      {adminReview.adminNotes && (
                                        <p className="text-xs text-gray-600 mt-1">Notes: {adminReview.adminNotes}</p>
                                      )}
                                      {adminReview.reviewedAt && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Reviewed: {new Date(adminReview.reviewedAt).toLocaleString()}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }

                        const seller = item?.seller || {}
                        const flag = item?.flag
                        const isFlag = !!flag

                        return (
                          <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold text-gray-900">{seller?.name || "Seller"}</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                    {seller?.platform || "unknown"}
                                  </span>
                                  {typeof seller?.pulseScore === "number" && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                      Pulse: {seller.pulseScore}
                                    </span>
                                  )}
                                </div>
                                {isFlag && (
                                  <div className="text-sm text-gray-700">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs mr-2 bg-red-50 text-red-700 border border-red-200">Flag</span>
                                    <span>{flag?.reason || "No details provided."}</span>
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
                                      toast.warning("Are you sure you want to delete this flag?", {
                                        action: {
                                          label: "Delete",
                                          onClick: async () => {
                                            const loadingId = toast.loading("Deleting flag...")
                                            try {
                                              await sellersAPI.deleteFlag(seller.id || seller._id)
                                              toast.success("Flag deleted")
                                              setFeedbackState((prev) => ({
                                                ...prev,
                                                data: (prev.data || []).filter((_, i) => i !== idx),
                                              }))
                                            } catch (err: any) {
                                              toast.error(err?.response?.data?.message || "Failed to delete flag")
                                            } finally {
                                              toast.dismiss(loadingId)
                                            }
                                          },
                                        },
                                        cancel: { label: "Cancel", onClick: () => {} },
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
                                      toast.warning("Are you sure you want to delete this endorsement?", {
                                        action: {
                                          label: "Delete",
                                          onClick: async () => {
                                            const loadingId = toast.loading("Deleting endorsement...")
                                            try {
                                              await sellersAPI.deleteEndorsement(seller.id || seller._id)
                                              toast.success("Endorsement deleted")
                                              setFeedbackState((prev) => ({
                                                ...prev,
                                                data: (prev.data || []).filter((_, i) => i !== idx),
                                              }))
                                            } catch (err: any) {
                                              toast.error(err?.response?.data?.message || "Failed to delete endorsement")
                                            } finally {
                                              toast.dismiss(loadingId)
                                            }
                                          },
                                        },
                                        cancel: { label: "Cancel", onClick: () => {} },
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

            {activeTab === "delete-account" && (
              <div>
                <h4 className="text-base font-semibold text-red-700 mb-3">Delete Account</h4>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-800 mb-4">
                  This action is permanent. Your account and all associated data will be deleted. This cannot be undone.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      toast.warning("Are you sure you want to delete your account?", {
                        action: {
                          label: "Delete",
                          onClick: async () => {
                            const loadingId = toast.loading("Deleting account...")
                            try {
                              await authAPI.deleteAccount()
                              toast.success("Account deleted")
                              try {
                                logout()
                              } catch {}
                              handleClose()
                            } catch (err: any) {
                              toast.error(err?.response?.data?.message || "Failed to delete account")
                            } finally {
                              toast.dismiss(loadingId)
                            }
                          },
                        },
                        cancel: { label: "Cancel", onClick: () => {} },
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
  )
}

