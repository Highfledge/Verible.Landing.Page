/**
 * Clean escaped backslashes and other escaped characters from API responses
 */
export function cleanText(text: string | null | undefined): string {
  if (!text) return ""
  if (typeof text !== "string") return String(text)
  
  // Remove escaped backslashes (\\\\ -> empty, \\ -> empty)
  let cleaned = text.replace(/\\{2,}/g, "")
  
  // Remove trailing backslashes
  cleaned = cleaned.replace(/\\+$/, "")
  
  // Trim whitespace
  cleaned = cleaned.trim()
  
  return cleaned
}

/**
 * Clean all text fields in an object recursively
 */
export function cleanObjectData(obj: any): any {
  if (obj === null || obj === undefined) return obj
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObjectData(item))
  }
  
  if (typeof obj === "object") {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        cleaned[key] = cleanText(value)
      } else {
        cleaned[key] = cleanObjectData(value)
      }
    }
    return cleaned
  }
  
  if (typeof obj === "string") {
    return cleanText(obj)
  }
  
  return obj
}

