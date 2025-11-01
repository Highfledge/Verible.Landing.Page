"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmailSchema, type VerifyEmailFormData } from "@/lib/schemas"
import { authAPI } from "@/lib/api/client"
import { useAuth } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { CodeInput } from "@/components/ui/code-input"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const emailOrPhone = searchParams.get("email") || searchParams.get("phone") || ""
  const verificationCodeFromUrl = searchParams.get("code") || ""

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: verificationCodeFromUrl,
      emailOrPhone: emailOrPhone,
    },
  })

  useEffect(() => {
    if (emailOrPhone) {
      form.setValue("emailOrPhone", emailOrPhone)
    }
    if (verificationCodeFromUrl) {
      form.setValue("code", verificationCodeFromUrl)
    }
  }, [emailOrPhone, verificationCodeFromUrl, form])

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true)
    try {
      console.log("Verification data:", data)
      
      // Call verify API
      const response = await authAPI.verify({
        code: data.code,
        emailOrPhone: data.emailOrPhone
      })
      
        // Update user verification status and token if provided
        if (response.data.token) {
          // If we have a new token, update the auth store
          if (response.data.user) {
            login(response.data.token, response.data.user)
          } else {
            // Just update the user's verification status
            updateUser({ isVerified: true })
          }
        } else {
          // Just update verification status
          updateUser({ isVerified: true })
        }
        
        toast.success("Email verified successfully!")
        setVerificationSuccess(true)
      
      // Redirect to landing page after a short delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: any) {
      console.error("Verification error:", error)
      const errorMessage = error.response?.data?.message || "Invalid verification code. Please try again."
      toast.error(errorMessage)
      form.resetField("code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (code: string) => {
    form.setValue("code", code)
    // Auto-submit when all 6 digits are entered
    if (code.length === 6) {
      form.handleSubmit(onSubmit)()
    }
  }

  if (verificationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your account has been successfully verified.</p>
            <p className="text-sm text-gray-500">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/verible-logo.png"
              alt="Verible Logo"
              width={48}
              height={48}
              className="w-12 h-12 mr-3"
            />
            <span className="text-3xl font-bold text-gray-900">Verible</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-gray-900">
              {emailOrPhone || "your email"}
            </span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/Phone Display (hidden input) */}
            <input type="hidden" {...form.register("emailOrPhone")} />

            {/* Display verification code if provided from signup */}
            {verificationCodeFromUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 text-center mb-2">
                  Your verification code:
                </p>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 tracking-wider">
                    {verificationCodeFromUrl}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  You can enter this code manually below
                </p>
              </div>
            )}

            {/* 6-Digit Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Verification Code
              </label>
              <CodeInput
                value={form.watch("code")}
                onChange={handleCodeChange}
                disabled={isLoading}
                length={6}
                className="mb-4"
              />
              {form.formState.errors.code && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {form.formState.errors.code.message}
                </p>
              )}
              <p className="text-sm text-gray-500 text-center mt-4">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  onClick={async () => {
                    try {
                      await authAPI.resendVerification({
                        emailOrPhone: emailOrPhone,
                        method: "email"
                      })
                      toast.success("Verification code sent!")
                    } catch (error: any) {
                      const errorMessage = error.response?.data?.message || "Failed to resend code. Please try again."
                      toast.error(errorMessage)
                    }
                  }}
                >
                  Resend
                </button>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || form.watch("code").length !== 6}
              className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          {/* Contact Support Link */}
          <div className="text-center mt-6">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Having trouble? Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
