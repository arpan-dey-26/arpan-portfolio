import Spline from '@splinetool/react-spline';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { HeroFallbackVisual } from './HeroFallbackVisual';

// No Spline scene has been authored yet. Scenes are built in Spline's own
// visual editor (Design System §9.1 — "a personal brand mark or
// continuous-ribbon form"), not generated here — that's a design task, not
// a data or code gap. Once one exists, publish it and paste its scene URL
// below; everything around it (lazy loading, every fallback tier, reduced
// motion) already works correctly without further changes.
const SPLINE_SCENE_URL = '';

/**
 * Architecture §15 (Premium 3D Experience Blueprint). Three independent,
 * unrelated reasons can each trigger the fallback instead of the live
 * scene — no scene configured, reduced motion on, or viewport below the
 * mobile cutoff (§15.8/§15.9) — and all three resolve to the exact same
 * fallback visual.
 *
 * Loaded via React.lazy from Hero.tsx (§15.7) — this module, and the
 * @splinetool/react-spline it imports, are only fetched once Hero's
 * critical text content has already rendered.
 */
export function HeroSplineScene() {
  const prefersReducedMotion = useReducedMotion();
  const isAboveMobileCutoff = useMediaQuery('(min-width: 480px)');

  if (!SPLINE_SCENE_URL || prefersReducedMotion || !isAboveMobileCutoff) {
    return <HeroFallbackVisual />;
  }

  return <Spline scene={SPLINE_SCENE_URL} className="h-full w-full" />;
}

export default HeroSplineScene;
