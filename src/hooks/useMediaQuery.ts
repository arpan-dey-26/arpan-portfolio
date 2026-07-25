import { useEffect, useState } from 'react';
import { breakpoints } from '@/constants/breakpoints';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Convenience wrapper for the three named breakpoints (Architecture §6.1).
// Only used where a behavior — not just an appearance — genuinely needs to
// change in JS; everything else should be a Tailwind `tablet:`/`laptop:`/
// `desktop:` class instead.
export function useBreakpoint() {
  const isTablet = useMediaQuery(`(min-width: ${breakpoints.tablet}px)`);
  const isLaptop = useMediaQuery(`(min-width: ${breakpoints.laptop}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`);
  return { isTablet, isLaptop, isDesktop };
}
