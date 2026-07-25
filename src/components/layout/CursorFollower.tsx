import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"]';

/**
 * Phase 2 built the follower itself; Phase 3 adds the one piece that was
 * genuinely missing — scaling up over interactive elements, via a
 * delegated mouseover/mouseout check against INTERACTIVE_SELECTOR, so the
 * cursor itself signals "this is clickable" the way a premium product
 * site's cursor system usually does. Same gating as before (real pointer
 * + reduced motion) and still pointer-events-none throughout.
 */
export function CursorFollower() {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.3 });

  useEffect(() => {
    if (!enabled) return;

    function handleMouseMove(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }
    function handleMouseOver(event: MouseEvent) {
      if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        setIsHoveringInteractive(true);
      }
    }
    function handleMouseOut(event: MouseEvent) {
      if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        setIsHoveringInteractive(false);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      animate={{ scale: isHoveringInteractive ? 2.5 : 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed left-0 top-0 z-skip-link h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent mix-blend-difference"
    />
  );
}
