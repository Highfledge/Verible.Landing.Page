"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { sellersAPI } from "@/lib/api/client"

type BecomeSellerModalProps = {
  open: boolean
  onClose: () => void
}

type FormState = {
  platform: string
  profileUrl: string
  isSubmitting: boolean
}

type VerificationState = {
  verificationCode: string | null
  expiresAt: string | null
  profileUrl: string | null
  instructions: string | null
  isVerifying: boolean
}

const INITIAL_STATE: FormState = {
  platform: "jiji",
  profileUrl: "",
  isSubmitting: false,
}

const INITIAL_VERIFICATION_STATE: VerificationState = {
  verificationCode: null,
  expiresAt: null,
  profileUrl: null,
  instructions: null,
  isVerifying: false,
}

export function BecomeSellerModal({ open, onClose }: BecomeSellerModalProps) {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE)
  const [verificationState, setVerificationState] = useState<VerificationState>(INITIAL_VERIFICATION_STATE)
  const [step, setStep] = useState<"form" | "verification">("form")

  useEffect(() => {
    if (!open) {
      setFormState(INITIAL_STATE)
      setVerificationState(INITIAL_VERIFICATION_STATE)
      setStep("form")
    }
  }, [open])

  if (!open) {
    return null
  }

  const { platform, profileUrl, isSubmitting } = formState
  const { verificationCode, expiresAt, instructions, isVerifying } = verificationState

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenerateCode = async () => {
    if (!platform || !profileUrl.trim()) {
      toast.error("Please select a platform and enter a profile URL")
      return
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true }))
    try {
      const response = await sellersAPI.generateVerificationCode({
        profileUrl: profileUrl.trim(),
      })

      if (response.success && response.data) {
        setVerificationState({
          verificationCode: response.data.verificationCode,
          expiresAt: response.data.expiresAt,
          profileUrl: response.data.profileUrl,
          instructions: response.data.instructions,
          isVerifying: false,
        })
        setStep("verification")
        toast.success("Verification code generated successfully")
      } else {
        throw new Error(response.message || "Failed to generate verification code")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to generate verification code. Please try again.")
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }))
    }
  }

  const handleVerifyProfile = async () => {
    if (!verificationState.profileUrl) {
      toast.error("Profile URL is missing")
      return
    }

    setVerificationState((prev) => ({ ...prev, isVerifying: true }))
    try {
      const response = await sellersAPI.verifyProfile({
        profileUrl: verificationState.profileUrl!,
      })

      if (response.success) {
        toast.success(response.message || "Profile verified successfully!")
        onClose()
        // Optionally refresh user data or redirect
      } else {
        throw new Error(response.message || "Failed to verify profile")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to verify profile. Please try again.")
    } finally {
      setVerificationState((prev) => ({ ...prev, isVerifying: false }))
    }
  }

  const handleCopyCode = () => {
    if (verificationCode) {
      navigator.clipboard.writeText(verificationCode)
      toast.success("Verification code copied to clipboard!")
    }
  }

  const handleBackToForm = () => {
    setStep("form")
    setVerificationState(INITIAL_VERIFICATION_STATE)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {step === "form" ? "Become a Seller" : "Verify Your Profile"}
          </h3>
          <button className="p-1 rounded-md hover:bg-gray-100" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === "form" ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => handleChange("platform", e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="facebook">Facebook Marketplace (LIVE)</option>
                  <option value="jiji">Jiji (LIVE)</option>
                  <option value="ebay">eBay (LIVE)</option>
                  <option value="etsy">Etsy (LIVE)</option>
                  <option value="jumia">Jumia (LIVE)</option>
                  <option value="kijiji">Kijiji (LIVE)</option>
                  <option value="konga">Konga (LIVE)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL</label>
                <Input
                  type="url"
                  placeholder="https://jiji.ng/shop/sodtech-computech"
                  value={profileUrl}
                  onChange={(e) => handleChange("profileUrl", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerateCode} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Generate Verification Code
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              {/* Verification Code Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Verification Code</label>
                  <button
                    onClick={handleCopyCode}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="bg-white border border-blue-300 rounded-md px-4 py-3 font-mono text-lg font-semibold text-gray-900 text-center">
                  {verificationCode}
                </div>
                {expiresAt && (
                  <p className="text-xs text-gray-600 mt-2">
                    Expires: {new Date(expiresAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Instructions */}
              {instructions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Instructions</h4>
                  <p className="text-sm text-gray-700">{instructions}</p>
                </div>
              )}

              {/* Profile URL Confirmation */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="url"
                    value={verificationState.profileUrl || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                  {verificationState.profileUrl && (
                    <a
                      href={verificationState.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label="Open profile in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Please confirm this is the correct profile URL before verifying.
                </p>
              </div>

              {/* Platform Display */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <p className="text-sm text-gray-900 capitalize">{platform}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <Button variant="outline" onClick={handleBackToForm}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleVerifyProfile} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
