// Motion tokens — single source of truth for durations/easings used by
// Framer Motion and GSAP alike. Mirrors Design System §8.1.
//
// Framer Motion expects seconds; GSAP core (without the CustomEase plugin,
// which isn't part of the locked stack) doesn't accept arbitrary
// cubic-bezier arrays — for GSAP timelines, use its built-in eases instead
// ("power3.out" approximates outExpo, "power1.inOut" approximates inOut).
// For raw CSS transitions, use the cubic-bezier() strings in
// src/styles/tokens.css.

export const MOTION_DURATIONS = {
  instant: 0.1,
  fast: 0.16,
  base: 0.25,
  moderate: 0.4,
  slow: 0.6,
} as const;

export const MOTION_EASING = {
  standard: [0.4, 0, 0.2, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;
