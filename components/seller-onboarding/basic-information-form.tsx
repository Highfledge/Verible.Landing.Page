"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { businessInformationSchema, type BusinessInformationFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/lib/stores/auth-store"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface BasicInformationFormProps {
  onComplete: (data: BusinessInformationFormData) => void
}

const businessTypes = [
  "Individual Seller",
  "small business",
  "corporation",
  "non-profit",
]

export function BasicInformationForm({ onComplete }: BasicInformationFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BusinessInformationFormData>({
    resolver: zodResolver(businessInformationSchema),
    defaultValues: {
      businessName: "",
      contactEmail: user?.email || "",
      phoneNumber: "",
      profileUrl: "",
      businessDescription: "",
      businessType: "Individual Seller",
    },
  })

  const onSubmit = async (data: BusinessInformationFormData) => {
    setIsLoading(true)
    try {
      // No API call at this step - just validate and pass data to next step
      console.log("Business Information:", data)
      onComplete(data)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Please check your form and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Business Information</h2>
        </div>
        <p className="text-sm text-blue-100 mt-2">
          Tell us about your business to start building your trust profile
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Business/Store Name */}
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business/Store Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your business or store name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Email */}
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile URL */}
              <FormField
                control={form.control}
                name="profileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Profile URL <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.jiji.com/marketplace/profile/..."
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your marketplace seller profile URL
                    </p>
                  </FormItem>
                )}
              />

            </div>

            {/* Right Column */}
            <div>
              {/* Business Type */}
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Business Description - Full Width */}
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, products, or services..."
                        rows={4}
                        {...field}
                        className="w-full resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end pb-20">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
            >
              {isLoading ? "Saving..." : "Continue to Platform Profiles"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

