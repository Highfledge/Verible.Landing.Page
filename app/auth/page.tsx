"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

function AuthPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") as "login" | "signup" || "login"

  return <AuthForm mode={mode} />
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
}
