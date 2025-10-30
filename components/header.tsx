"use client"

import Image from "next/image"
import Link from "next/link"
import { UserDropdown } from "@/components/user-dropdown"

export function Header() {
  return (
    <header className="w-full px-6 py-4 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image
            src="/verible-logo.png"
            alt="Verible Logo"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <span className="text-2xl font-bold text-gray-900">Verible</span>
        </Link>

        {/* User Dropdown or Login Button */}
        <UserDropdown />
      </div>
    </header>
  )
}
