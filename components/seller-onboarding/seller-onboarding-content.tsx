"use client"

import { useState } from "react"
import { ProgressTracker } from "./progress-tracker"
import { BasicInformationForm } from "./basic-information-form"
import { PlatformProfilesForm } from "./platform-profiles-form"
import { IdentityVerificationForm } from "./identity-verification-form"
import { ProfileReviewForm } from "./profile-review-form"

export function SellerOnboardingContent() {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const getStepStatus = (stepId: number): "completed" | "current" | "pending" | "error" => {
    if (stepId < currentStep) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  const steps = [
    { id: 1, label: "Basic Information", status: getStepStatus(1) },
    { id: 2, label: "Platform Profiles", status: getStepStatus(2) },
    { id: 3, label: "Identity Verification", status: getStepStatus(3) },
    { id: 4, label: "Profile Review", status: getStepStatus(4) },
  ]

  const handleStepComplete = (stepId: number) => {
    if (stepId === 1) {
      setCurrentStep(2)
    } else if (stepId === 2) {
      setCurrentStep(3)
    } else if (stepId === 3) {
      setCurrentStep(4)
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
            <BasicInformationForm onComplete={() => handleStepComplete(1)} />
          )}
          {currentStep === 2 && (
            <PlatformProfilesForm
              onBack={handleStepBack}
              onComplete={() => handleStepComplete(2)}
            />
          )}
          {currentStep === 3 && (
            <IdentityVerificationForm
              onBack={handleStepBack}
              onComplete={() => handleStepComplete(3)}
            />
          )}
          {currentStep === 4 && (
            <ProfileReviewForm onBack={handleStepBack} />
          )}
        </div>
      </div>
    </div>
  )
}

