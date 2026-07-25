import type { HTMLMotionProps } from 'framer-motion';
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
 * Handler typing fix (real TS2322 build error from an actual production
 * build): these are spread directly onto <motion.button>/<motion.a>
 * elements, so they must satisfy Framer Motion's OWN prop types exactly
 * — Framer's pointer-related handlers accept a broader native event
 * union (MouseEvent | TouchEvent | PointerEvent) than a plain
 * `React.MouseEvent<HTMLElement>` handler promises to handle, and a
 * narrower-parameter function isn't assignable to a slot expecting a
 * wider one. Rather than guess Framer's exact union and hand-type it
 * (real risk of guessing wrong again), `handlers` is annotated with
 * Framer's own `HTMLMotionProps<'div'>` picked type — TypeScript then
 * infers each callback's parameter type FROM that annotation
 * automatically, guaranteed to match whatever Framer actually declares
 * without needing to know or restate it. `'clientX' in event` narrows
 * the resulting union safely (excludes plain TouchEvent, which doesn't
 * carry clientX/clientY directly) — no `any`, no type assertion.
 */
export function useMagneticHover(strength = 0.25) {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  const handlers: Pick<HTMLMotionProps<'div'>, 'onMouseMove' | 'onMouseLeave'> = {
    onMouseMove: (event) => {
      if (!enabled) return;
      if (!('clientX' in event) || !('clientY' in event)) return;
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) return;
      const rect = target.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
  };

  return {
    style: { x: springX, y: springY },
    handlers: enabled ? handlers : {},
  };
}
