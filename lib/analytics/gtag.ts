/**
 * Google Analytics gtag Wrapper
 * Type-safe wrapper for Google Analytics gtag.js
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// GA Measurement ID (to be set via environment variable)
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Check if Google Analytics is enabled
 */
export const isGAEnabled = (): boolean => {
  return Boolean(GA_MEASUREMENT_ID) && typeof window !== "undefined";
};

/**
 * Send a page view event to Google Analytics
 * @param url - The page URL
 */
export const pageview = (url: string): void => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/**
 * Send a custom event to Google Analytics
 * @param action - Event action name
 * @param params - Additional event parameters
 */
export const event = (action: string, params?: Record<string, unknown>): void => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag("event", action, params);
};
