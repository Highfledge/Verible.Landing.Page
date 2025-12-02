"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas"
import { authAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const token = searchParams.get("token")
  const emailOrPhoneFromUrl = searchParams.get("email") || ""

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetToken: token || "",
      newPassword: "",
      confirmPassword: "",
      emailOrPhone: emailOrPhoneFromUrl,
    },
  })

  useEffect(() => {
    if (emailOrPhoneFromUrl) {
      form.setValue("emailOrPhone", emailOrPhoneFromUrl)
    }
    if (token) {
      form.setValue("resetToken", token)
    }
  }, [emailOrPhoneFromUrl, token, form])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!data.resetToken) {
      toast.error("Reset token is required")
      return
    }
    
    if (!data.emailOrPhone) {
      toast.error("Email or phone number is required")
      return
    }
    
    setIsLoading(true)
    try {
      console.log("Reset password data:", data)
      
      // Call reset password API
      const response = await authAPI.resetPassword({
        resetToken: data.resetToken,
        newPassword: data.newPassword,
        emailOrPhone: data.emailOrPhone
      })
      
      console.log("Reset password response:", response)
      
      // Use API response message if available, otherwise use default
      const successMessage = response?.message || "Password reset successfully!"
      toast.success(successMessage)
      setResetSuccess(true)
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth?mode=login")
      }, 2000)
      
    } catch (error: any) {
      console.error("Reset password error:", error)
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <Link href="/auth?mode=login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit(onSubmit)()
          }} className="space-y-6">
            {/* Reset Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reset Token
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  {...form.register("resetToken")}
                  type="text"
                  placeholder="Enter the reset token from your email"
                  className="pl-10"
                />
              </div>
              {form.formState.errors.resetToken && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.resetToken.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Check your email for the reset token
              </p>
            </div>

            {/* Email or Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  {...form.register("emailOrPhone")}
                  type="text"
                  placeholder="Enter your email or phone number"
                  className="pl-10"
                />
              </div>
              {form.formState.errors.emailOrPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.emailOrPhone.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  {...form.register("newPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  {...form.register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• One uppercase letter</li>
                <li>• One lowercase letter</li>
                <li>• One number</li>
                <li>• One special character (@$!%*?&)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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
