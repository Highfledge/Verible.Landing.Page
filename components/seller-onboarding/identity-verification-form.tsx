"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

interface IdentityVerificationFormProps {
  onBack: () => void
  onComplete: () => void
}

const identityVerificationSchema = z.object({
  consentVerification: z.boolean().refine((val) => val === true, {
    message: "You must consent to identity verification",
  }),
  consentPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy and Terms of Service",
  }),
})

type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>

export function IdentityVerificationForm({ onBack, onComplete }: IdentityVerificationFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<IdentityVerificationFormData>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues: {
      consentVerification: false,
      consentPrivacy: false,
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setSelectedFiles((prev) => [...prev, ...fileArray])
      toast.success(`${fileArray.length} file(s) selected`)
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: IdentityVerificationFormData) => {
    setIsLoading(true)
    try {
      // TODO: Upload files and submit for verification
      console.log("Files to upload:", selectedFiles)
      console.log("Consents:", data)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast.success("Identity verification submitted successfully!")
      onComplete()
    } catch (error) {
      console.error("Error submitting verification:", error)
      toast.error("Failed to submit verification. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Identity Verification</h2>
        </div>
        <p className="text-sm text-blue-100 mt-2">
          Upload documents to verify your identity and increase buyer trust
        </p>
      </div>

      {/* Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          {/* Upload Section */}
          <div className="mb-8">
            <label htmlFor="file-upload">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Verification Documents
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Accepted: Business license, Tax ID, Government ID, Bank statements
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="mt-4"
                >
                  Select Files
                </Button>
              </div>
            </label>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileIcon />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4 mb-8">
            <FormField
              control={form.control}
              name="consentVerification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I consent to identity verification and understand that Verible will securely
                      process my documents
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consentPrivacy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms-of-service"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedFiles.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              {isLoading ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// Simple file icon component
function FileIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

