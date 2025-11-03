"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, FileText, RefreshCw, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileReviewFormProps {
  onBack: () => void
}

export function ProfileReviewForm({ onBack }: ProfileReviewFormProps) {
  const router = useRouter()

  const handleReturnToDashboard = () => {
    router.push("/")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden pb-20">
      {/* Content */}
      <div className="p-8 text-center">
        {/* Profile Under Review Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Under Review</h2>
          <p className="text-lg text-gray-600 mb-8">
            Your seller profile has been submitted for verification
          </p>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Submitted Successfully!
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your profile is now under review by our verification team. This typically takes 2-3
            business days.
          </p>
        </div>

        {/* What Happens Next Section */}
        <div className="mb-12 text-left max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            What Happens Next?
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Document Review</h4>
                </div>
                <p className="text-gray-600">
                  Our team will verify your submitted documents
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Platform Sync</h4>
                </div>
                <p className="text-gray-600">
                  We'll sync your existing marketplace data
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Profile Activation</h4>
                </div>
                <p className="text-gray-600">
                  Your verified profile will be live on Verible
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Profile Score */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Estimated Profile Score: 90%
            </h4>
            <p className="text-sm text-gray-600">
              Your initial Pulse Score will be based on verified information and connected
              platforms.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center">
          <Button
            type="button"
            onClick={handleReturnToDashboard}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

