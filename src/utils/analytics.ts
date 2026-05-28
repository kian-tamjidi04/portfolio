/**
 * Lightweight wrapper around gtag() for tracking custom events.
 * Safely no-ops when GA is blocked or not yet loaded.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (eventName: string, params: Record<string, string> = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
};
