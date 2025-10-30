"use client"

import { useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") as "login" | "signup" || "login"

  return <AuthForm mode={mode} />
}
