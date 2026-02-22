'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function scrollAllToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const main = document.querySelector('main');
  if (main) main.scrollTop = 0;
  // Also try any scrollable parent divs
  const scrollable = document.querySelector('[class*="overflow"]');
  if (scrollable) scrollable.scrollTop = 0;
}

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Immediate
    scrollAllToTop();
    // After paint
    requestAnimationFrame(() => {
      scrollAllToTop();
      // After next paint (covers Chrome mobile delayed layout)
      requestAnimationFrame(() => {
        scrollAllToTop();
      });
    });
    // Fallback for slow renders
    const t1 = setTimeout(scrollAllToTop, 50);
    const t2 = setTimeout(scrollAllToTop, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
