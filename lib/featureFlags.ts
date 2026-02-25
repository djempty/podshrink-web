/**
 * Feature flag utilities
 */

/**
 * Check if languages feature is enabled
 * Enabled if:
 * - URL has ?languages=true
 * - OR env var NEXT_PUBLIC_FEATURE_LANGUAGES=true
 */
export function isLanguagesEnabled(): boolean {
  // Check env var
  if (process.env.NEXT_PUBLIC_FEATURE_LANGUAGES === 'true') {
    return true;
  }
  
  // Check URL query param (client-side only)
  if (typeof window !== 'undefined') {
    return window.location.search.includes('languages=true');
  }
  
  return false;
}
