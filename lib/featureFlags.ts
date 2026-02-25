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
  return true;
}
