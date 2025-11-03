"use client"

import { Suspense } from "react"
import { Header } from "@/components/header"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"
import { SellerOnboardingContent } from "@/components/seller-onboarding/seller-onboarding-content"

export default function SellerOnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <SellerOnboardingContent />
      </Suspense>
      <StickyBottomBar />
    </div>
  )
}

