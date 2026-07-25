import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Single source of truth for reduced-motion, read independently wherever
// it's needed (Framer variants, GSAP registration, Lenis init, Spline
// fallback). Deliberately NOT wrapped in Context — see Architecture §7.2
// for why: matchMedia listeners are cheap, and the value changes almost
// never during a session, so Context's synchronization cost isn't earned.
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
}
