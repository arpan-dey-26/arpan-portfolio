import type { HTMLMotionProps } from 'framer-motion';
import { useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Shared 3D mouse-tilt — this exact pattern was written twice already
 * (Hero.tsx's visual slot, then HeroPhoto.tsx), which is exactly the
 * "duplicated animation logic" the Phase 3 brief asked to refactor.
 * Extracted here so Featured Projects' card tilt reuses it too, rather
 * than becoming a third copy. Same gating as every other pointer-driven
 * effect: real pointer + reduced motion.
 *
 * Handler typing fix (real TS2322 build error, same root cause as
 * useMagneticHover.ts): these are spread onto <motion.article>/<motion.div>
 * elements in three different components, so they must satisfy Framer's
 * own prop types exactly, not a hand-typed `React.MouseEvent<HTMLElement>`
 * signature. `handlers` is annotated with Framer's own `HTMLMotionProps`
 * picked type so TypeScript infers each callback's parameter correctly
 * from that annotation, rather than guessing Framer's exact event union.
 */
export function useTilt(strength = 8) {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rotateYValue, { stiffness: 150, damping: 20 });

  const handlers: Pick<HTMLMotionProps<'div'>, 'onMouseMove' | 'onMouseLeave'> = {
    onMouseMove: (event) => {
      if (!enabled) return;
      if (!('clientX' in event) || !('clientY' in event)) return;
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) return;
      const rect = target.getBoundingClientRect();
      const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      rotateYValue.set(relX * strength);
      rotateXValue.set(relY * -strength);
    },
    onMouseLeave: () => {
      rotateXValue.set(0);
      rotateYValue.set(0);
    },
  };

  return {
    style: { rotateX, rotateY, transformPerspective: 1000 },
    handlers,
  };
}
