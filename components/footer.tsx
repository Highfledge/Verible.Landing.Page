"use client"

import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#1D2973] to-[#1a2468] text-white pb-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/verible-logo.png"
                alt="Verible Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg"
              />
              <span className="text-2xl font-bold">Verible</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Advanced marketplace trust intelligence for safer online shopping.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="https://chromewebstore.google.com/detail/mfpkpchpddnicfddlpfdnpcodfmeoiha?utm_source=item-share-cb" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">Chrome Extension</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Trust Center</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  )
}
