/**
 * Clean escaped backslashes and other escaped characters from API responses
 * Also removes markdown image syntax and HTML tags
 */
export function cleanText(text: string | null | undefined): string {
  if (!text) return ""
  if (typeof text !== "string") return String(text)
  
  // Remove markdown image syntax like ![alt](url)
  let cleaned = text.replace(/!\[.*?\]\(.*?\)/g, "")
  
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, "")
  
  // Remove markdown links
  cleaned = cleaned.replace(/\[.*?\]\(.*?\)/g, "")
  
  // Remove escaped backslashes (\\\\ -> empty, \\ -> empty)
  cleaned = cleaned.replace(/\\{2,}/g, "")
  
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

/**
 * Checks if a text is meaningful (not gibberish/markdown/image syntax)
 */
export function isMeaningfulText(text: string | null | undefined): boolean {
  if (!text) return false
  
  const cleaned = cleanText(text)
  
  // If after cleaning it's empty, it's not meaningful
  if (!cleaned) return false
  
  // Check if it's just markdown/image syntax (starts with ! or contains only URLs/images)
  if (/^!\[.*?\]\(.*?\)$/.test(text.trim())) return false
  
  // Check if it's mostly URLs or image references
  const urlPattern = /https?:\/\/[^\s]+/g
  const urlMatches = text.match(urlPattern) || []
  if (urlMatches.length > 0 && cleaned.length < 20) return false
  
  // Check if it contains meaningful words (at least 2 characters, not just symbols)
  const words = cleaned.split(/\s+/).filter(w => w.length >= 2)
  if (words.length === 0) return false
  
  // If it's very short and contains mostly special chars, it's likely gibberish
  if (cleaned.length < 3) return false
  
  return true
}

/**
 * Gets initials from a name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "N/A"
  
  const cleaned = cleanText(name)
  if (!cleaned) return "N/A"
  
  // Split by spaces and get first letters
  const words = cleaned.split(/\s+/).filter(w => w.length > 0)
  if (words.length === 0) return "N/A"
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  // Get first letter of first and last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

