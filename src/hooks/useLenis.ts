import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';
import { scrollVelocity } from '@/lib/scrollVelocity';

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_OFFSET = -80; // keeps a scrolled-to section from tucking in under the sticky navbar

// Owns Lenis's full lifecycle plus the GSAP ScrollTrigger sync (Architecture
// §16): Lenis's raf loop drives ScrollTrigger.update so scroll-triggered
// reveals stay accurate against Lenis-smoothed scroll rather than raw
// native scroll. Called once, at the App root.
//
// Per Architecture §16.2 / Design System §8.9: under reduced motion, Lenis
// is not initialized at all — the browser's native scroll takes over.
export function useLenis() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Explicit rather than relying on Lenis's own default: native touch
      // scrolling is kept on touch devices (only desktop wheel input gets
      // smoothed physics) — forcing smooth-scroll physics onto touch
      // gestures typically feels laggier than the platform's own native
      // momentum scroll, not better. Written out here so it's a stated
      // decision, not an unread default.
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', (e: { velocity: number }) => {
      ScrollTrigger.update();
      // Lenis's own velocity, not hand-computed from position deltas —
      // it's already there on every scroll event. Feeds the Starfield's
      // scroll-reactive speed (components/layout/Starfield.tsx).
      //
      // No dependency on a Lenis "scroll ended" event here — I couldn't
      // confirm the exact event name Lenis uses for that in this
      // environment, and guessing wrong would mean the store never
      // resets, silently. Instead this only ever writes a timestamp
      // alongside the value; Starfield treats the value as stale (and
      // eases toward idle itself) once enough time has passed since the
      // last write, which doesn't depend on Lenis emitting anything
      // beyond the regular 'scroll' event this hook already needed.
      scrollVelocity.current = e.velocity;
      scrollVelocity.lastUpdate = performance.now();
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    gsap.ticker.lagSmoothing(0);

    // Real gap this closes: a plain `<a href="#section">` triggers the
    // browser's native, instant jump — Lenis only owns wheel/touch scroll
    // by default, not anchor-link navigation. Every in-page link already
    // in this codebase (Navbar, MobileMenu, Journey's linkTo, Footer's
    // back-to-top, Hero's "View Work") is a plain hash href, so handling
    // this once here, via delegation, covers all of them without touching
    // any of those files individually.
    function handleAnchorClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') {
        event.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: NAVBAR_OFFSET });
    }
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}
