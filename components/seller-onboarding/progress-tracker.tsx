"use client"

import { CheckCircle2, AlertCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
  status: "completed" | "current" | "pending" | "error"
}

interface ProgressTrackerProps {
  steps: Step[]
  currentStep: number
}

export function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep || step.status === "completed"
          const isCurrent = step.id === currentStep || step.status === "current"
          const isError = step.status === "error"
          const isPending = !isCompleted && !isCurrent && !isError

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center flex-1 relative">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors z-10",
                      isCompleted && "bg-green-500 border-green-500",
                      isCurrent && !isError && "bg-green-500 border-green-500",
                      isError && "bg-orange-500 border-orange-500",
                      isPending && "bg-white border-gray-300"
                    )}
                  >
                    {isCompleted || (isCurrent && !isError) ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : isError ? (
                      <AlertCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-colors",
                        step.id < currentStep ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
                {/* Step Label */}
                <span
                  className={cn(
                    "mt-2 text-sm font-medium transition-colors whitespace-nowrap",
                    isCompleted || isCurrent
                      ? "text-green-600"
                      : isError
                      ? "text-orange-600"
                      : "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

