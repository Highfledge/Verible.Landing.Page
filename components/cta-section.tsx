"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Map } from "lucide-react"
import { useAuth } from "@/lib/stores/auth-store"

export function CTASection() {
  const { isLoggedIn, user } = useAuth()
  
  // Only show for buyers or guests (not for sellers)
  if (isLoggedIn && user?.role === "seller") {
    return null
  }

  return (
    <section className="w-full px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Starting with Facebook Marketplace
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're launching our MVP focused on Facebook Marketplace seller verification. 
            Get instant trust scores and verification badges to make safer purchasing decisions. 
            More marketplaces coming soon.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" className="flex items-center space-x-2 hover:shadow-lg transition-all duration-300" asChild>
              <a href="/buyer-tools">
                <span>Try It Now</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            
            <Button variant="outline" size="xl" className="flex items-center space-x-2 hover:shadow-lg transition-all duration-300 border-2">
              <Map className="w-5 h-5" />
              <span>View Roadmap</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
