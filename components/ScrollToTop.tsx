'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Use rAF to ensure DOM has updated
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Also scroll main content area
      const main = document.querySelector('main');
      if (main) main.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
