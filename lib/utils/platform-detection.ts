/**
 * Platform detection utility
 * Detects the marketplace platform from a profile URL
 */

export function detectPlatformFromUrl(url: string): string | null {
  if (!url) return null

  const lowerUrl = url.toLowerCase()

  // Jiji
  if (lowerUrl.includes('jiji.ng') || lowerUrl.includes('jiji.com')) {
    return 'jiji'
  }

  // eBay
  if (lowerUrl.includes('ebay.com') || lowerUrl.includes('ebay.co.uk')) {
    return 'ebay'
  }

  // Etsy
  if (lowerUrl.includes('etsy.com')) {
    return 'etsy'
  }

  // Jumia
  if (lowerUrl.includes('jumia.com') || lowerUrl.includes('jumia.ng')) {
    return 'jumia'
  }

  // Kijiji
  if (lowerUrl.includes('kijiji.ca') || lowerUrl.includes('kijiji.com')) {
    return 'kijiji'
  }

  // Konga
  if (lowerUrl.includes('konga.com') || lowerUrl.includes('konga.ng')) {
    return 'konga'
  }

  // Facebook Marketplace
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return 'facebook'
  }

  // Amazon
  if (lowerUrl.includes('amazon.com') || lowerUrl.includes('amazon.co.uk')) {
    return 'amazon'
  }

  // AliExpress
  if (lowerUrl.includes('aliexpress.com')) {
    return 'aliexpress'
  }

  // Instagram
  if (lowerUrl.includes('instagram.com')) {
    return 'instagram'
  }

  // TikTok
  if (lowerUrl.includes('tiktok.com')) {
    return 'tiktok'
  }

  // Shopify
  if (lowerUrl.includes('shopify.com')) {
    return 'shopify'
  }

  return null
}

