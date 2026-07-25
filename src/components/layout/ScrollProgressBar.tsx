import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Phase 2's scroll progress indicator. Uses Framer's own useScroll, which
 * reads the page's scroll position directly — it doesn't need to know
 * about Lenis at all (Lenis modifies the same scroll position useScroll
 * reads, it doesn't replace it), so there's no risk of the two systems
 * fighting the way a second smooth-scroll implementation would.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-modal h-0.5 origin-left bg-accent"
      aria-hidden="true"
    />
  );
}
