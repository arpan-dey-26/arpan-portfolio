import type { MouseEvent } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Shared 3D mouse-tilt — this exact pattern was written twice already
 * (Hero.tsx's visual slot, then HeroPhoto.tsx), which is exactly the
 * "duplicated animation logic" the Phase 3 brief asked to refactor.
 * Extracted here so Featured Projects' card tilt (new) reuses it too,
 * rather than becoming a third copy. Same gating as every other
 * pointer-driven effect: real pointer + reduced motion.
 */
export function useTilt(strength = 8) {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rotateYValue, { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rotateYValue.set(relX * strength);
    rotateXValue.set(relY * -strength);
  }

  function handleMouseLeave() {
    rotateXValue.set(0);
    rotateYValue.set(0);
  }

  return {
    style: { rotateX, rotateY, transformPerspective: 1000 },
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}
