'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function scrollAllToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const main = document.querySelector('main');
  if (main) main.scrollTop = 0;
}

export default function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser's automatic scroll restoration on client-side nav
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Immediate
    scrollAllToTop();
    // After paint
    requestAnimationFrame(() => {
      scrollAllToTop();
      requestAnimationFrame(() => {
        scrollAllToTop();
      });
    });
    // Fallback timers for Chrome mobile delayed layout
    const t1 = setTimeout(scrollAllToTop, 0);
    const t2 = setTimeout(scrollAllToTop, 50);
    const t3 = setTimeout(scrollAllToTop, 150);
    const t4 = setTimeout(scrollAllToTop, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  return null;
}
