"use client"

import { RecentActivity } from "@/components/recent-activity"
import { TrustAnalytics } from "@/components/trust-analytics"

export function DashboardSections() {
  return (
    <section className="w-full px-6 py-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Recent Activity */}
          <div>
            <RecentActivity />
          </div>

          {/* Right Column - Trust Analytics */}
          <div>
            <TrustAnalytics />
          </div>
        </div>
      </div>
    </section>
  )
}

