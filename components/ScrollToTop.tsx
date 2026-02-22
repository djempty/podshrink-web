'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function scrollAllToTop() {
  // Target every possible scroll container
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const main = document.getElementById('main-content');
  if (main) main.scrollTop = 0;
}

export default function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser scroll restoration globally
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Fire immediately and repeatedly to beat Chrome mobile layout timing
    scrollAllToTop();
    
    // MutationObserver: scroll to top as soon as DOM changes (new page content renders)
    const observer = new MutationObserver(() => {
      scrollAllToTop();
    });
    const main = document.getElementById('main-content');
    if (main) {
      observer.observe(main, { childList: true, subtree: false });
    }

    // Also use rAF + timeouts as fallback
    const raf1 = requestAnimationFrame(() => {
      scrollAllToTop();
      requestAnimationFrame(scrollAllToTop);
    });
    const t1 = setTimeout(scrollAllToTop, 0);
    const t2 = setTimeout(scrollAllToTop, 50);
    const t3 = setTimeout(scrollAllToTop, 150);
    const t4 = setTimeout(scrollAllToTop, 300);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  return null;
}
