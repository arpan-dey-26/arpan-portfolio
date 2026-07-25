import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

/**
 * "Animated light rays" / "depth fog" — two soft diagonal beams, fixed
 * behind everything alongside AmbientBackground/Starfield. Kept as its
 * own small component rather than folded into AmbientBackground: rays
 * are a genuinely different visual technique (a rotated linear-gradient
 * wedge, not a blurred radial blob), and separating them keeps each
 * component doing one clearly-named thing.
 *
 * Deliberately understated: 4-6% opacity, no color beyond the existing
 * accent, and the "movement" is just the same slow float-glow keyframe
 * AmbientBackground already uses (reused, not a second animation
 * defined for what's visually a similar kind of drift).
 */
export function LightRays() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className={cn(
          'absolute left-[10%] top-[-10%] h-[140vh] w-40 origin-top rotate-[18deg] opacity-[0.05]',
          !prefersReducedMotion && 'animate-[float-glow_24s_ease-in-out_infinite]'
        )}
        style={{ background: 'linear-gradient(180deg, rgba(94, 234, 212, 0.5), transparent 70%)' }}
      />
      <div
        className={cn(
          'absolute right-[18%] top-[-15%] h-[130vh] w-32 origin-top rotate-[-14deg] opacity-[0.04]',
          !prefersReducedMotion && 'animate-[float-glow_30s_ease-in-out_infinite_reverse]'
        )}
        style={{ background: 'linear-gradient(180deg, rgba(196, 181, 253, 0.5), transparent 70%)' }}
      />
    </div>
  );
}
