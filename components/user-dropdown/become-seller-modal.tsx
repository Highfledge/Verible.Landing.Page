"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2 } from "lucide-react"
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

const INITIAL_STATE: FormState = {
  platform: "jiji",
  profileUrl: "",
  isSubmitting: false,
}

export function BecomeSellerModal({ open, onClose }: BecomeSellerModalProps) {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE)

  useEffect(() => {
    if (!open) {
      setFormState(INITIAL_STATE)
    }
  }, [open])

  if (!open) {
    return null
  }

  const { platform, profileUrl, isSubmitting } = formState

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!platform || !profileUrl.trim()) {
      toast.error("Please select a platform and enter a profile URL")
      return
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true }))
    try {
      await sellersAPI.becomeSeller({ platform, profileUrl: profileUrl.trim() })
      toast.success("Request submitted. We'll review and update your status.")
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit. Please try again.")
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }))
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Become a Seller</h3>
          <button className="p-1 rounded-md hover:bg-gray-100" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => handleChange("platform", e.target.value)}
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
              onChange={(e) => handleChange("profileUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

