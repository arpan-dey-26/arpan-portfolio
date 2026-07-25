import type { MouseEventHandler } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Phase 2's "magnetic hover (desktop only)." Gated on two independent
 * checks — a real mouse/trackpad (`hover: hover` + `pointer: fine`, not
 * just a viewport-width breakpoint, since a touch laptop at desktop width
 * still has no meaningful "hover") and reduced motion.
 *
 * Handler typing — corrected root-cause fix, replacing a wrong one:
 * these handlers get spread onto <motion.button>, <motion.a>, AND plain
 * <motion.div>-based components across the codebase. An earlier fix
 * assumed Framer broadens onMouseMove/onMouseLeave to accept native
 * MouseEvent|TouchEvent|PointerEvent and extracted a type from
 * HTMLMotionProps<'div'> to match — that was wrong on two counts: (1)
 * Framer actually uses standard React synthetic event types for these,
 * parameterized per-tag exactly like vanilla React, and only genuine
 * Framer-specific gesture props (onDrag/onPan/onTap) get a broadened
 * signature; (2) tying the type to 'div' specifically meant these
 * handlers no longer satisfied <motion.button>/<motion.a>, which is
 * exactly the regression a real build caught. `MouseEventHandler<HTMLElement>`
 * (the generic base, not any specific tag) is the correct fix: a handler
 * that only needs HTMLElement-level features is safely assignable
 * wherever a handler for any more specific element is expected, since
 * every HTML element interface extends HTMLElement.
 */
export function useMagneticHover(strength = 0.25) {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave: MouseEventHandler<HTMLElement> = () => {
    x.set(0);
    y.set(0);
  };

  return {
    style: { x: springX, y: springY },
    handlers: enabled ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } : {},
  };
}
