import { useEffect } from 'react';
import { useLocation } from 'react-router';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Debug logging
    console.log('React GA Component - Current URL:', location.pathname + location.search);
    console.log('React GA Component - Search params:', location.search);

    // Only run if gtag is available
    if (typeof window.gtag === 'function') {
      // Send pageview with full URL including search params (UTM parameters)
      console.log('React GA Component - Sending to GA:', {
        page_path: location.pathname + location.search + location.hash,
      });

      window.gtag('config', 'G-VDC4GK8ECJ', {
        page_path: location.pathname + location.search + location.hash,
      });
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}