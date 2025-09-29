// UTM tracking utility functions

export interface UTMData {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  signup_url?: string;
  referrer?: string;
}

/**
 * Extract UTM parameters from the current URL
 */
export function extractUTMParams(): UTMData {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
    signup_url: window.location.href,
    referrer: document.referrer || undefined
  };
}

/**
 * Store UTM data in sessionStorage
 */
export function storeUTMData(data: UTMData): void {
  sessionStorage.setItem('utm_data', JSON.stringify(data));
}

/**
 * Retrieve stored UTM data from sessionStorage
 */
export function getStoredUTMData(): UTMData | null {
  const stored = sessionStorage.getItem('utm_data');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if current URL has UTM parameters
 */
export function hasUTMParams(): boolean {
  const search = window.location.search;
  return search.includes('utm_');
}

/**
 * Capture and store UTM params if they exist in the URL
 */
export function captureUTMParams(): void {
  if (hasUTMParams()) {
    const utmData = extractUTMParams();
    storeUTMData(utmData);
  }
}