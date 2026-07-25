import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

/**
 * Code-based stand-in for the Hero's signature 3D moment (Design System
 * §9.1's "personal brand mark or continuous-ribbon form"). Used whenever
 * the live Spline scene isn't shown: no scene authored/configured yet,
 * reduced motion, or below the mobile cutoff (Architecture §14.6 / §15.8 /
 * §15.9) — one fallback asset for all three reasons, per §14.6 ("one image
 * to produce and maintain, not three").
 *
 * This is also standing in for the missing `public/spline-fallback.webp`
 * (no network access in this environment to source a real exported
 * poster — see README). Unlike a raster placeholder, an SVG shape has no
 * missing-asset risk and needs no image-optimization pipeline. Swap this
 * out once a real Spline scene exists — it's an intentional placeholder,
 * not a permanent design decision.
 */
export function HeroFallbackVisual() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 320 320"
        className={cn('h-3/4 w-3/4', !prefersReducedMotion && 'animate-[spin_40s_linear_infinite]')}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroRibbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M160 40
             C230 40 280 90 280 150
             C280 210 230 250 170 250
             C120 250 90 220 90 180
             C90 145 115 120 150 120
             C185 120 205 145 205 175
             C205 200 188 215 165 215"
          fill="none"
          stroke="url(#heroRibbonGradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
