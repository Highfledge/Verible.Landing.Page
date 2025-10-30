"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "@/lib/schemas"
import { authAPI } from "@/lib/api/client"
import { useAuth } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { login, setLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState(mode)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "buyer",
      phone: "",
      verificationMethod: "email",
      termsAccepted: false,
    },
  })
  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    console.log("onSubmit called with mode:", mode, "data:", data)
    setIsLoading(true)
    
    try {
        if (mode === "login") {
          const loginData = data as LoginFormData
          console.log("Attempting login for:", loginData.email)
          
          const response = await authAPI.login({
            emailOrPhone: loginData.email,
            password: loginData.password
          })
          
          console.log("Login response:", response)
          
          // Store token and user data in Zustand store
          if (response.data.token && response.data.user) {
            login(response.data.token, response.data.user)
            toast.success("Login successful!")
            router.push("/")
          } else {
            toast.error("Login failed. Please try again.")
          }
        
        } else {
          const signupData = data as SignupFormData
          console.log("Attempting signup for:", signupData.email)
          
          // Call register API
          const response = await authAPI.register({
            name: `${signupData.firstName} ${signupData.lastName}`,
            email: signupData.email,
            password: signupData.password,
            role: signupData.role === "buyer" ? "user" : signupData.role,
            phone: signupData.phone,
            verificationMethod: signupData.verificationMethod
          })
          
          console.log("Signup response:", response)
          
          // Store token and user data if provided
          if (response.data.token && response.data.user) {
            login(response.data.token, response.data.user)
          }
          
          toast.success("Account created successfully! Please verify your email.")
          
          // Redirect to verification page with email/phone
          const emailOrPhone = signupData.email || signupData.phone
          router.push(`/verify?email=${encodeURIComponent(emailOrPhone)}`)
        }
    } catch (error: any) {
      console.error("Auth error:", error)
      
      // Handle unverified account (401 status) - only for login mode
      if (mode === "login" && error.response?.status === 401 && error.response?.data?.message === "Please verify your account") {
        toast.error("Please verify your account first")
        
        // Get email from login data
        const loginData = data as LoginFormData
        const email = loginData.email
        
        // Resend verification code
        try {
          await authAPI.resendVerification({
            emailOrPhone: email,
            method: "email"
          })
          toast.success("Verification code sent! Please check your email.")
          
          // Redirect to verification page
          router.push(`/verify?email=${encodeURIComponent(email)}`)
        } catch (resendError: any) {
          console.error("Resend error:", resendError)
          toast.error("Failed to resend verification code. Please try again.")
        }
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again."
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verible Trust Layer</h1>
          <p className="text-gray-600">Your gateway to safe online commerce</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Tabs */}
          <Tabs defaultValue={mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" asChild>
                <Link href="/auth?mode=login">Sign In</Link>
              </TabsTrigger>
              <TabsTrigger value="signup" asChild>
                <Link href="/auth?mode=signup">Sign Up</Link>
              </TabsTrigger>
            </TabsList>

            

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={(e) => {
                e.preventDefault()
                loginForm.handleSubmit(onSubmit)()
              }} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me / Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      {...loginForm.register("rememberMe")}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <form onSubmit={(e) => {
                e.preventDefault()
                signupForm.handleSubmit(onSubmit)()
              }} className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...signupForm.register("firstName")}
                        type="text"
                        placeholder="First name"
                        className="pl-10"
                      />
                    </div>
                    {signupForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...signupForm.register("lastName")}
                        type="text"
                        placeholder="Last name"
                        className="pl-10"
                      />
                    </div>
                    {signupForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...signupForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...signupForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...signupForm.register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
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
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I am a:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        {...signupForm.register("role")}
                        type="radio"
                        value="buyer"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Buyer (looking for trusted sellers)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...signupForm.register("role")}
                        type="radio"
                        value="seller"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Seller (want to build trust)</span>
                    </label>
                  </div>
                  {signupForm.formState.errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...signupForm.register("phone")}
                      type="tel"
                      placeholder="+2347061938347"
                      className="pl-10"
                    />
                  </div>
                  {signupForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Verification Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Verification Method:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        {...signupForm.register("verificationMethod")}
                        type="radio"
                        value="email"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...signupForm.register("verificationMethod")}
                        type="radio"
                        value="sms"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">SMS</span>
                    </label>
                  </div>
                  {signupForm.formState.errors.verificationMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.verificationMethod.message}
                    </p>
                  )}
                </div>

                {/* Terms and Privacy */}
                <div>
                  <label className="flex items-start">
                    <input
                      {...signupForm.register("termsAccepted")}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {signupForm.formState.errors.termsAccepted && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.termsAccepted.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  {isLoading ? "Loading..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

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
