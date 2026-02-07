"use client"

import { useEffect, useState } from "react"

export function PWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })
        setRegistration(reg)
        console.log("[PWA] Service Worker registered with scope:", reg.scope)

        // Check for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New content is available, show update prompt
              setUpdateAvailable(true)
              console.log("[PWA] New content available, update ready")
            }
          })
        })

        // Check for updates periodically (every 60 minutes)
        setInterval(() => {
          reg.update()
        }, 60 * 60 * 1000)
      } catch (error) {
        console.error("[PWA] Service Worker registration failed:", error)
      }
    }

    // Register after page load for better performance
    if (document.readyState === "complete") {
      registerSW()
    } else {
      window.addEventListener("load", registerSW)
      return () => window.removeEventListener("load", registerSW)
    }
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
    }
    setUpdateAvailable(false)
    window.location.reload()
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#1D2973] text-white rounded-xl shadow-2xl border border-white/10 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#D59B0D] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">Update Available</h4>
            <p className="text-xs text-blue-200 mt-1">
              A new version of Verible is ready. Refresh to get the latest features.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setUpdateAvailable(false)}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-[#D59B0D] hover:bg-[#e8ac20] text-[#1D2973] transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  )
}
