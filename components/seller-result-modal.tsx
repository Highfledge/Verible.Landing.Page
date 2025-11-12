"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SellerProfileDisplay } from "@/components/seller-profile-display"
import { useAuth } from "@/lib/stores/auth-store"

interface SellerResultModalProps {
  data: any
  isOpen: boolean
  onClose: () => void
}

export function SellerResultModal({ data, isOpen, onClose }: SellerResultModalProps) {
  const { isLoggedIn } = useAuth()
  
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1D2973] to-[#1a2468] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Seller Profile Details</h2>
              <p className="text-sm text-purple-200">Complete seller analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <SellerProfileDisplay data={data} isLoggedIn={isLoggedIn} />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

