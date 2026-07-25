import type { MouseEvent } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Phase 2's "magnetic hover (desktop only)." Gated on two independent
 * checks — a real mouse/trackpad (`hover: hover` + `pointer: fine`, not
 * just a viewport-width breakpoint, since a touch laptop at desktop width
 * still has no meaningful "hover") and reduced motion. Uses
 * event.currentTarget's own bounding rect rather than a separate ref, so
 * this doesn't need merging with Button's existing forwarded ref.
 */
export function useMagneticHover(strength = 0.25) {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return {
    style: { x: springX, y: springY },
    handlers: enabled ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } : {},
  };
}
