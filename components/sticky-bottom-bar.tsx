"use client"

import { Button } from "@/components/ui/button"
import { User, Play } from "lucide-react"
import Image from "next/image"

export function StickyBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1D2973] border-t border-[#1a2468] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between w-full">
          {/* Left - Verible Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/verible-logo.png"
              alt="Verible Logo"
              width={44}
              height={44}
              className="w-11 h-11"
            />
            <span className="text-sm font-medium text-white">Verible</span>
          </div>

          {/* Middle - Demo */}
          <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D59B0D] to-[#c18a0a] flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white">Demo</span>
          </div>

          {/* Right - Login Button */}
          <div className="flex-shrink-0 ml-auto">
            <Button variant="secondary" size="sm" className="flex items-center space-x-1 px-3 py-1 h-8 text-sm bg-white text-[#1D2973] hover:bg-gray-100" asChild>
              <a href="/auth?mode=login">
                <User className="w-3 h-3" />
                <span>Log In</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
