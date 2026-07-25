// Mirrors the exact pixel boundaries from the approved Design System (§12)
// and Architecture (§6.1) — the single source of truth used by BOTH
// tailwind.config.ts (CSS, hardcoded there since Tailwind's theme must be
// statically analyzable) and useMediaQuery/useBreakpoint (JS, reads this
// file directly). If these ever need to change, tailwind.config.ts's
// `screens` block must be updated to match by hand.
export const breakpoints = {
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
} as const;
