"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Chrome, Store, CheckCircle2, Copy, Search, Download, Shield, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HowItWorksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HowItWorksModal({ open, onOpenChange }: HowItWorksModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
            How Verible Works
          </DialogTitle>
          <p className="text-gray-600">
            We offer two easy ways for buyers to verify a seller
          </p>
        </DialogHeader>

        <Tabs defaultValue="option1" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="option1" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Verible Web</span>
            </TabsTrigger>
            <TabsTrigger value="option2" className="flex items-center space-x-2">
              <Chrome className="w-4 h-4" />
              <span>Chrome Extension</span>
            </TabsTrigger>
            <TabsTrigger value="sellers" className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>For Sellers</span>
            </TabsTrigger>
          </TabsList>

          {/* Option 1: Verible Web */}
          <TabsContent value="option1" className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Option 1: Verify a Seller via Verible Web
                  </h3>
                  <p className="text-gray-700 mb-4">
                    No installation needed. Just paste a link and get instant verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Open the Verible web app in your browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Visit the seller's profile page on Kijiji, Jiji, Jumia, etc.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Copy className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Copy the profile link (not the individual listing).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Paste it into the "Seller Verification Search" box.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Verible analyzes the seller in the background and instantly generates a Trust Score.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Decide with confidence whether to proceed, ask more questions, or walk away.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Option 2: Chrome Extension */}
          <TabsContent value="option2" className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Option 2: Verify a Seller with the Verible Chrome Extension
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Automatic overlay while you browse - no copying or pasting needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Download the free Verible Chrome Extension from our website.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Click "Add to Chrome" to install.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-semibold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Browse your marketplace as usual and open the seller's profile page.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Verible automatically scans the public page, extracts key signals, and runs the scoring model.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    A Trust Score overlay appears instantly - no copying, pasting, or switching tabs.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                <strong>💡 Pro Tip:</strong> The Chrome Extension provides the fastest verification experience with zero manual steps!
              </p>
            </div>
          </TabsContent>

          {/* For Sellers */}
          <TabsContent value="sellers" className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    For Sellers: How Verible Helps You
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Strengthen and showcase your credibility to build buyer trust.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Search className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Search for your own profile using your seller link.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Claim your profile (optional, via sign-up).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Complete verification steps (ID, contact, platform links).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 font-semibold text-sm">↑</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Improve your Trust Score with consistent activity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Display your "Verified by Verible" badge to increase buyer confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white mt-6">
              <div className="flex items-center space-x-3 mb-2">
                <BadgeCheck className="w-6 h-6" />
                <h4 className="text-lg font-bold">Ready to Get Started?</h4>
              </div>
              <p className="text-green-50 mb-4">
                Join Verible today and start building trust with buyers.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  onOpenChange(false)
                  window.location.href = "/seller-onboarding"
                }}
                className="bg-white text-green-600 hover:bg-green-50"
              >
                Start Seller Onboarding
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

