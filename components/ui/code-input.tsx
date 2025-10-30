"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CodeInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function CodeInput({ length = 6, value, onChange, className, disabled }: CodeInputProps) {
  const [codes, setCodes] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Sync value prop with internal state
  useEffect(() => {
    if (value) {
      const valueArray = value.split("").slice(0, length)
      const filledArray = [...Array(length)].map((_, i) => valueArray[i] || "")
      setCodes(filledArray)
    } else {
      setCodes(Array(length).fill(""))
    }
  }, [value, length])

  const handleChange = (index: number, char: string) => {
    if (char.length > 1) return // Only allow single character

    const newCodes = [...codes]
    newCodes[index] = char.slice(-1) // Take only the last character
    setCodes(newCodes)
    
    const codeString = newCodes.join("")
    onChange(codeString)

    // Auto-focus next input
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      // If current input is empty, focus previous input
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    const newCodes = pastedData.split("").slice(0, length)
    
    // Fill codes array
    const filledCodes = [...codes]
    newCodes.forEach((char, index) => {
      if (index < length) {
        filledCodes[index] = char
      }
    })
    
    setCodes(filledCodes)
    onChange(filledCodes.join(""))
    
    // Focus the last filled input or the last input
    const lastFilledIndex = Math.min(newCodes.length - 1, length - 1)
    inputRefs.current[lastFilledIndex]?.focus()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={codes[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-2xl font-semibold",
            "border-2 border-gray-300 rounded-lg",
            "focus:border-blue-600 focus:ring-2 focus:ring-blue-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      ))}
    </div>
  )
}
