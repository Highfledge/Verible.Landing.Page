"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { detectPlatformFromUrl } from "@/lib/utils/platform-detection"
import { sellersAPI } from "@/lib/api/client"
import { useAuth } from "@/lib/stores/auth-store"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { BusinessInformationFormData } from "@/lib/schemas"
import Image from "next/image"
import { cn } from "@/lib/utils"

const platformProfilesSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  verificationMethod: z.enum(["email", "sms"], {
    message: "Please select a verification method"
  }),
})

type PlatformProfilesFormData = z.infer<typeof platformProfilesSchema>

interface PlatformProfilesFormProps {
  basicInfoData: BusinessInformationFormData
  onBack: () => void
  onComplete: () => void
}

const platformNames: Record<string, string> = {
  jiji: "Jiji",
  ebay: "eBay",
  etsy: "Etsy",
  jumia: "Jumia",
  kijiji: "Kijiji",
  konga: "Konga",
  facebook: "Facebook Marketplace",
  amazon: "Amazon",
  aliexpress: "AliExpress",
  instagram: "Instagram Shopping",
  tiktok: "TikTok Shops",
  shopify: "Shopify",
}

const platformImages: Record<string, string> = {
  jiji: "/jiji.png",
  ebay: "/ebay.png",
  etsy: "/etsy.png",
  jumia: "/jumia.png",
  kijiji: "/kijiji.png",
  konga: "/konga.jpg",
}

export function PlatformProfilesForm({ basicInfoData, onBack, onComplete }: PlatformProfilesFormProps) {
  const { isLoggedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null)

  const form = useForm<PlatformProfilesFormData>({
    resolver: zodResolver(platformProfilesSchema),
    defaultValues: {
      password: "",
      verificationMethod: "email",
    },
  })

  useEffect(() => {
    // Auto-detect platform from profile URL
    if (basicInfoData.profileUrl) {
      const platform = detectPlatformFromUrl(basicInfoData.profileUrl)
      setDetectedPlatform(platform)
    }
  }, [basicInfoData.profileUrl])

  const onSubmit = async (data: PlatformProfilesFormData) => {
    if (!detectedPlatform) {
      toast.error("Could not detect platform from profile URL. Please check your URL and try again.")
      return
    }

    setIsLoading(true)
    try {
      // Prepare API payload
      const payload = {
        businessName: basicInfoData.businessName,
        email: basicInfoData.contactEmail,
        phone: basicInfoData.phoneNumber,
        password: data.password,
        profileUrl: basicInfoData.profileUrl,
        businessType: basicInfoData.businessType,
        businessDescription: basicInfoData.businessDescription,
        platform: detectedPlatform,
        verificationMethod: data.verificationMethod,
      }

      console.log("Onboard payload:", payload)

      const response = await sellersAPI.onboard(payload)

      console.log("Onboard response:", response)

      if (response.success) {
        toast.success(response.message || "Seller account created successfully!")
        
        // If user was created, log them in
        if (response.data?.token && response.data?.user) {
          const { useAuthStore } = await import("@/lib/stores/auth-store")
          // Transform API user to match User interface
          const userData = {
            ...response.data.user,
            id: response.data.user._id || response.data.user.id,
            isVerified: response.data.user.verified || response.data.user.isVerified || false,
          }
          useAuthStore.getState().login(response.data.token, userData)
        }

        // Go to next step
        onComplete()
      } else {
        toast.error(response.message || "Failed to create seller account. Please try again.")
      }
    } catch (error: any) {
      console.error("Onboard error:", error)
      const errorMessage = error.response?.data?.message || "Failed to create seller account. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Platform Profile</h2>
        </div>
        <p className="text-sm text-green-100 mt-2">
          Review your platform information and complete your account setup
        </p>
      </div>

      {/* Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          {/* Detected Platform Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Detected Platform
            </label>
            {detectedPlatform ? (
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    {/* Platform Logo */}
                    {platformImages[detectedPlatform] ? (
                      <div className="relative w-16 h-16 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center flex-shrink-0">
                        <Image
                          src={platformImages[detectedPlatform]}
                          alt={platformNames[detectedPlatform] || detectedPlatform}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Globe className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Platform Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {platformNames[detectedPlatform] || detectedPlatform}
                        </h3>
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Platform automatically detected from your profile URL
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  To change the platform, go back and update your profile URL.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 mb-1">
                      Platform Not Detected
                    </p>
                    <p className="text-sm text-amber-700">
                      Could not detect platform from your profile URL. Please go back and check your profile URL.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile URL Display (Read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile URL
            </label>
            <Input
              type="text"
              value={basicInfoData.profileUrl}
              disabled
              className="w-full bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-12"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• One uppercase letter</li>
                <li>• One lowercase letter</li>
                <li>• One number</li>
                <li>• One special character (@$!%*?&)</li>
              </ul>
            </div>
          </div>

          {/* Verification Method */}
          <div className="mb-6">
            <FormField
              control={form.control}
              name="verificationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Verification Method <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="email"
                          checked={field.value === "email"}
                          onChange={() => field.onChange("email")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="sms"
                          checked={field.value === "sms"}
                          onChange={() => field.onChange("sms")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">SMS</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pb-20">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !detectedPlatform}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
