"use client"

import { useState } from "react"
import { ProgressTracker } from "./progress-tracker"
import { BasicInformationForm } from "./basic-information-form"
import { PlatformProfilesForm } from "./platform-profiles-form"
import { ProfileReviewForm } from "./profile-review-form"
import type { BusinessInformationFormData } from "@/lib/schemas"

export function SellerOnboardingContent() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [basicInfoData, setBasicInfoData] = useState<BusinessInformationFormData | null>(null)

  const getStepStatus = (stepId: number): "completed" | "current" | "pending" | "error" => {
    if (stepId < currentStep) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  const steps = [
    { id: 1, label: "Basic Information", status: getStepStatus(1) },
    { id: 2, label: "Platform Profiles", status: getStepStatus(2) },
    { id: 3, label: "Profile Review", status: getStepStatus(3) },
  ]

  const handleStepComplete = (stepId: number, data?: BusinessInformationFormData) => {
    if (stepId === 1 && data) {
      setBasicInfoData(data)
      setCurrentStep(2)
    } else if (stepId === 2) {
      setCurrentStep(3)
    }
  }

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex-1 w-full">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Tracker */}
        <ProgressTracker steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <BasicInformationForm onComplete={(data) => handleStepComplete(1, data)} />
          )}
          {currentStep === 2 && basicInfoData && (
            <PlatformProfilesForm
              basicInfoData={basicInfoData}
              onBack={handleStepBack}
              onComplete={() => handleStepComplete(2)}
            />
          )}
          {currentStep === 3 && (
            <ProfileReviewForm onBack={handleStepBack} />
          )}
        </div>
      </div>
    </div>
  )
}
