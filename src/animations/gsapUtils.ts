import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Thin helper for future in-section GSAP usage. Per Architecture §16, GSAP
// owns scrubbed, scroll-position-precise timelines only — not simple
// viewport reveals (that's Framer's job, via the variants above). This
// helper exists so individual sections don't each hand-roll their own
// ScrollTrigger boilerplate.
export function createScrollTimeline(
  trigger: string | Element,
  vars: ScrollTrigger.Vars = {}
): gsap.core.Timeline {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      ...vars,
    },
  });
}

/**
 * Phase 3's one genuine GSAP use case in this build: continuous
 * scroll-scrubbed image parallax. This is exactly the category
 * Architecture §16.1's decision rule reserves for GSAP ("exactly where is
 * the user in the scroll timeline, scrubbed") rather than Framer, which
 * owns discrete viewport-enter/exit reveals everywhere else in this
 * codebase. `scrub: true` ties the tween directly to scroll position —
 * no duration, no easing curve, it just tracks scroll — which is the
 * behavior Framer's whileInView isn't built for.
 *
 * Returns the ScrollTrigger instance so the caller can `.kill()` it on
 * unmount/reduced-motion.
 */
export function createImageParallax(target: Element, amountPx = 40): ScrollTrigger {
  const tween = gsap.fromTo(target, { yPercent: -amountPx / 4 }, { yPercent: amountPx / 4, ease: 'none' });
  return ScrollTrigger.create({
    trigger: target,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    animation: tween,
  });
}
