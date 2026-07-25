import type { Variants } from 'framer-motion';
import { MOTION_DURATIONS, MOTION_EASING } from './motionTokens';

// Generic, reusable entrance variants — Design System §8.3 (Section
// Reveal): 12px upward translate + fade, moderate duration, out-expo
// easing. Section-specific variants (e.g. a bespoke Hero stagger) belong
// inside that section's own folder once it's built, not here.
//
// Phase 2: added a minimal scale (0.98 → 1) to fadeInUp — "minimal" per
// that brief's explicit instruction, not a bounce or dramatic zoom.
// Changed once here rather than in each section, so every section already
// using fadeInUp picks it up consistently for free.

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: MOTION_DURATIONS.moderate, ease: MOTION_EASING.outExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASING.standard },
  },
};

// Stagger cap of 60–80ms per Design System §8.3; 70ms default.
export function staggerContainer(staggerDelayS = 0.07): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelayS },
    },
  };
}

// Phase 2 addition — word-level reveal for AnimatedHeading
// (components/ui/AnimatedHeading.tsx). Word-level rather than
// letter-level: fewer DOM nodes, reads as restrained rather than
// gimmicky, matching "no flashy effects."
export const wordRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATIONS.base, ease: MOTION_EASING.outExpo },
  },
};
