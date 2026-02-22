'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Reset the main scroll container — this is the actual scrolling element
    const main = document.getElementById('main-content');
    if (main) {
      main.scrollTo(0, 0);
    }
    // Also reset window/document in case anything else scrolls
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
