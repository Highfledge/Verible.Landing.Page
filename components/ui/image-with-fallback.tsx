"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackClassName?: string
  showFallbackLetter?: boolean
  fallbackLetter?: string
}

export function ImageWithFallback({
  src,
  alt,
  width = 80,
  height = 80,
  className,
  fallbackClassName,
  showFallbackLetter = true,
  fallbackLetter
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(src || null)
  const [hasError, setHasError] = useState(false)

  // Check if src is a .gif or empty/invalid
  const isGif = imgSrc?.toLowerCase().endsWith(".gif") || imgSrc?.toLowerCase().includes(".gif")
  const isValidSrc = imgSrc && imgSrc.trim() !== "" && !isGif

  // Set error state for gif files
  useEffect(() => {
    if (isGif) {
      setHasError(true)
    } else if (src !== imgSrc) {
      setImgSrc(src || null)
      setHasError(false)
    }
  }, [src, isGif, imgSrc])

  const shouldShowFallback = hasError || !isValidSrc

  // Get first letter for fallback
  const letter = fallbackLetter || (alt ? alt.charAt(0).toUpperCase() : "?")
  
  // Generate a consistent background color based on the letter
  const getBackgroundColor = (char: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-indigo-500"
    ]
    const index = char.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (shouldShowFallback && showFallbackLetter) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold",
          getBackgroundColor(letter),
          fallbackClassName || className
        )}
        style={{ width, height }}
      >
        {letter}
      </div>
    )
  }

  if (!isValidSrc) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold",
          getBackgroundColor(letter),
          fallbackClassName || className
        )}
        style={{ width, height }}
      >
        {letter}
      </div>
    )
  }

  return (
    <Image
      src={imgSrc || "/default-avatar.png"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        setHasError(true)
        setImgSrc(null)
      }}
    />
  )
}

