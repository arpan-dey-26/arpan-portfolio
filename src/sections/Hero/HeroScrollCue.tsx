import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * A small functional detail, not pure decoration — signals there's more
 * below without requiring the person to guess, and fills the bottom of a
 * full-viewport Hero with something purposeful rather than empty space.
 * Uses a plain #hero anchor... actually scrolls to the next section
 * directly, and goes through the same Lenis-aware anchor click handling
 * every other in-page link in this codebase already does (useLenis's
 * document-level click listener), not a bespoke scroll call.
 */
export function HeroScrollCue() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href="#about"
      aria-label="Scroll to About section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-tertiary transition-colors duration-fast ease-standard hover:text-text-secondary"
    >
      <motion.svg
        width="20"
        height="32"
        viewBox="0 0 20 32"
        fill="none"
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" />
      </motion.svg>
    </motion.a>
  );
}
