import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

/**
 * "Aurora gradients" / "animated gradient blobs" / "aurora background
 * animation" — this was already a 2-blob teal-only version (Phase 2);
 * upgraded here to use the new accent family (teal/cyan/blue/purple)
 * across three blobs, still transform-only and still fully skipped under
 * reduced motion rather than just slowed down. Fixed, behind everything,
 * pointer-events-none — unchanged from Phase 2's structure, only the
 * color range and blob count changed.
 */
export function AmbientBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className={cn(
          'absolute -left-1/4 top-0 h-[42rem] w-[42rem] rounded-full bg-accent opacity-[0.07] blur-[130px]',
          !prefersReducedMotion && 'animate-[float-glow_18s_ease-in-out_infinite]'
        )}
      />
      <div
        className={cn(
          'absolute -right-1/4 top-[45vh] h-[38rem] w-[38rem] rounded-full bg-accent-purple opacity-[0.05] blur-[130px]',
          !prefersReducedMotion && 'animate-[float-glow_22s_ease-in-out_infinite_reverse]'
        )}
      />
      <div
        className={cn(
          'absolute left-1/4 top-[85vh] h-[34rem] w-[34rem] rounded-full bg-accent-blue opacity-[0.05] blur-[130px]',
          !prefersReducedMotion && 'animate-[float-glow_26s_ease-in-out_infinite]'
        )}
      />
    </div>
  );
}
