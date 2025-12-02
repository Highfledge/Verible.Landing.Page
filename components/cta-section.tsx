"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Map } from "lucide-react"
import { useAuth } from "@/lib/stores/auth-store"

export function CTASection() {
  const { isLoggedIn } = useAuth()
  
  // Only show when user is not logged in
  if (isLoggedIn) {
    return null
  }

  return (
    <section className="w-full px-6 pb-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Designed for Every Online Marketplace
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're rolling out support for popular marketplaces in phases. Get instant trust scores and seller insights as new platforms become available.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" className="flex items-center space-x-2 hover:shadow-lg transition-all duration-300" asChild>
              <a href="/buyer-tools">
                <span>Start verifying sellers</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            
            {/* <Button variant="outline" size="xl" className="flex items-center space-x-2 hover:shadow-lg transition-all duration-300 border-2">
              <Map className="w-5 h-5" />
              <span>View Roadmap</span>
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  )
}
