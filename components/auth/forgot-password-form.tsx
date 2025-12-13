"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas"
import { authAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailOrPhone: "",
      method: "email",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      console.log("Forgot password data:", data)
      
      // Call forgot password API
      const response = await authAPI.forgotPassword({
        emailOrPhone: data.emailOrPhone,
        method: data.method
      })
      
      console.log("Forgot password response:", response)
      
      toast.success("Password reset instructions sent to your email!")
      
      // Redirect to reset-password page with emailOrPhone
      router.push(`/reset-password?email=${encodeURIComponent(data.emailOrPhone)}`)
      
    } catch (error: any) {
      console.error("Forgot password error:", error)
      const errorMessage = error.response?.data?.message || "Failed to send reset instructions. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            Enter your email or phone number and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit(onSubmit)()
          }} className="space-y-6">
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

            {/* Verification Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send via:
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    {...form.register("method")}
                    type="radio"
                    value="email"
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...form.register("method")}
                    type="radio"
                    value="sms"
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">SMS</span>
                </label>
              </div>
              {form.formState.errors.method && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.method.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
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
