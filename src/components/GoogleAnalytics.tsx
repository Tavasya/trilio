import { useEffect } from 'react';
import { useLocation } from 'react-router';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Only run if gtag is available
    if (typeof window.gtag === 'function') {
      // Send pageview with full URL including search params (UTM parameters)
      window.gtag('config', 'G-VDC4GK8ECJ', {
        page_path: location.pathname + location.search + location.hash,
      });
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}